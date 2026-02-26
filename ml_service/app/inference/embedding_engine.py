"""
Phase-4 – Embedding Engine
Sentence-transformer based semantic similarity for probing detection.
Uses all-MiniLM-L6-v2 (384-dim, ~80MB) loaded once at startup.
"""

import logging
from typing import Dict, List, Optional
from itertools import combinations

import numpy as np

from app.inference.threshold_config import (
    EMBEDDING_MODEL_NAME,
    PROBING_SIMILARITY_THRESHOLD,
    MAX_SIMILARITY_PAIRS,
    MIN_PROMPTS_FOR_BEHAVIOR,
)

logger = logging.getLogger("ml_service.embedding_engine")


class EmbeddingEngine:
    """
    Encodes prompts into dense embeddings and computes pairwise
    cosine similarity for semantic probing detection.
    """

    def __init__(self):
        self._model = None
        self._model_name = EMBEDDING_MODEL_NAME
        self._cache: Dict[str, np.ndarray] = {}

    # ─── Lazy loading (called once at startup or first use) ──────
    def load(self) -> bool:
        """Load the sentence-transformer model. Returns True on success."""
        if self._model is not None:
            return True
        try:
            from sentence_transformers import SentenceTransformer

            logger.info(f"Loading embedding model: {self._model_name} ...")
            self._model = SentenceTransformer(self._model_name)
            logger.info(
                f"[STARTUP] EmbeddingEngine loaded | model: {self._model_name}"
            )
            return True
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            return False

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    # ─── Single encoding (with cache) ───────────────────────────
    def encode(self, text: str) -> Optional[np.ndarray]:
        """Encode text into a dense vector (384-dim). Cached per session."""
        if not self.is_loaded:
            logger.warning("EmbeddingEngine not loaded, returning None.")
            return None

        # Cache hit — skip recomputation for identical prompts
        if text in self._cache:
            return self._cache[text]

        try:
            embedding = self._model.encode(text, convert_to_numpy=True)
            self._cache[text] = embedding
            return embedding
        except Exception as e:
            logger.error(f"Embedding encode error: {e}")
            return None

    def clear_cache(self):
        """Clear the per-session embedding cache."""
        self._cache.clear()

    # ─── Pairwise similarity ────────────────────────────────────
    def compute_session_similarity(
        self, prompts: List[str]
    ) -> Dict[str, object]:
        """
        Compute pairwise cosine similarity for session prompts.

        Returns:
            {
                "similarity_mean": float,
                "high_similarity_count": int,
                "probing_detected": bool,
            }
        """
        default = {
            "similarity_mean": 0.0,
            "high_similarity_count": 0,
            "probing_detected": False,
        }

        if not self.is_loaded:
            logger.warning("EmbeddingEngine not loaded, returning defaults.")
            return default

        n = len(prompts)
        if n < MIN_PROMPTS_FOR_BEHAVIOR:
            return default

        # Clear cache for fresh session analysis
        self.clear_cache()

        # Encode all prompts
        embeddings = []
        for p in prompts:
            emb = self.encode(p)
            if emb is not None:
                embeddings.append(emb)

        if len(embeddings) < 2:
            return default

        # Build pair indices — cap at MAX_SIMILARITY_PAIRS
        # Use sliding window to prioritize sequential pairs
        all_pairs = list(combinations(range(len(embeddings)), 2))
        if len(all_pairs) > MAX_SIMILARITY_PAIRS:
            # Prefer sequential pairs (more likely to reveal probing)
            sequential = [(i, i + 1) for i in range(len(embeddings) - 1)]
            remaining = [p for p in all_pairs if p not in sequential]
            pairs = sequential[: MAX_SIMILARITY_PAIRS]
            budget = MAX_SIMILARITY_PAIRS - len(pairs)
            if budget > 0:
                pairs.extend(remaining[:budget])
        else:
            pairs = all_pairs

        # Cosine similarity
        similarities = []
        for i, j in pairs:
            a, b = embeddings[i], embeddings[j]
            norm_a = np.linalg.norm(a)
            norm_b = np.linalg.norm(b)
            if norm_a == 0 or norm_b == 0:
                similarities.append(0.0)
            else:
                sim = float(np.dot(a, b) / (norm_a * norm_b))
                similarities.append(sim)

        sim_mean = float(np.mean(similarities)) if similarities else 0.0
        high_count = sum(
            1 for s in similarities if s >= PROBING_SIMILARITY_THRESHOLD
        )
        # Probing = 2+ pairs above threshold
        probing_detected = high_count >= 2

        logger.info(
            f"Embedding similarity: mean={sim_mean:.4f}, "
            f"high_pairs={high_count}/{len(pairs)}, "
            f"probing={'YES' if probing_detected else 'no'}"
        )

        return {
            "similarity_mean": round(sim_mean, 4),
            "high_similarity_count": high_count,
            "probing_detected": probing_detected,
        }


# ─── Global singleton ──────────────────────────────────────────────
_embedding_engine: Optional[EmbeddingEngine] = None


def get_embedding_engine() -> EmbeddingEngine:
    """Get or create the global EmbeddingEngine singleton."""
    global _embedding_engine
    if _embedding_engine is None:
        _embedding_engine = EmbeddingEngine()
    return _embedding_engine


def load_embedding_engine() -> bool:
    """Explicitly trigger model loading (called from main.py startup)."""
    engine = get_embedding_engine()
    return engine.load()
