"""
Dammaj Al-Quran - Timeline API Router
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update
from datetime import datetime

from app.db.database import get_db
from app.models.clip import Clip, TrackType


router = APIRouter()


@router.get("/projects/{project_id}/timeline")
async def get_timeline(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get timeline data for a project"""
    query = select(Clip).where(Clip.project_id == project_id).order_by(
        Clip.track_index, Clip.start_time
    )
    result = await db.execute(query)
    clips = result.scalars().all()
    
    # Group clips by track
    tracks = {}
    for clip in clips:
        track_id = clip.track_id
        if track_id not in tracks:
            tracks[track_id] = {
                "id": track_id,
                "type": clip.track_type.value,
                "index": clip.track_index,
                "clips": []
            }
        tracks[track_id]["clips"].append(clip.to_dict())
    
    return {
        "tracks": list(tracks.values()),
        "total_clips": len(clips)
    }


@router.post("/projects/{project_id}/clips")
async def create_clip(
    project_id: int,
    clip_data: dict,
    db: AsyncSession = Depends(get_db)
):
    """Create a new clip on the timeline"""
    clip = Clip(
        project_id=project_id,
        media_id=clip_data.get("media_id"),
        track_id=clip_data.get("track_id", "video_1"),
        track_type=TrackType(clip_data.get("track_type", "video")),
        track_index=clip_data.get("track_index", 0),
        start_time=clip_data.get("start_time", 0.0),
        duration=clip_data.get("duration", 0.0),
        source_start=clip_data.get("source_start", 0.0),
        source_end=clip_data.get("source_end", 0.0),
        name=clip_data.get("name", "Untitled Clip"),
        volume=clip_data.get("volume", 1.0),
        opacity=clip_data.get("opacity", 1.0),
        speed=clip_data.get("speed", 1.0),
        effects=clip_data.get("effects", []),
        order_index=clip_data.get("order_index", 0),
    )
    
    db.add(clip)
    await db.commit()
    await db.refresh(clip)
    
    return clip.to_dict()


@router.put("/projects/{project_id}/clips/{clip_id}")
async def update_clip(
    project_id: int,
    clip_id: int,
    clip_data: dict,
    db: AsyncSession = Depends(get_db)
):
    """Update a clip"""
    query = select(Clip).where(
        Clip.id == clip_id,
        Clip.project_id == project_id
    )
    result = await db.execute(query)
    clip = result.scalar_one_or_none()
    
    if not clip:
        raise HTTPException(status_code=404, detail="Clip not found")
    
    # Update fields
    if "start_time" in clip_data:
        clip.start_time = clip_data["start_time"]
    if "duration" in clip_data:
        clip.duration = clip_data["duration"]
    if "source_start" in clip_data:
        clip.source_start = clip_data["source_start"]
    if "source_end" in clip_data:
        clip.source_end = clip_data["source_end"]
    if "volume" in clip_data:
        clip.volume = clip_data["volume"]
    if "opacity" in clip_data:
        clip.opacity = clip_data["opacity"]
    if "speed" in clip_data:
        clip.speed = clip_data["speed"]
    if "effects" in clip_data:
        clip.effects = clip_data["effects"]
    if "order_index" in clip_data:
        clip.order_index = clip_data["order_index"]
    if "is_locked" in clip_data:
        clip.is_locked = clip_data["is_locked"]
    if "is_hidden" in clip_data:
        clip.is_hidden = clip_data["is_hidden"]
    if "is_muted" in clip_data:
        clip.is_muted = clip_data["is_muted"]
    
    clip.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(clip)
    
    return clip.to_dict()


@router.delete("/projects/{project_id}/clips/{clip_id}")
async def delete_clip(
    project_id: int,
    clip_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a clip"""
    query = delete(Clip).where(
        Clip.id == clip_id,
        Clip.project_id == project_id
    )
    
    result = await db.execute(query)
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Clip not found")
    
    await db.commit()
    
    return {"message": "Clip deleted successfully"}


@router.post("/projects/{project_id}/clips/bulk")
async def bulk_update_clips(
    project_id: int,
    clips_data: list,
    db: AsyncSession = Depends(get_db)
):
    """Bulk update clips (for drag-drop operations)"""
    updated_clips = []
    
    for clip_data in clips_data:
        clip_id = clip_data.pop("id", None)
        if not clip_id:
            continue
            
        query = select(Clip).where(
            Clip.id == clip_id,
            Clip.project_id == project_id
        )
        result = await db.execute(query)
        clip = result.scalar_one_or_none()
        
        if clip:
            for key, value in clip_data.items():
                if hasattr(clip, key):
                    setattr(clip, key, value)
            clip.updated_at = datetime.utcnow()
            updated_clips.append(clip.to_dict())
    
    await db.commit()
    
    return {"clips": updated_clips}


@router.post("/projects/{project_id}/timeline/clear")
async def clear_timeline(
    project_id: int,
    keep_tracks: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """Clear timeline clips"""
    if keep_tracks:
        query = delete(Clip).where(
            Clip.project_id == project_id,
            Clip.track_type != TrackType.SUBTITLE
        )
    else:
        query = delete(Clip).where(Clip.project_id == project_id)
    
    await db.execute(query)
    await db.commit()
    
    return {"message": "Timeline cleared successfully"}
