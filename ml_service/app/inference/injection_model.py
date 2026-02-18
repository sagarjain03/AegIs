"""
Phase-3 – DistilBERT Injection Model Inference
Replaces sklearn/TF-IDF pipeline with transformer-based classification.
Supports hybrid scoring (BERT + rule-based) for enhanced detection.
"""

import os
import re
import time
import logging

import torch
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification

from app.inference.threshold_config import (
    INJECTION_THRESHOLD,
    BLOCK_THRESHOLD,
    SAFE_LABEL,
    INJECTION_LABEL,
    MODEL_VERSION,
    MAX_SEQUENCE_LENGTH,
    USE_HYBRID,
    HYBRID_BERT_WEIGHT,
    HYBRID_RULE_WEIGHT,
)
from app.preprocessing.feature_extractor import compute_rule_score

# ─── Logging ────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")
logger = logging.getLogger("ml_service")


# ─── DistilBERT Injection Model ────────────────────────────────────
class InjectionModel:
    """Transformer-based prompt injection classifier."""

    def __init__(self, model_path: str):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        logger.info(f"Loading DistilBERT model from {model_path} ...")
        self.tokenizer = DistilBertTokenizerFast.from_pretrained(model_path)
        self.model = DistilBertForSequenceClassification.from_pretrained(model_path)

        self.model.to(self.device)
        self.model.eval()

        # ── Model warmup (reduces first-inference latency spike) ──
        self._warmup()

        logger.info(
            f"[STARTUP] InjectionModel loaded  |  version: {MODEL_VERSION}  "
            f"|  device: {self.device}"
        )

    # ── Warmup ──────────────────────────────────────────────────────
    def _warmup(self):
        """Run a dummy forward pass so that lazy CUDA / graph init happens now."""
        try:
            dummy = self.tokenizer("warmup", return_tensors="pt", truncation=True)
            dummy = {k: v.to(self.device) for k, v in dummy.items()}
            with torch.no_grad():
                self.model(**dummy)
            logger.info("[STARTUP] Model warmup complete.")
        except Exception as e:
            logger.warning(f"[STARTUP] Model warmup failed (non-critical): {e}")

    # ── Single-prompt prediction ────────────────────────────────────
    def predict(self, prompt: str) -> dict:
        """
        Tokenize → forward pass → softmax → structured result.
        Returns dict with label, confidence, injection_score.
        """
        try:
            inputs = self.tokenizer(
                prompt,
                return_tensors="pt",
                truncation=True,
                padding=True,
                max_length=MAX_SEQUENCE_LENGTH,
            )
            inputs = {k: v.to(self.device) for k, v in inputs.items()}

            with torch.no_grad():
                outputs = self.model(**inputs)
                probs = torch.nn.functional.softmax(outputs.logits, dim=1)
                confidence, pred = torch.max(probs, dim=1)

            label = INJECTION_LABEL if pred.item() == 1 else SAFE_LABEL
            return {
                "label": label,
                "confidence": float(confidence.item()),
                "injection_score": float(probs[0][1].item()),
            }

        except Exception as e:
            logger.error(f"DistilBERT inference error: {e}")
            return {
                "label": SAFE_LABEL,
                "confidence": 0.0,
                "injection_score": 0.0,
                "error": str(e),
            }


# ─── Global model instance ─────────────────────────────────────────
_injection_model: InjectionModel | None = None


def _get_model() -> InjectionModel | None:
    """Lazy-load singleton. Called once at startup via load_injection_model()."""
    global _injection_model
    if _injection_model is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, "models", "distilbert_injection_model")
        try:
            _injection_model = InjectionModel(model_path)
        except Exception as e:
            logger.error(f"Failed to load InjectionModel: {e}")
    return _injection_model


def load_injection_model():
    """Explicitly trigger model loading (called from main.py startup)."""
    return _get_model()


