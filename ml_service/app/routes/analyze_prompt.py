"""
Phase-3 – /analyze_prompt route
Accepts a prompt and returns injection analysis via DistilBERT + hybrid scoring.
"""

import time
from typing import List, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.inference.injection_model import analyze_injection

router = APIRouter()


# ─── Request / Response models ──────────────────────────────────────
class PromptRequest(BaseModel):
    prompt: str
    session_id: str = "default_session"


class PromptResponse(BaseModel):
    label: str
    confidence: float
    injection_score: float
    explanation: str
    keywords_triggered: List[str] = []
    model_version: Optional[str] = None
    inference_time_ms: Optional[float] = None


# ─── Route ──────────────────────────────────────────────────────────
@router.post("/analyze_prompt", response_model=PromptResponse)
async def analyze_prompt(request: PromptRequest):
    result = analyze_injection(request.prompt, request.session_id)
    result = analyze_injection(request.prompt, request.session_id)
    return result
