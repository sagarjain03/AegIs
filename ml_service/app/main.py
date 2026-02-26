"""
AegisAI ML Service – Phase-4 Entry Point
Loads injection model (DistilBERT), embedding engine (sentence-transformers),
and anomaly model (Isolation Forest) at startup.
"""

import torch
import logging
from fastapi import FastAPI

from app.routes import analyze_prompt, analyze_session
from app.inference.injection_model import load_injection_model
from app.inference.embedding_engine import load_embedding_engine, get_embedding_engine
from app.inference.anomaly_model import load_anomaly_model, get_anomaly_detector
from app.inference.threshold_config import MODEL_VERSION, USE_HYBRID, UEBA_ENABLED

logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")
logger = logging.getLogger("ml_service")

app = FastAPI(title="AegisAI ML Service", version="4.0.0")

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
    print(f"[STARTUP] UEBA enabled  : {UEBA_ENABLED}")

    # Phase-3: Load injection model
    load_injection_model()

    # Phase-4: Load UEBA components
    if UEBA_ENABLED:
        embedding_ok = load_embedding_engine()
        anomaly_ok = load_anomaly_model()
        print(f"[STARTUP] Embedding engine : {'✅ loaded' if embedding_ok else '⚠️  not loaded'}")
        print(f"[STARTUP] Anomaly model    : {'✅ loaded' if anomaly_ok else '⚠️  not trained — run: python -m app.training.train_anomaly'}")


# ─── Health ─────────────────────────────────────────────────────────
@app.get("/health")
async def health_check():
    device = "cuda" if torch.cuda.is_available() else "cpu"

    # Phase-4 model status
    embedding_engine = get_embedding_engine()
    anomaly_detector = get_anomaly_detector()

    return {
        "status": "ok",
        "service": "ml_service",
        "phase": "4.0.0",
        "model_version": MODEL_VERSION,
        "device": device,
        "hybrid_mode": USE_HYBRID,
        "ueba_enabled": UEBA_ENABLED,
        "injection_model_loaded": True,  # would have crashed on startup if not
        "embedding_model_loaded": embedding_engine.is_loaded,
        "anomaly_model_loaded": anomaly_detector.is_loaded,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)
