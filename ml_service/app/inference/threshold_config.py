"""
Phase-4 – Centralized Threshold & Model Configuration
All detection thresholds, labels, UEBA settings, and model constants.
"""

# ═══════════════════════════════════════════════════════════════════════
# PHASE-3 — Injection Detection
# ═══════════════════════════════════════════════════════════════════════

# ─── Detection Thresholds ───────────────────────────────────────────
INJECTION_THRESHOLD = 0.65      # Primary detection threshold (flag)
BLOCK_THRESHOLD = 0.85          # Auto-block threshold
FLAG_THRESHOLD = 0.65           # Flag for review threshold

# ─── Labels ─────────────────────────────────────────────────────────
SAFE_LABEL = "safe"
INJECTION_LABEL = "injection"

# ─── Model Configuration ────────────────────────────────────────────
MODEL_VERSION = "v4.0_distilbert_ueba_2026_02"
MAX_SEQUENCE_LENGTH = 256       # Max tokens for DistilBERT tokenizer

# ─── Hybrid Scoring ─────────────────────────────────────────────────
USE_HYBRID = True               # Toggle hybrid (BERT + rule-based) mode
HYBRID_BERT_WEIGHT = 0.8        # DistilBERT contribution to final score
HYBRID_RULE_WEIGHT = 0.2        # Rule-engine contribution to final score

# ═══════════════════════════════════════════════════════════════════════
# PHASE-4 — UEBA (Behavioral Analytics)
# ═══════════════════════════════════════════════════════════════════════

# ─── Embedding Engine ───────────────────────────────────────────────
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"   # Sentence-transformer model
PROBING_SIMILARITY_THRESHOLD = 0.75          # Cosine sim above = probing
MAX_SIMILARITY_PAIRS = 20                    # Cap pairwise comparisons

# ─── Session Feature Guard ──────────────────────────────────────────
MIN_PROMPTS_FOR_BEHAVIOR = 3    # Below this, zero out behavioral features

# ─── Anomaly Detection (Isolation Forest) ───────────────────────────
ANOMALY_CONTAMINATION_RATE = 0.05   # Expected fraction of anomalous sessions
ANOMALY_N_ESTIMATORS = 100          # Number of trees in Isolation Forest
ANOMALY_DECISION_THRESHOLD = -0.1   # Raw IF score below this = anomaly

# ─── Risk Engine Weights ────────────────────────────────────────────
RISK_WEIGHT_INJECTION = 0.5     # max_injection_score contribution
RISK_WEIGHT_ANOMALY = 0.3       # anomaly_score contribution
RISK_WEIGHT_TOOL = 0.2          # tool_violation_score contribution

# ─── Risk Level Thresholds ──────────────────────────────────────────
RISK_LEVEL_LOW = 0.3            # 0.0 – 0.3  → "low"
RISK_LEVEL_MEDIUM = 0.6         # 0.3 – 0.6  → "medium"
RISK_LEVEL_HIGH = 0.8           # 0.6 – 0.8  → "high"
                                # 0.8 – 1.0  → "critical"

# ─── UEBA Toggle ────────────────────────────────────────────────────
UEBA_ENABLED = True             # Master switch for Phase-4 behavioral analysis
