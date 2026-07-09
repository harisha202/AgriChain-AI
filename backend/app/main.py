from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

app = FastAPI(
    title="AgriChain AI API",
    description="Smart Farming and Agri Supply Chain Analytics Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,https://agrichain.vercel.app").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to AgriChain AI API"}

from app.routers import auth, crop, forecast, inventory, analytics, logistics, assistant
app.include_router(auth.router)
app.include_router(crop.router)
app.include_router(forecast.router)
app.include_router(inventory.router)
app.include_router(analytics.router)
app.include_router(logistics.router)
app.include_router(assistant.router)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
