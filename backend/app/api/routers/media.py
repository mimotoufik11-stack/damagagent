"""
Dammaj Al-Quran - Media API Router
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update
from datetime import datetime
import os
import aiofiles

from app.db.database import get_db
from app.models.media import Media, MediaType
from app.core.config import settings


router = APIRouter()


def allowed_file(filename: str) -> bool:
    """Check if file extension is allowed"""
    allowed_extensions = {'.mp4', '.mov', '.webm', '.avi', '.mkv', '.wav', '.mp3', '.m4a', '.ogg', '.jpg', '.jpeg', '.png', '.gif'}
    return os.path.splitext(filename)[1].lower() in allowed_extensions


@router.post("/projects/{project_id}/media/upload")
async def upload_media(
    project_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Upload and import media file"""
    # Check file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=400, 
            detail="File type not supported. Allowed: MP4, MOV, WebM, AVI, WAV, MP3, M4A, OGG, JPG, PNG, GIF"
        )
    
    # Create project directory
    project_media_dir = settings.MEDIA_DIR / str(project_id)
    project_media_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = project_media_dir / filename
    
    # Save file
    content = await file.read()
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(content)
    
    # Determine media type
    ext = os.path.splitext(file.filename)[1].lower()
    if ext in ['.mp4', '.mov', '.webm', '.avi', '.mkv']:
        media_type = MediaType.VIDEO
    elif ext in ['.wav', '.mp3', '.m4a', '.ogg']:
        media_type = MediaType.AUDIO
    else:
        media_type = MediaType.IMAGE
    
    # Create media record
    media = Media(
        project_id=project_id,
        name=file.filename,
        original_filename=file.filename,
        file_path=str(file_path),
        file_size=len(content),
        media_type=media_type,
        mime_type=file.content_type,
    )
    
    db.add(media)
    await db.commit()
    await db.refresh(media)
    
    return {
        "message": "Media uploaded successfully",
        "media": media.to_dict()
    }


@router.get("/projects/{project_id}/media")
async def list_media(
    project_id: int,
    media_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """List all media for a project"""
    query = select(Media).where(Media.project_id == project_id)
    
    if media_type:
        try:
            type_enum = MediaType(media_type)
            query = query.where(Media.media_type == type_enum)
        except ValueError:
            pass
    
    query = query.order_by(Media.created_at.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    media_items = result.scalars().all()
    
    # Get total count
    count_query = select(Media).where(Media.project_id == project_id)
    count_result = await db.execute(count_query)
    total = len(count_result.scalars().all())
    
    return {
        "media": [m.to_dict() for m in media_items],
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/projects/{project_id}/media/{media_id}")
async def get_media(
    project_id: int,
    media_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get media details"""
    query = select(Media).where(
        Media.id == media_id,
        Media.project_id == project_id
    )
    result = await db.execute(query)
    media = result.scalar_one_or_none()
    
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    return media.to_dict()


@router.delete("/projects/{project_id}/media/{media_id}")
async def delete_media(
    project_id: int,
    media_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete media file"""
    # Get media
    query = select(Media).where(
        Media.id == media_id,
        Media.project_id == project_id
    )
    result = await db.execute(query)
    media = result.scalar_one_or_none()
    
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    # Delete file
    file_path = media.file_path
    if os.path.exists(file_path):
        os.remove(file_path)
    
    # Delete thumbnail if exists
    if media.thumbnail_path and os.path.exists(media.thumbnail_path):
        os.remove(media.thumbnail_path)
    
    # Delete from database
    await db.delete(media)
    await db.commit()
    
    return {"message": "Media deleted successfully"}


@router.put("/projects/{project_id}/media/{media_id}")
async def update_media(
    project_id: int,
    media_id: int,
    name: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Update media metadata"""
    query = select(Media).where(
        Media.id == media_id,
        Media.project_id == project_id
    )
    result = await db.execute(query)
    media = result.scalar_one_or_none()
    
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    if name:
        media.name = name
    
    media.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(media)
    
    return media.to_dict()
