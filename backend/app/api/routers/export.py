"""
Dammaj Al-Quran - Export API Router
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import uuid

from app.db.database import get_db
from app.models.ai_job import ExportJob, ExportStatus


router = APIRouter()


class ExportRequest(BaseModel):
    """Export request"""
    project_id: int
    format: str = "mp4"
    resolution: str = "1920x1080"
    fps: int = 30
    quality: str = "high"
    bitrate: Optional[str] = None


@router.post("/export")
async def start_export(
    request: ExportRequest,
    db: AsyncSession = Depends(get_db)
):
    """Start video export"""
    job = ExportJob(
        project_id=request.project_id,
        status=ExportStatus.PENDING,
        parameters=request.model_dump()
    )
    
    db.add(job)
    await db.commit()
    await db.refresh(job)
    
    return {
        "message": "Export job started",
        "job_id": job.id,
        "job": job.to_dict()
    }


@router.get("/export/{job_id}")
async def get_export_status(
    job_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get export job status"""
    query = select(ExportJob).where(ExportJob.id == job_id)
    result = await db.execute(query)
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Export job not found")
    
    return job.to_dict()


@router.get("/export/{job_id}/download")
async def download_export(
    job_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get download URL for exported file"""
    query = select(ExportJob).where(ExportJob.id == job_id)
    result = await db.execute(query)
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Export job not found")
    
    if job.status != ExportStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Export not completed")
    
    return {
        "download_url": f"/static/exports/{job.output_filename}",
        "filename": job.output_filename,
        "file_size": job.file_size
    }


@router.post("/export/{job_id}/cancel")
async def cancel_export(
    job_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Cancel an export job"""
    query = select(ExportJob).where(ExportJob.id == job_id)
    result = await db.execute(query)
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Export job not found")
    
    if job.status in [ExportStatus.COMPLETED, ExportStatus.FAILED, ExportStatus.CANCELLED]:
        raise HTTPException(status_code=400, detail="Export cannot be cancelled")
    
    job.status = ExportStatus.CANCELLED
    job.completed_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(job)
    
    return job.to_dict()


@router.get("/export/presets")
async def get_export_presets():
    """Get available export presets"""
    return {
        "presets": [
            {
                "id": "youtube_1080p",
                "name": "YouTube 1080p",
                "resolution": "1920x1080",
                "fps": 30,
                "quality": "high",
                "bitrate": "8M"
            },
            {
                "id": "youtube_4k",
                "name": "YouTube 4K",
                "resolution": "3840x2160",
                "fps": 30,
                "quality": "ultra",
                "bitrate": "35M"
            },
            {
                "id": "web_720p",
                "name": "Web 720p",
                "resolution": "1280x720",
                "fps": 30,
                "quality": "medium",
                "bitrate": "5M"
            },
            {
                "id": "mobile",
                "name": "Mobile",
                "resolution": "720x1280",
                "fps": 30,
                "quality": "medium",
                "bitrate": "3M"
            },
            {
                "id": "audio_only",
                "name": "Audio Only (MP3)",
                "resolution": None,
                "fps": None,
                "format": "mp3",
                "bitrate": "320k"
            }
        ]
    }


@router.get("/export/formats")
async def get_export_formats():
    """Get supported export formats"""
    return {
        "formats": [
            {"id": "mp4", "name": "MP4 (H.264)", "description": "Most compatible video format"},
            {"id": "webm", "name": "WebM (VP9)", "description": "Web-optimized video format"},
            {"id": "mov", "name": "MOV", "description": "QuickTime format"},
            {"id": "mp3", "name": "MP3", "description": "Audio only"},
        ],
        "resolutions": [
            {"id": "720x480", "name": "480p (SD)"},
            {"id": "1280x720", "name": "720p (HD)"},
            {"id": "1920x1080", "name": "1080p (Full HD)"},
            {"id": "3840x2160", "name": "4K (Ultra HD)"},
        ],
        "qualities": [
            {"id": "low", "name": "Low", "description": "Smaller file size"},
            {"id": "medium", "name": "Medium", "description": "Balanced quality and size"},
            {"id": "high", "name": "High", "description": "High quality"},
            {"id": "ultra", "name": "Ultra", "description": "Maximum quality"},
        ]
    }
