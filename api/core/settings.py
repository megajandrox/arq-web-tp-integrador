from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///user_manager.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your_secret_key")
    DEBUG: bool = os.getenv("DEBUG", False)
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
    API_PORT: int = int(os.getenv("API_PORT", 5000))
