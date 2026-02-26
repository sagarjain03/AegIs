from typing import Dict, Any, List

class RiskEngine:
    def calculate_risk(self, injection_score: float, tool_score: float) -> float:
        # Formula: 0.6 * injection_score + 0.4 * tool_score
        return round(0.6 * injection_score + 0.4 * tool_score, 2)
    def evaluate(self, final_risk: float, tool_authorized: bool) -> Dict[str, Any]:
        reasons = []
        risk_level = "safe"
        blocked = False

        # 1️⃣ Strict Policy Enforcement
        if not tool_authorized:
            blocked = True
            risk_level = "blocked"
            reasons.append("Tool policy violation")
            return {
                "final_risk": final_risk,
                "blocked": blocked,
                "risk_level": risk_level,
                "reasons": reasons
            }

        # 2️⃣ Risk-Based Evaluation
        if final_risk >= 0.75:
            blocked = True
            risk_level = "blocked"
            reasons.append("High risk detected")

        elif final_risk >= 0.5:
            risk_level = "flagged"
            reasons.append("Medium risk flagged")

        else:
            risk_level = "safe"

        return {
            "final_risk": final_risk,
            "blocked": blocked,
            "risk_level": risk_level,
            "reasons": reasons
        }