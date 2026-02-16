from fastapi import FastAPI
from app.routes import analyze_prompt, analyze_session

app = FastAPI(title="AegisAI ML Service", version="0.1.0")

# Include routers
app.include_router(analyze_prompt.router)
app.include_router(analyze_session.router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ml_service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)
