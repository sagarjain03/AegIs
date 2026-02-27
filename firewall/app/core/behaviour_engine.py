from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.db.database import LogEntry
import time


class BehaviourEngine:

    def __init__(self):

        # UEBA Weights
        self.risk_weight = 0.25
        self.frequency_weight = 0.05
        self.token_weight = 0.05

        # Thresholds
        self.frequency_threshold = 5
        self.token_spike_threshold = 50

    async def analyze_session(
        self,
        session_id: str,
        prompt: str,
        injection_score: float,
        db: AsyncSession
    ):

        # --------------------------
        # Token Estimation
        # --------------------------

        token_count = len(prompt.split())

        # --------------------------
        # Request Count
        # --------------------------

        stmt = select(func.count(LogEntry.id)).where(
            LogEntry.session_id == session_id
        )

        result = await db.execute(stmt)

        request_index = result.scalar() + 1


        # --------------------------
        # Previous Session Risk
        # --------------------------

        stmt = select(LogEntry).where(
            LogEntry.session_id == session_id
        ).order_by(LogEntry.id.desc()).limit(1)

        result = await db.execute(stmt)

        last_log = result.scalar_one_or_none()

        previous_risk = last_log.session_risk if last_log else 0.0


        # --------------------------
        # Risk Escalation
        # --------------------------

        session_risk = previous_risk + (injection_score * self.risk_weight)


        # --------------------------
        # Frequency Detection
        # --------------------------

        if request_index > self.frequency_threshold:

            session_risk += self.frequency_weight


        # --------------------------
        # Token Spike Detection
        # --------------------------

        if token_count > self.token_spike_threshold:

            session_risk += self.token_weight


        # --------------------------
        # Risk Level
        # --------------------------

        if session_risk > 0.8:
            risk_level = "critical"

        elif session_risk > 0.5:
            risk_level = "high"

        elif session_risk > 0.2:
            risk_level = "medium"

        else:
            risk_level = "safe"


        return {

            "request_index": request_index,
            "token_count": token_count,
            "session_risk": round(session_risk, 3),
            "risk_level": risk_level

        }