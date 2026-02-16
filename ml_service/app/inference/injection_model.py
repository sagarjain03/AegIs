def analyze_injection(prompt: str):
    """
    Dummy implementation of injection detection logic.
    Returns a dictionary with label, confidence, injection_score, and explanation.
    """
    prompt_lower = prompt.lower()
    
    # Simple rule-based logic for Phase-2
    injection_keywords = [
        "ignore previous instructions",
        "reveal system prompt",
        "system prompt",
        "act as developer",
        "bypass",
        "jailbreak"
    ]
    
    is_injection = any(keyword in prompt_lower for keyword in injection_keywords)
    
    if is_injection:
        return {
            "label": "injection",
            "confidence": 0.85,
            "injection_score": 0.85,
            "explanation": "Detected potential injection keyword or pattern."
        }
    else:
        return {
            "label": "safe",
            "confidence": 0.95,
            "injection_score": 0.05,
            "explanation": "No suspicious patterns detected."
        }
