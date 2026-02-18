"""
AegisAI ML Service – Phase-3 Entry Point
Loads DistilBERT injection model at startup and serves inference routes.
"""

import torch
from fastapi import FastAPI

from app.routes import analyze_prompt, analyze_session
from app.inference.injection_model import load_injection_model
from app.inference.threshold_config import MODEL_VERSION, USE_HYBRID

app = FastAPI(title="AegisAI ML Service", version="3.0.0")

# Include routers
app.include_router(analyze_prompt.router)
app.include_router(analyze_session.router)


# ─── Startup ────────────────────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    device_name = (
        torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU"
    )
    print(f"[STARTUP] Model version : {MODEL_VERSION}")
    print(f"[STARTUP] Device        : {device_name}")
    print(f"[STARTUP] Hybrid mode   : {USE_HYBRID}")
    # Trigger model loading (warmup happens inside InjectionModel.__init__)
    load_injection_model()


# ─── Health ─────────────────────────────────────────────────────────
@app.get("/health")
async def health_check():
    device = "cuda" if torch.cuda.is_available() else "cpu"
    return {
        "status": "ok",
        "service": "ml_service",
        "model_version": MODEL_VERSION,
        "device": device,
        "hybrid_mode": USE_HYBRID,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)
