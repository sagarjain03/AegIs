"""
Phase-4 – /analyze_session route
Accepts session prompt logs and returns full UEBA behavioral analysis.
"""

import logging
from typing import List, Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.inference.session_analyzer import get_session_analyzer

router = APIRouter()
logger = logging.getLogger("ml_service.route.session")


# ─── Request / Response models ──────────────────────────────────────
class PromptLog(BaseModel):
    """Single prompt log entry within a session."""
    prompt: str
    injection_score: float = Field(0.0, ge=0.0, le=1.0)
    blocked: bool = False
    timestamp: float = Field(..., description="Unix epoch seconds")
    tool_violations: int = Field(0, ge=0)


class SessionRequest(BaseModel):
    """Session analysis request payload."""
    session_id: str
    prompt_logs: List[PromptLog] = Field(
        ..., description="Ordered list of prompt logs for the session"
    )


class RiskComponents(BaseModel):
    injection: float
    anomaly: float
    tool_violation: float


class SessionResponse(BaseModel):
    """Full UEBA behavioral analysis response."""
    session_id: str
    anomaly_score: float
    probing_detected: bool
    behavior_flags: List[str]
    risk_score: float
    risk_level: str
    risk_components: RiskComponents
    similarity_mean: float
    high_similarity_count: int
    total_prompts: int
    feature_vector_length: int
    inference_time_ms: float


# ─── Route ──────────────────────────────────────────────────────────
@router.post("/analyze_session", response_model=SessionResponse)
async def analyze_session(request: SessionRequest):
    """
    Analyze session behavior using UEBA pipeline.

    Accepts a list of prompt logs (with injection scores, timestamps, etc.)
    and returns anomaly score, probing detection, behavior flags, and
    final weighted risk score.
    """
    analyzer = get_session_analyzer()

    # Convert Pydantic models to dicts for the analyzer
    prompt_logs = [log.model_dump() for log in request.prompt_logs]

    result = analyzer.analyze(
        session_id=request.session_id,
        prompt_logs=prompt_logs,
    )

    logger.info(
        f"[SESSION] {request.session_id}: "
        f"risk={result['risk_score']:.4f} ({result['risk_level']}), "
        f"anomaly={result['anomaly_score']:.4f}, "
        f"probing={'YES' if result['probing_detected'] else 'no'}, "
        f"flags={result['behavior_flags']}, "
        f"latency={result['inference_time_ms']:.1f}ms"
    )

    return result
