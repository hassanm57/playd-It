from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    APP_NAME: str = "PLAYD"
    SECRET_KEY: str = "playd-secret-key-change-in-production-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    DATABASE_URL: str = "sqlite:///./playd.db"
    RAWG_API_KEY: str = "5f4b1ae93a754215b4a1a835363edbf6"
    RAWG_BASE_URL: str = "https://api.rawg.io/api"

    class Config:
        env_file = ".env"

settings = Settings()
