"""
Phase-4 – Risk Engine
Computes the final weighted risk score combining injection, anomaly, and tool violation signals.
Uses max_injection_score (peak severity) as the session injection metric.
"""

import logging

from app.inference.threshold_config import (
    RISK_WEIGHT_INJECTION,
    RISK_WEIGHT_ANOMALY,
    RISK_WEIGHT_TOOL,
    RISK_LEVEL_LOW,
    RISK_LEVEL_MEDIUM,
    RISK_LEVEL_HIGH,
)

logger = logging.getLogger("ml_service.risk_engine")


def compute_risk_score(
    max_injection_score: float,
    anomaly_score: float,
    tool_violation_score: float = 0.0,
) -> dict:
    """
    Compute the final weighted risk score for a session.

    Formula:
        final_risk = 0.5 × max_injection_score
                   + 0.3 × anomaly_score
                   + 0.2 × tool_violation_score

    Args:
        max_injection_score: Peak injection probability in the session (0-1)
        anomaly_score: Behavioral anomaly score from Isolation Forest (0-1)
        tool_violation_score: Normalized tool violation metric (0-1)

    Returns:
        {
            "risk_score": float (0-1),
            "risk_level": str ("low" | "medium" | "high" | "critical"),
            "components": {
                "injection": float,
                "anomaly": float,
                "tool_violation": float,
            }
        }
    """
    # Clamp inputs to [0, 1]
    inj = max(0.0, min(1.0, float(max_injection_score)))
    anom = max(0.0, min(1.0, float(anomaly_score)))
    tool = max(0.0, min(1.0, float(tool_violation_score)))

    # Weighted combination
    risk_score = (
        RISK_WEIGHT_INJECTION * inj
        + RISK_WEIGHT_ANOMALY * anom
        + RISK_WEIGHT_TOOL * tool
    )
    risk_score = round(min(max(risk_score, 0.0), 1.0), 4)

    # Categorical risk level
    if risk_score >= RISK_LEVEL_HIGH:
        risk_level = "critical"
    elif risk_score >= RISK_LEVEL_MEDIUM:
        risk_level = "high"
    elif risk_score >= RISK_LEVEL_LOW:
        risk_level = "medium"
    else:
        risk_level = "low"

    logger.info(
        f"Risk computed: score={risk_score} level={risk_level} "
        f"[inj={inj:.4f}×{RISK_WEIGHT_INJECTION} + "
        f"anom={anom:.4f}×{RISK_WEIGHT_ANOMALY} + "
        f"tool={tool:.4f}×{RISK_WEIGHT_TOOL}]"
    )

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "components": {
            "injection": round(inj, 4),
            "anomaly": round(anom, 4),
            "tool_violation": round(tool, 4),
        },
    }
