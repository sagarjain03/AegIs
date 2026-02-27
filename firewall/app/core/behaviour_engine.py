from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.db.database import LogEntry


class BehaviourEngine:

    async def analyze_session(
        self,
        session_id: str,
        prompt: str,
        injection_score: float,
        db: AsyncSession
    ) -> Dict[str, Any]:

        # ------------------------
        # 1. Count previous requests
        # ------------------------

        stmt = select(func.count(LogEntry.id)).where(
            LogEntry.session_id == session_id
        )

        result = await db.execute(stmt)
        request_count = result.scalar() or 0

        request_index = request_count + 1


        # ------------------------
        # 2. Token estimation
        # ------------------------

        # Simple estimation:
        # 1 token ≈ 4 characters

        token_count = max(1, len(prompt) // 4)


        # ------------------------
        # 3. Calculate Session Risk
        # ------------------------

        # Fetch previous risks

        stmt = select(LogEntry.final_risk).where(
            LogEntry.session_id == session_id
        )

        result = await db.execute(stmt)

        previous_risks = result.scalars().all()


        if previous_risks:

            avg_previous_risk = sum(previous_risks) / len(previous_risks)

            session_risk = round(
                (avg_previous_risk * 0.7) +
                (injection_score * 0.3),
                2
            )

        else:
            session_risk = injection_score


        # ------------------------
        # 4. Risk Level Classification
        # ------------------------

        if session_risk >= 0.75:
            risk_level = "critical"

        elif session_risk >= 0.5:
            risk_level = "high"

        elif session_risk >= 0.25:
            risk_level = "medium"

        else:
            risk_level = "low"


        return {

            "request_index": request_index,
            "token_count": token_count,
            "session_risk": session_risk,
            "risk_level": risk_level

        }