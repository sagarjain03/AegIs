import aiohttp
import logging

logger = logging.getLogger("firewall")

class MLClient:
    def __init__(self, base_url: str = "http://localhost:9000"):
        self.base_url = base_url

    async def analyze(self, prompt: str, session_id: str = "default_session"):
        url = f"{self.base_url}/analyze_prompt"
        payload = {
            "prompt": prompt,
            "session_id": session_id
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload, timeout=2.0) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {
                            "injection_score": data.get("injection_score", 0.0),
                            "label": data.get("label", "unknown"),
                            "keywords": data.get("keywords_triggered", [])
                        }
                    else:
                        logger.error(f"ML Service returned status {response.status}")
                        return {"injection_score": 0.0, "error": f"Status {response.status}"}
                        
        except Exception as e:
            logger.error(f"Failed to connect to ML Service: {e}")
            # Fallback to safe if ML service is down (Fail Open or Fail Closed? 
            # Usually Fail Closed for security, but for MVP Fail Safe often used to not break app.
            # Let's return 0.0 but log error. Real firewall might want to block.)
            return {"injection_score": 0.0, "error": str(e)}
