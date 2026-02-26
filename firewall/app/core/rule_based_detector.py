from typing import List, Dict, Any
import re
class RuleBasedDetector:
    def __init__(self):
        self.patterns = {
            "ignore_instructions": {
                "weight": 0.7,
                "triggers": ["ignore previous instructions", "ignore all previous instructions"]
            },
            "reveal_system_prompt": {
                "weight": 0.8,
                "triggers": ["reveal system prompt", "show me your system prompt"]
            },
            "bypass_restrictions": {
                "weight": 0.7,
                "triggers": ["bypass restrictions", "ignore safety guidelines"]
            },
            "jailbreak": {
                "weight": 0.9,
                "triggers": ["jailbreak", "dan mode"]
            }
}

    def detect(self, prompt: str) -> Dict[str, Any]:
        prompt_lower = self.normalize_prompt(prompt)
        matched_categories = []
        max_weight = 0.1
        for category, data in self.patterns.items():
            for trigger in data["triggers"]:
                if re.search(rf"\b{re.escape(trigger)}\b", prompt_lower):
                    matched_categories.append(category)
                    max_weight = max(max_weight, data["weight"])
                    break

        count = len(matched_categories)

        if matched_categories:
            score = round(max_weight, 2)
        else:
            score = 0.1

        return {
            "injection_score": score,
            "matched_categories": matched_categories
        }
    def normalize_prompt(self, prompt: str) -> str:
        prompt = prompt.lower()
        prompt = re.sub(r'\s+', ' ', prompt)  # normalize whitespace
        prompt = prompt.strip()
        return prompt