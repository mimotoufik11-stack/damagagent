"""
Dammaj Al-Quran - Audio Processing API Router
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.db.database import get_db
from app.services.audio_service import AudioService


router = APIRouter()


class AudioMixRequest(BaseModel):
    """Audio mixing request"""
    audio_paths: list
    output_path: str
    volumes: Optional[list] = None
    output_format: str = "mp3"


class AudioNormalizeRequest(BaseModel):
    """Audio normalization request"""
    audio_path: str
    target_level: float = -3.0


class VolumeAdjustRequest(BaseModel):
    """Volume adjustment request"""
    audio_path: str
    volume: float = 1.0


@router.post("/audio/mix")
async def mix_audio_tracks(
    request: AudioMixRequest,
    db: AsyncSession = Depends(get_db)
):
    """Mix multiple audio tracks into one"""
    try:
        service = AudioService()
        result = await service.mix_tracks(
            audio_paths=request.audio_paths,
            output_path=request.output_path,
            volumes=request.volumes or [1.0] * len(request.audio_paths),
            output_format=request.output_format
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/audio/normalize")
async def normalize_audio(
    request: AudioNormalizeRequest
):
    """Normalize audio levels"""
    try:
        service = AudioService()
        result = await service.normalize_audio(
            audio_path=request.audio_path,
            target_level=request.target_level
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/audio/volume")
async def adjust_volume(
    request: VolumeAdjustRequest
):
    """Adjust audio volume"""
    try:
        service = AudioService()
        result = await service.adjust_volume(
            audio_path=request.audio_path,
            volume=request.volume
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/audio/noise-reduction")
async def reduce_noise(
    audio_path: str,
    strength: float = 0.5
):
    """Reduce noise from audio"""
    try:
        service = AudioService()
        result = await service.reduce_noise(
            audio_path=audio_path,
            strength=strength
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/audio/info")
async def get_audio_info(audio_path: str):
    """Get audio file information"""
    try:
        service = AudioService()
        info = await service.get_audio_info(audio_path)
        return info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
