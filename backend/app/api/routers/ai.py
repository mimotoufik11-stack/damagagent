"""
Dammaj Al-Quran - AI Operations API Router
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import uuid

from app.db.database import get_db
from app.models.ai_job import AIJob, JobType, JobStatus


router = APIRouter()


@router.post("/ai/transcribe")
async def start_transcription(
    project_id: int,
    media_path: str,
    language: str = "ar",
    enable_timestamps: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """Start audio transcription using Whisper"""
    job = AIJob(
        project_id=project_id,
        job_type=JobType.TRANSCRIPTION,
        status=JobStatus.PENDING,
        input_path=media_path,
        parameters={
            "language": language,
            "enable_timestamps": enable_timestamps
        }
    )
    
    db.add(job)
    await db.commit()
    await db.refresh(job)
    
    return {
        "message": "Transcription job started",
        "job_id": job.id,
        "job": job.to_dict()
    }


@router.post("/ai/dub")
async def start_dubbing(
    project_id: int,
    text: str,
    voice: str = "arabic",
    language: str = "ar",
    speed: float = 1.0,
    db: AsyncSession = Depends(get_db)
):
    """Start text-to-speech dubbing using Coqui TTS"""
    job = AIJob(
        project_id=project_id,
        job_type=JobType.DUBBING,
        status=JobStatus.PENDING,
        parameters={
            "text": text,
            "voice": voice,
            "language": language,
            "speed": speed
        }
    )
    
    db.add(job)
    await db.commit()
    await db.refresh(job)
    
    return {
        "message": "Dubbing job started",
        "job_id": job.id,
        "job": job.to_dict()
    }


@router.post("/ai/noise-reduction")
async def start_noise_reduction(
    project_id: int,
    audio_path: str,
    strength: float = 0.5,
    db: AsyncSession = Depends(get_db)
):
    """Start noise reduction on audio"""
    job = AIJob(
        project_id=project_id,
        job_type=JobType.NOISE_REDUCTION,
        status=JobStatus.PENDING,
        input_path=audio_path,
        parameters={
            "strength": strength
        }
    )
    
    db.add(job)
    await db.commit()
    await db.refresh(job)
    
    return {
        "message": "Noise reduction job started",
        "job_id": job.id,
        "job": job.to_dict()
    }


@router.post("/ai/subtitle-generation")
async def start_subtitle_generation(
    project_id: int,
    media_path: str,
    language: str = "ar",
    db: AsyncSession = Depends(get_db)
):
    """Start automatic subtitle generation"""
    job = AIJob(
        project_id=project_id,
        job_type=JobType.SUBTITLE_GENERATION,
        status=JobStatus.PENDING,
        input_path=media_path,
        parameters={
            "language": language
        }
    )
    
    db.add(job)
    await db.commit()
    await db.refresh(job)
    
    return {
        "message": "Subtitle generation job started",
        "job_id": job.id,
        "job": job.to_dict()
    }


@router.post("/ai/verse-recognition")
async def start_verse_recognition(
    project_id: int,
    audio_path: str,
    db: AsyncSession = Depends(get_db)
):
    """Start Quranic verse recognition"""
    job = AIJob(
        project_id=project_id,
        job_type=JobType.VERSE_RECOGNITION,
        status=JobStatus.PENDING,
        input_path=audio_path,
    )
    
    db.add(job)
    await db.commit()
    await db.refresh(job)
    
    return {
        "message": "Verse recognition job started",
        "job_id": job.id,
        "job": job.to_dict()
    }


@router.get("/ai/jobs/{job_id}")
async def get_job_status(
    job_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get AI job status and result"""
    query = select(AIJob).where(AIJob.id == job_id)
    result = await db.execute(query)
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return job.to_dict()


@router.get("/ai/projects/{project_id}/jobs")
async def list_project_jobs(
    project_id: int,
    job_type: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """List all AI jobs for a project"""
    query = select(AIJob).where(AIJob.project_id == project_id)
    
    if job_type:
        try:
            type_enum = JobType(job_type)
            query = query.where(AIJob.job_type == type_enum)
        except ValueError:
            pass
    
    if status:
        try:
            status_enum = JobStatus(status)
            query = query.where(AIJob.status == status_enum)
        except ValueError:
            pass
    
    query = query.order_by(AIJob.created_at.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    jobs = result.scalars().all()
    
    return {
        "jobs": [j.to_dict() for j in jobs],
        "total": len(jobs)
    }


@router.post("/ai/jobs/{job_id}/cancel")
async def cancel_job(
    job_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Cancel a running job"""
    query = select(AIJob).where(AIJob.id == job_id)
    result = await db.execute(query)
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status in [JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED]:
        raise HTTPException(status_code=400, detail="Job cannot be cancelled")
    
    job.status = JobStatus.CANCELLED
    job.completed_at = datetime.utcnow()
    job.message = "Job cancelled by user"
    
    await db.commit()
    await db.refresh(job)
    
    return job.to_dict()


@router.delete("/ai/jobs/{job_id}")
async def delete_job(
    job_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a completed job"""
    query = select(AIJob).where(AIJob.id == job_id)
    result = await db.execute(query)
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    await db.delete(job)
    await db.commit()
    
    return {"message": "Job deleted successfully"}
