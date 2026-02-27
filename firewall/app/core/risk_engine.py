from typing import Dict, Any, List

class RiskEngine:
    def calculate_risk(self, injection_score: float, tool_score: float) -> float:
        # Formula: 0.6 * injection_score + 0.4 * tool_score
        return round(0.6 * injection_score + 0.4 * tool_score, 2)
    def evaluate(self, final_risk: float, tool_authorized: bool) -> Dict[str, Any]:

        reasons = []
        blocked = False

        # Strict Policy Enforcement => Block if tool is not authorized, regardless of risk score
        if not tool_authorized:
            return {
                "final_risk": final_risk,
                "blocked": True,
                "risk_level": "blocked",
                "reasons": ["Tool policy violation"]
            }

        # Risk Level Classification (Based on final risk score)
        if final_risk < 0.1:
            risk_level = "safe"

        elif final_risk < 0.3:
            risk_level = "suspicious"
            reasons.append("Low-level anomaly detected")

        elif final_risk < 0.6:
            risk_level = "high"
            reasons.append("Elevated risk behavior")

        else:
            risk_level = "critical"
            blocked = True
            reasons.append("Critical risk detected")

        return {
            "final_risk": final_risk,
            "blocked": blocked,
            "risk_level": risk_level,
            "reasons": reasons
        }