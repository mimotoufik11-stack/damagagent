from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "دماج للقرآن الكريم API"
    DEBUG: bool = False
    VERSION: str = "1.0.0"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/dammaj_quran"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # File Storage
    UPLOAD_DIR: Path = Path("uploads")
    EXPORT_DIR: Path = Path("exports")
    MODELS_DIR: Path = Path("models")
    
    # AI Services
    OPENAI_API_KEY: Optional[str] = None
    WHISPER_MODEL: str = "base"
    TTS_VOICE: str = "ar-XA-Wavenet-A"
    
    # FFmpeg
    FFMPEG_PATH: str = "ffmpeg"
    
    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Redis (for caching)
    REDIS_URL: str = "redis://localhost:6379"
    
    # Media Processing
    MAX_FILE_SIZE: int = 500 * 1024 * 1024  # 500MB
    ALLOWED_EXTENSIONS: list[str] = [
        # Video
        ".mp4", ".avi", ".mov", ".mkv", ".webm", ".flv",
        # Audio
        ".mp3", ".wav", ".flac", ".ogg", ".m4a",
        # Images
        ".png", ".jpg", ".jpeg", ".webp", ".svg", ".bmp",
        # Subtitle
        ".srt", ".vtt", ".ass"
    ]
    
    # Audio Processing
    AUDIO_SAMPLE_RATE: int = 44100
    AUDIO_BITRATE: int = 128
    
    # Video Processing
    DEFAULT_VIDEO_CODEC: str = "libx264"
    DEFAULT_AUDIO_CODEC: str = "aac"
    DEFAULT_RESOLUTION: tuple[int, int] = (1920, 1080)
    DEFAULT_FPS: int = 30
    
    # Arabic Text Processing
    RTL_SUPPORT: bool = True
    DEFAULT_ARABIC_FONT: str = "Amiri"
    DEFAULT_FONT_SIZE: int = 24
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: Path = Path("logs/app.log")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Ensure directories exist
settings.UPLOAD_DIR.mkdir(exist_ok=True)
settings.EXPORT_DIR.mkdir(exist_ok=True)
settings.MODELS_DIR.mkdir(exist_ok=True)
settings.LOG_FILE.parent.mkdir(exist_ok=True)