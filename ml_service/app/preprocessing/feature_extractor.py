"""
Phase-4 – Feature Extractor
Provides:
  1. Per-prompt rule-based features (Phase-3, unchanged)
  2. Session-level behavioral features (Phase-4, NEW)
"""

import re
import math
import logging
from typing import List, Dict, Any

import numpy as np

from app.inference.threshold_config import MIN_PROMPTS_FOR_BEHAVIOR

logger = logging.getLogger("ml_service.feature_extractor")

# ═══════════════════════════════════════════════════════════════════════
# PHASE-3 — Per-Prompt Rule-Based Features (unchanged)
# ═══════════════════════════════════════════════════════════════════════

OVERRIDE_KEYWORDS = [
    "ignore",
    "system prompt",
    "developer",
    "reveal",
    "override",
    "disregard",
    "bypass",
    "previous instructions",
    "hidden instructions",
    "internal",
    "show me your prompt",
    "jailbreak",
]

MAX_ENTROPY = 5.0


def calculate_entropy(text: str) -> float:
    """Calculate Shannon entropy of the input string."""
    if not text:
        return 0.0
    entropy = 0.0
    for x in range(256):
        p_x = float(text.count(chr(x))) / len(text)
        if p_x > 0:
            entropy += -p_x * math.log(p_x, 2)
    return entropy


def extract_features(prompt: str) -> dict:
    """Extract per-prompt features for anomaly / logging."""
    features = {}
    features["length"] = len(prompt)
    features["token_count"] = len(prompt.split())
    features["override_keyword_count"] = sum(
        1 for k in OVERRIDE_KEYWORDS if k in prompt.lower()
    )
    special_chars = re.sub(r"[a-zA-Z0-9\s]", "", prompt)
    features["special_char_ratio"] = (
        len(special_chars) / len(prompt) if len(prompt) > 0 else 0
    )
    features["entropy"] = calculate_entropy(prompt)
    return features


def compute_rule_score(prompt: str) -> dict:
    """
    Compute a normalized 0-1 rule-based injection score.
    Used as the 'rule_score' component of hybrid scoring.
    """
    prompt_lower = prompt.lower()
    triggered = [kw for kw in OVERRIDE_KEYWORDS if kw in prompt_lower]
    keyword_count = len(triggered)
    keyword_score = min(keyword_count / 5, 1.0)
    entropy = calculate_entropy(prompt)
    entropy_score = min(entropy / MAX_ENTROPY, 1.0)
    rule_score = 0.7 * keyword_score + 0.3 * entropy_score
    rule_score = min(max(rule_score, 0.0), 1.0)
    return {
        "rule_score": round(rule_score, 4),
        "keywords_triggered": triggered,
    }


# ═══════════════════════════════════════════════════════════════════════
# PHASE-4 — Session-Level Behavioral Features (NEW)
# ═══════════════════════════════════════════════════════════════════════

# Feature names in order — used for model training and inference
SESSION_FEATURE_NAMES = [
    "total_prompts",
    "avg_injection_score",
    "max_injection_score",
    "prompt_frequency",
    "blocked_ratio",
    "tool_violation_count",
    "similarity_mean",
    "time_gap_variance",
    "severity_slope",
    "session_duration_minutes",
]

FEATURE_COUNT = len(SESSION_FEATURE_NAMES)


class SessionFeatureExtractor:
    """
    Extracts a fixed-length numerical feature vector from session prompt logs.

    Each prompt log is expected to be a dict with:
        - prompt: str
        - injection_score: float (0-1)
        - blocked: bool
        - timestamp: float (unix epoch seconds)
        - tool_violations: int (optional, default 0)
    """

    def extract(
        self,
        prompt_logs: List[Dict[str, Any]],
        similarity_mean: float = 0.0,
    ) -> np.ndarray:
        """
        Extract 10-dimensional behavioral feature vector.

        Args:
            prompt_logs: list of prompt log dicts from the session
            similarity_mean: precomputed from EmbeddingEngine

        Returns:
            np.ndarray of shape (10,)
        """
        n = len(prompt_logs)

        if n == 0:
            return np.zeros(FEATURE_COUNT, dtype=np.float64)

        # ── Core metrics ────────────────────────────────────────────
        injection_scores = [
            float(p.get("injection_score", 0.0)) for p in prompt_logs
        ]
        blocked_flags = [bool(p.get("blocked", False)) for p in prompt_logs]
        tool_violations = [int(p.get("tool_violations", 0)) for p in prompt_logs]
        timestamps = sorted(
            [float(p.get("timestamp", 0.0)) for p in prompt_logs]
        )

        total_prompts = float(n)
        avg_injection = float(np.mean(injection_scores))
        max_injection = float(np.max(injection_scores))
        blocked_ratio = sum(blocked_flags) / n
        tool_violation_count = float(sum(tool_violations))

        # ── Prompt frequency (prompts per minute) ───────────────────
        if len(timestamps) >= 2:
            duration_sec = timestamps[-1] - timestamps[0]
            duration_min = max(duration_sec / 60.0, 1e-6)  # avoid division by 0
            prompt_frequency = n / duration_min
            session_duration_minutes = duration_sec / 60.0
        else:
            prompt_frequency = 0.0
            session_duration_minutes = 0.0

        # ── Time gap variance ───────────────────────────────────────
        if n >= MIN_PROMPTS_FOR_BEHAVIOR and len(timestamps) >= 2:
            gaps = np.diff(timestamps)
            time_gap_variance = float(np.var(gaps)) if len(gaps) > 0 else 0.0
        else:
            time_gap_variance = 0.0

        # ── Severity slope (escalation detection) ───────────────────
        if n >= 2:
            severity_slope = max_injection - injection_scores[0]
        else:
            severity_slope = 0.0

        # ── Minimum Prompt Guard ────────────────────────────────────
        # With too few prompts, behavioral features are unstable
        if n < MIN_PROMPTS_FOR_BEHAVIOR:
            similarity_mean = 0.0
            time_gap_variance = 0.0

        feature_vector = np.array(
            [
                total_prompts,
                avg_injection,
                max_injection,
                prompt_frequency,
                blocked_ratio,
                tool_violation_count,
                similarity_mean,
                time_gap_variance,
                severity_slope,
                session_duration_minutes,
            ],
            dtype=np.float64,
        )

        logger.debug(
            f"Session features [{n} prompts]: "
            + ", ".join(
                f"{name}={val:.4f}"
                for name, val in zip(SESSION_FEATURE_NAMES, feature_vector)
            )
        )

        return feature_vector
