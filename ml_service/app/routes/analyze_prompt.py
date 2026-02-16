from fastapi import APIRouter
from pydantic import BaseModel
from app.inference.injection_model import analyze_injection

router = APIRouter()

class PromptRequest(BaseModel):
    prompt: str
    session_id: str = "default_session"

class PromptResponse(BaseModel):
    label: str
    confidence: float
    injection_score: float
    explanation: str

@router.post("/analyze_prompt", response_model=PromptResponse)
async def analyze_prompt(request: PromptRequest):
    result = analyze_injection(request.prompt)
    return result
