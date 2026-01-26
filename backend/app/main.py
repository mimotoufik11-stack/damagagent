"""
Dammaj Al-Quran - Main Application Entry Point
Professional Quran Video Editing Studio with AI-Powered Features
"""

import asyncio
import sys
import os
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logger import logger
from app.db.database import engine, Base
from app.api.routers import (
    projects, media, timeline, subtitles, 
    ai, audio, fonts, export
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("🚀 Starting Dammaj Al-Quran Backend...")
    
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    logger.info("✅ Database initialized successfully")
    logger.info(f"📁 Projects directory: {settings.PROJECTS_DIR}")
    logger.info(f"🎥 Media directory: {settings.MEDIA_DIR}")
    logger.info(f"💾 Models directory: {settings.MODELS_DIR}")
    
    yield
    
    # Shutdown
    logger.info("👋 Shutting down Dammaj Al-Quran Backend...")


# Create FastAPI application
app = FastAPI(
    title="Dammaj Al-Quran API",
    description="Professional Quran Video Editing Studio API with AI-powered transcription, dubbing, and subtitle generation",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directories
app.mount("/static/fonts", StaticFiles(directory=str(settings.FONTS_DIR)), name="fonts")
app.mount("/static/thumbnails", StaticFiles(directory=str(settings.THUMBNAILS_DIR)), name="thumbnails")

# Include API routers
app.include_router(projects.router, prefix="/api/v1", tags=["Projects"])
app.include_router(media.router, prefix="/api/v1", tags=["Media"])
app.include_router(timeline.router, prefix="/api/v1", tags=["Timeline"])
app.include_router(subtitles.router, prefix="/api/v1", tags=["Subtitles"])
app.include_router(ai.router, prefix="/api/v1", tags=["AI"])
app.include_router(audio.router, prefix="/api/v1", tags=["Audio"])
app.include_router(fonts.router, prefix="/api/v1", tags=["Fonts"])
app.include_router(export.router, prefix="/api/v1", tags=["Export"])


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "dammaj-al-quran-backend"
    }


@app.get("/api/")
async def root():
    """Root endpoint"""
    return {
        "name": "Dammaj Al-Quran API",
        "version": "1.0.0",
        "description": "Professional Quran Video Editing Studio",
        "docs": "/api/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL
    )
