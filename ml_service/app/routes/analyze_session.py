from fastapi import APIRouter
from pydantic import BaseModel
# from app.inference.anomaly_model import analyze_session_anomaly # (To be implemented)

router = APIRouter()

class SessionRequest(BaseModel):
    session_id: str

class SessionResponse(BaseModel):
    anomaly_score: float
    reason: str

@router.post("/analyze_session", response_model=SessionResponse)
async def analyze_session(request: SessionRequest):
    # Dummy implementation for Phase-2
    return {
        "anomaly_score": 0.1,
        "reason": "Placeholder anomaly model"
    }
