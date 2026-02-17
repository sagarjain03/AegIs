from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.core.rule_based_detector import RuleBasedDetector
from app.core.policy_engine import PolicyEngine
from app.core.risk_engine import RiskEngine
from app.core.logger import get_logger
from app.db.database import get_db, LogEntry
from app.services.ml_client import MLClient

router = APIRouter()
logger = get_logger()

# Dependencies
detector = RuleBasedDetector()
policy_engine = PolicyEngine()
risk_engine = RiskEngine()
ml_client = MLClient()

# Request Model
class ToolRequest(BaseModel):
    tool_name: str

class ChatRequest(BaseModel):
    user_id: str
    session_id: str
    role: str
    prompt: str
    tool_request: Optional[ToolRequest] = None

# Response Model
class ChatResponse(BaseModel):
    prompt_risk: float
    tool_score: float
    final_risk: float
    blocked: bool
    reasons: List[str]

@router.post("/chat", response_model=ChatResponse)
async def chat_handler(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    try:
        # 1. Validation (Pydantic handles basic validation)
        
        # 2. Rule-based Detection (Keep as fallback or complementary?)
        # For Phase-2 Integration, we use ML Service primarily, but can keep rule-based as local check
        # Let's combine them or just use ML. Specification says "Connect Firewall <-> ML".
        # We will use ML score.
        
        # Call ML Service
        ml_result = await ml_client.analyze(request.prompt, request.session_id)
        injection_score = ml_result.get("injection_score", 0.0)
        ml_label = ml_result.get("label", "unknown")
        keywords = ml_result.get("keywords", [])
        
        # 3. Policy Check
        tool_name = request.tool_request.tool_name if request.tool_request else None
        policy_result = policy_engine.check_policy(tool_name, request.role)
        tool_score = policy_result["tool_score"]
        authorized = policy_result["authorized"]
        policy_reason = policy_result["reason"]
        
        # 4. Risk Calculation
        final_risk = risk_engine.calculate_risk(injection_score, tool_score)
        
        # 5. Apply Thresholds
        evaluation = risk_engine.evaluate(final_risk, authorized)
        blocked = evaluation["blocked"]
        reasons = evaluation["reasons"]
        
        if policy_reason and policy_reason not in reasons:
             reasons.insert(0, policy_reason)
             
        if keywords:
            reasons.append(f"ML Flagged: {', '.join(keywords)}")

        # 6. Log to DB
        log_entry = LogEntry(
            user_id=request.user_id,
            session_id=request.session_id,
            prompt=request.prompt,
            injection_score=injection_score,
            tool_score=tool_score,
            final_risk=final_risk,
            blocked=blocked,
            matched_categories=str(keywords) if keywords else "[]", # Storing keywords in matched_categories for now
            timestamp=datetime.utcnow()
        )
        db.add(log_entry)
        await db.commit()
        
        logger_props = {
            "session_id": request.session_id,
            "blocked": blocked,
            "risk": final_risk,
            "ml_label": ml_label
        }
        logger.info("Processed chat request", extra={"props": logger_props})

        # 7. Return Response
        return ChatResponse(
            prompt_risk=injection_score,
            tool_score=tool_score,
            final_risk=final_risk,
            blocked=blocked,
            reasons=reasons
        )

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
