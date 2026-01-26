"""
Dammaj Al-Quran - Configuration Management
"""

import os
from pathlib import Path
from functools import lru_cache
from typing import List, Optional
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "دماج للقرآن الكريم"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    CORS_ORIGINS: List[str] = Field(default_factory=lambda: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ])
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/dammaj.db"
    DATABASE_ECHO: bool = False
    
    # Directories
    BASE_DIR: Path = Path(__file__).parent.parent.parent
    DATA_DIR: Path = BASE_DIR / "data"
    PROJECTS_DIR: Path = DATA_DIR / "projects"
    MEDIA_DIR: Path = DATA_DIR / "media"
    THUMBNAILS_DIR: Path = DATA_DIR / "thumbnails"
    FONTS_DIR: Path = DATA_DIR / "fonts"
    MODELS_DIR: Path = DATA_DIR / "models"
    TEMP_DIR: Path = DATA_DIR / "temp"
    EXPORT_DIR: Path = DATA_DIR / "exports"
    
    # FFmpeg
    FFMPEG_PATH: Optional[str] = None
    FFMPEG_THREADS: int = 4
    
    # AI Models
    WHISPER_MODEL: str = "base"
    TTS_VOICE: str = "arabic"
    TTS_LANGUAGE: str = "ar"
    
    # Export Settings
    DEFAULT_RESOLUTION: str = "1920x1080"
    DEFAULT_FPS: int = 30
    DEFAULT_FORMAT: str = "mp4"
    
    # File Limits
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024 * 1024  # 5GB
    MAX_PROJECT_DURATION: float = 3600.0  # 1 hour in seconds
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


settings = get_settings()


def setup_directories():
    """Create required directories"""
    directories = [
        settings.DATA_DIR,
        settings.PROJECTS_DIR,
        settings.MEDIA_DIR,
        settings.THUMBNAILS_DIR,
        settings.FONTS_DIR,
        settings.MODELS_DIR,
        settings.TEMP_DIR,
        settings.EXPORT_DIR,
    ]
    
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)
    
    return True
