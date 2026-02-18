"""
Phase-3 – Feature Extractor & Rule-Based Score
Provides complementary rule-based features for hybrid scoring.
"""

import re
import math

# ─── Override keywords the rule engine watches for ──────────────────
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

MAX_ENTROPY = 5.0  # Approximate max Shannon entropy for English text


# ─── Shannon entropy ────────────────────────────────────────────────
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


# ─── Raw feature extraction (kept for anomaly / logging) ────────────
def extract_features(prompt: str) -> dict:
    """
    Extracts features from a prompt for anomaly detection.
    """
    features = {}

    # Basic features
    features["length"] = len(prompt)
    features["token_count"] = len(prompt.split())

    # Keyword analysis
    features["override_keyword_count"] = sum(
        1 for k in OVERRIDE_KEYWORDS if k in prompt.lower()
    )

    # Special character analysis
    special_chars = re.sub(r"[a-zA-Z0-9\s]", "", prompt)
    features["special_char_ratio"] = (
        len(special_chars) / len(prompt) if len(prompt) > 0 else 0
    )

    # Entropy
    features["entropy"] = calculate_entropy(prompt)

    return features


# ─── Normalized rule score for hybrid mode ──────────────────────────
def compute_rule_score(prompt: str) -> dict:
    """
    Compute a normalized 0-1 rule-based injection score.
    Used as the 'rule_score' component of hybrid scoring.

    Returns:
        {
            "rule_score": float (0–1),
            "keywords_triggered": list[str]
        }
    """
    prompt_lower = prompt.lower()

    # 1. Keyword component (0–1)
    triggered = [kw for kw in OVERRIDE_KEYWORDS if kw in prompt_lower]
    keyword_count = len(triggered)
    keyword_score = min(keyword_count / 5, 1.0)

    # 2. Entropy component (0–1)
    entropy = calculate_entropy(prompt)
    entropy_score = min(entropy / MAX_ENTROPY, 1.0)

    # 3. Combined rule score (keyword-dominant)
    rule_score = 0.7 * keyword_score + 0.3 * entropy_score
    rule_score = min(max(rule_score, 0.0), 1.0)  # clamp [0, 1]

    return {
        "rule_score": round(rule_score, 4),
        "keywords_triggered": triggered,
    }