# ─── Input cleaning ────────────────────────────────────────────────
def clean_input(prompt: str) -> str:
    """Lowercase, strip, remove excessive whitespace."""
    if not prompt:
        return ""
    prompt = prompt.lower().strip()
    prompt = re.sub(r"\s+", " ", prompt)
    return prompt


# ─── Explanation generator ──────────────────────────────────────────
def _build_explanation(final_score: float, keywords_triggered: list[str]) -> str:
    """Generate a human-readable explanation aligned with threshold_config."""
    if final_score >= BLOCK_THRESHOLD:
        base = "High confidence override attempt"
    elif final_score >= INJECTION_THRESHOLD:
        base = "Moderate injection probability"
    else:
        return f"Low injection risk. Score: {final_score:.4f}"

    if keywords_triggered:
        return f"{base} — keywords: {', '.join(keywords_triggered)}"
    return f"{base}. Score: {final_score:.4f}"


# ─── Public API (same signature as Phase-2) ─────────────────────────
def analyze_injection(prompt: str, session_id: str = "unknown") -> dict:
    """
    Analyse a prompt for injection.  Returns the same dict shape as Phase-2:
        label, confidence, injection_score, explanation, keywords_triggered
    """
    # 1. Empty-prompt guard
    if not prompt:
        logger.warning(f"Session: {session_id} | Empty prompt received.")
        return {
            "label": SAFE_LABEL,
            "confidence": 1.0,
            "injection_score": 0.0,
            "explanation": "Empty prompt received.",
            "keywords_triggered": [],
            "model_version": MODEL_VERSION,
            "inference_time_ms": 0.0,
        }

    cleaned = clean_input(prompt)

    # 2. Ensure model is loaded
    model = _get_model()
    if model is None:
        logger.error("Model not loaded during inference request.")
        return {
            "label": "error",
            "confidence": 0.0,
            "injection_score": 0.0,
            "explanation": "Model not loaded.",
            "keywords_triggered": [],
            "model_version": MODEL_VERSION,
            "inference_time_ms": 0.0,
        }

    try:
        start = time.time()

        # 3. DistilBERT prediction
        bert_result = model.predict(cleaned)
        bert_score = bert_result["injection_score"]

        # 4. Hybrid scoring (configurable via threshold_config)
        rule_result = compute_rule_score(cleaned)
        rule_score = rule_result["rule_score"]
        keywords_triggered = rule_result["keywords_triggered"]

        if USE_HYBRID:
            final_score = (
                HYBRID_BERT_WEIGHT * bert_score
                + HYBRID_RULE_WEIGHT * rule_score
            )
            final_score = min(final_score, 1.0)  # clamp to avoid overflow
        else:
            final_score = bert_score

        # 5. Label decision
        if final_score >= INJECTION_THRESHOLD:
            label = INJECTION_LABEL
            confidence = final_score
        else:
            label = SAFE_LABEL
            confidence = 1.0 - final_score

        # 6. Explanation
        explanation = _build_explanation(final_score, keywords_triggered if label == INJECTION_LABEL else [])

        inference_ms = round((time.time() - start) * 1000, 2)

        # 7. Structured logging
        logger.info(
            f"Session: {session_id} | len={len(prompt)} | "
            f"bert={bert_score:.4f} rule={rule_score:.4f} final={final_score:.4f} | "
            f"label={label} | {inference_ms}ms"
        )

        return {
            "label": label,
            "confidence": round(confidence, 4),
            "injection_score": round(final_score, 4),
            "explanation": explanation,
            "keywords_triggered": keywords_triggered if label == INJECTION_LABEL else [],
            "model_version": MODEL_VERSION,
            "inference_time_ms": inference_ms,
        }

    except Exception as e:
        logger.error(f"Error during inference: {e}")
        return {
            "label": "error",
            "confidence": 0.0,
            "injection_score": 0.0,
            "explanation": f"Inference Error: {str(e)}",
            "keywords_triggered": [],
            "model_version": MODEL_VERSION,
            "inference_time_ms": 0.0,
        }
