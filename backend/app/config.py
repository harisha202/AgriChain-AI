import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./agrichain.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "supersecretkey")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    WEATHER_API_KEY: str = "your-weather-api-key"
    ANTHROPIC_API_KEY: str = "your-anthropic-api-key"
    GEMINI_API_KEY: str = "your-gemini-api-key"
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
