"""
Phase-3 – Centralized Threshold & Model Configuration
All detection thresholds, labels, and model constants in one place.
"""

# ─── Detection Thresholds ───────────────────────────────────────────
INJECTION_THRESHOLD = 0.65      # Primary detection threshold (flag)
BLOCK_THRESHOLD = 0.85          # Auto-block threshold
FLAG_THRESHOLD = 0.65           # Flag for review threshold

# ─── Labels ─────────────────────────────────────────────────────────
SAFE_LABEL = "safe"
INJECTION_LABEL = "injection"

# ─── Model Configuration ────────────────────────────────────────────
MODEL_VERSION = "v1.0_distilbert_2026_02"
MAX_SEQUENCE_LENGTH = 256       # Max tokens for DistilBERT tokenizer

# ─── Hybrid Scoring ─────────────────────────────────────────────────
USE_HYBRID = True               # Toggle hybrid (BERT + rule-based) mode
HYBRID_BERT_WEIGHT = 0.8        # DistilBERT contribution to final score
HYBRID_RULE_WEIGHT = 0.2        # Rule-engine contribution to final score
