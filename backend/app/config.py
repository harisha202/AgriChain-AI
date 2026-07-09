import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./agrichain.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    WEATHER_API_KEY: Optional[str] = os.getenv("WEATHER_API_KEY")
    ANTHROPIC_API_KEY: Optional[str] = os.getenv("ANTHROPIC_API_KEY")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

if not settings.JWT_SECRET:
    raise ValueError("FATAL ERROR: JWT_SECRET environment variable is not set. Refusing to start with an insecure token signature.")
