# AegisAI – Phase-4 UEBA Walkthrough

## What Changed

Phase-4 introduces **User & Entity Behavior Analytics (UEBA)** — session-level behavioral abuse detection. AegisAI now asks _"Is this session behaving like an attacker?"_ instead of just _"Is this prompt malicious?"_

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│  POST /analyze_session                                       │
│  { session_id, prompt_logs[] }                               │
└──────────────┬───────────────────────────────────────────────┘
               │
    ┌──────────▼──────────┐
    │   Session Analyzer   │  ← Central orchestrator
    └──┬────┬────┬────┬───┘
       │    │    │    │
       ▼    ▼    ▼    ▼
   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
   │Embed │ │Feat  │ │Anom  │ │Risk  │
   │Engine│ │Extr  │ │Model │ │Engine│
   └──────┘ └──────┘ └──────┘ └──────┘
   MiniLM   10-dim    Isol.    Weighted
   L6-v2    vector    Forest   Formula
```

---

## Files Modified/Created

### Modified Files

| File                                 | Changes                                                                                                                          |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `inference/threshold_config.py`      | Added UEBA config: probing threshold, risk weights/levels, embedding model, anomaly settings, min prompt guard                   |
| `inference/embedding_engine.py`      | Complete rewrite: real `EmbeddingEngine` with `all-MiniLM-L6-v2`, per-session cache, pairwise similarity with `MAX_PAIRS=20` cap |
| `inference/anomaly_model.py`         | Complete rewrite: `AnomalyDetector` with IsolationForest, bundled StandardScaler, sigmoid-calibrated scoring, model persistence  |
| `preprocessing/feature_extractor.py` | Added `SessionFeatureExtractor` (10-feature vector) while keeping Phase-3 rule-based functions                                   |
| `routes/analyze_session.py`          | Full rewrite: Pydantic-validated request/response, wired to SessionAnalyzer                                                      |
| `main.py`                            | Updated to v4.0.0, loads embedding + anomaly models at startup, enhanced `/health`                                               |
| `requirements.txt`                   | Added `sentence-transformers>=2.2.0`                                                                                             |

### New Files

| File                            | Purpose                                                                  |
| ------------------------------- | ------------------------------------------------------------------------ |
| `inference/session_analyzer.py` | Central orchestrator combining features → embeddings → anomaly → risk    |
| `inference/risk_engine.py`      | Weighted risk formula with categorical levels (low/medium/high/critical) |
| `training/train_anomaly.py`     | Trains IsolationForest on realistic synthetic normal sessions            |
| `test_phase4_integration.py`    | Comprehensive integration test suite                                     |

---

## 10 Behavioral Features

| #   | Feature                    | Purpose                        |
| --- | -------------------------- | ------------------------------ |
| 0   | `total_prompts`            | Session volume                 |
| 1   | `avg_injection_score`      | Mean maliciousness             |
| 2   | `max_injection_score`      | Peak severity                  |
| 3   | `prompt_frequency`         | Rate (prompts/min)             |
| 4   | `blocked_ratio`            | Fraction blocked               |
| 5   | `tool_violation_count`     | Tool abuse count               |
| 6   | `similarity_mean`          | Semantic repetition            |
| 7   | `time_gap_variance`        | Timing irregularity            |
| 8   | `severity_slope`           | Escalation trend (max - first) |
| 9   | `session_duration_minutes` | Low & slow detection           |

**Min Prompt Guard**: Features 6, 7 zeroed out when `total_prompts < 3`.

---

## Risk Engine Formula

```
final_risk = 0.5 × max_injection_score
           + 0.3 × anomaly_score
           + 0.2 × tool_violation_score
```

| Score     | Level      |
| --------- | ---------- |
| 0.0 – 0.3 | `low`      |
| 0.3 – 0.6 | `medium`   |
| 0.6 – 0.8 | `high`     |
| 0.8 – 1.0 | `critical` |

Uses `max_injection_score` (peak severity) — security systems should react to worst-case.

---

## Behavior Flags

| Flag                           | Trigger                             |
| ------------------------------ | ----------------------------------- |
| `high_frequency`               | > 5 prompts/min                     |
| `semantic_probing`             | 2+ pairs above similarity threshold |
| `escalating_severity`          | severity_slope > 0.3                |
| `high_block_rate`              | > 50% prompts blocked               |
| `tool_abuse`                   | 2+ tool violations                  |
| `anomalous_behavior`           | anomaly_score > 0.7                 |
| `prolonged_suspicious_session` | Duration > 20min AND anomaly > 0.5  |

---

## Key Design Decisions

1. **StandardScaler bundled with model** — ensures feature normalization matches training distribution
2. **Sigmoid-calibrated anomaly scores** — raw IsolationForest scores mapped through sigmoid centered on configurable threshold
3. **Embedding cache** — avoids recomputation for identical prompts within a session
4. **Pairwise cap at 20 pairs** — sequential pairs prioritized to prevent O(n²) on large sessions
5. **Graceful fallback** — anomaly model returns 0.5 (uncertain) if not trained; embedding engine returns defaults if not loaded

---

## Integration Points for Future Phases

The `/analyze_session` endpoint returns a complete JSON that the **firewall** can consume:

```json
{
  "session_id": "...",
  "anomaly_score": 0.82,
  "probing_detected": true,
  "behavior_flags": ["semantic_probing", "escalating_severity"],
  "risk_score": 0.73,
  "risk_level": "high",
  "risk_components": {
    "injection": 0.93,
    "anomaly": 0.82,
    "tool_violation": 0.0
  }
}
```

The **dashboard** can visualize: `anomaly_score` trends, `risk_level` distribution, `behavior_flags` alerts, and `similarity_mean` over time.

No breaking changes to `/analyze_prompt` (Phase-3 backward compatible).
