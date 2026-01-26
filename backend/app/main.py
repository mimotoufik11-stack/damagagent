from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import uvicorn
import logging
from pathlib import Path

from app.config import settings
from app.database.db import init_db
from app.api import projects, media, timeline, subtitles, ai, audio, fonts, export
from app.middleware.cors import setup_cors
from app.middleware.error_handler import setup_error_handlers
from app.utils.logger import setup_logging

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown
    pass

# Create FastAPI application
app = FastAPI(
    title="دماج للقرآن الكريم API",
    description="Professional Quran Video Studio Backend API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Setup logging
setup_logging()

# Setup middleware
setup_cors(app)
setup_error_handlers(app)

# Include API routers
app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(media.router, prefix="/api/v1/media", tags=["media"])
app.include_router(timeline.router, prefix="/api/v1/timeline", tags=["timeline"])
app.include_router(subtitles.router, prefix="/api/v1/subtitles", tags=["subtitles"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(audio.router, prefix="/api/v1/audio", tags=["audio"])
app.include_router(fonts.router, prefix="/api/v1/fonts", tags=["fonts"])
app.include_router(export.router, prefix="/api/v1/export", tags=["export"])

@app.get("/")
async def root():
    return {
        "message": "دماج للقرآن الكريم API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "dammaj-quran-api",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )