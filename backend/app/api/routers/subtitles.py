"""
Dammaj Al-Quran - Subtitles API Router
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update
from datetime import datetime

from app.db.database import get_db
from app.models.subtitle import Subtitle


router = APIRouter()


@router.get("/projects/{project_id}/subtitles")
async def list_subtitles(
    project_id: int,
    skip: int = 0,
    limit: int = 1000,
    db: AsyncSession = Depends(get_db)
):
    """List all subtitles for a project"""
    query = select(Subtitle).where(
        Subtitle.project_id == project_id
    ).order_by(Subtitle.start_time).offset(skip).limit(limit)
    
    result = await db.execute(query)
    subtitles = result.scalars().all()
    
    # Get total count
    count_query = select(Subtitle).where(Subtitle.project_id == project_id)
    count_result = await db.execute(count_query)
    total = len(count_result.scalars().all())
    
    return {
        "subtitles": [s.to_dict() for s in subtitles],
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/projects/{project_id}/subtitles/{subtitle_id}")
async def get_subtitle(
    project_id: int,
    subtitle_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get subtitle details"""
    query = select(Subtitle).where(
        Subtitle.id == subtitle_id,
        Subtitle.project_id == project_id
    )
    result = await db.execute(query)
    subtitle = result.scalar_one_or_none()
    
    if not subtitle:
        raise HTTPException(status_code=404, detail="Subtitle not found")
    
    return subtitle.to_dict()


@router.post("/projects/{project_id}/subtitles")
async def create_subtitle(
    project_id: int,
    subtitle_data: dict,
    db: AsyncSession = Depends(get_db)
):
    """Create a new subtitle"""
    subtitle = Subtitle(
        project_id=project_id,
        start_time=subtitle_data.get("start_time", 0.0),
        end_time=subtitle_data.get("end_time", 0.0),
        start_frame=subtitle_data.get("start_frame"),
        end_frame=subtitle_data.get("end_frame"),
        text=subtitle_data.get("text", ""),
        text_arabic=subtitle_data.get("text_arabic"),
        font_name=subtitle_data.get("font_name", "Amiri"),
        font_size=subtitle_data.get("font_size", 48),
        font_color=subtitle_data.get("font_color", "#FFFFFF"),
        background_color=subtitle_data.get("background_color"),
        stroke_color=subtitle_data.get("stroke_color", "#000000"),
        stroke_width=subtitle_data.get("stroke_width", 2.0),
        shadow_color=subtitle_data.get("shadow_color", "#000000"),
        shadow_offset=subtitle_data.get("shadow_offset", 2.0),
        opacity=subtitle_data.get("opacity", 1.0),
        x_position=subtitle_data.get("x_position", 0.5),
        y_position=subtitle_data.get("y_position", 0.9),
        alignment=subtitle_data.get("alignment", "center"),
        surah_number=subtitle_data.get("surah_number"),
        verse_number=subtitle_data.get("verse_number"),
        verse_text=subtitle_data.get("verse_text"),
        order_index=subtitle_data.get("order_index", 0),
        is_visible=subtitle_data.get("is_visible", True),
    )
    
    db.add(subtitle)
    await db.commit()
    await db.refresh(subtitle)
    
    return subtitle.to_dict()


@router.put("/projects/{project_id}/subtitles/{subtitle_id}")
async def update_subtitle(
    project_id: int,
    subtitle_id: int,
    subtitle_data: dict,
    db: AsyncSession = Depends(get_db)
):
    """Update a subtitle"""
    query = select(Subtitle).where(
        Subtitle.id == subtitle_id,
        Subtitle.project_id == project_id
    )
    result = await db.execute(query)
    subtitle = result.scalar_one_or_none()
    
    if not subtitle:
        raise HTTPException(status_code=404, detail="Subtitle not found")
    
    # Update fields
    if "start_time" in subtitle_data:
        subtitle.start_time = subtitle_data["start_time"]
    if "end_time" in subtitle_data:
        subtitle.end_time = subtitle_data["end_time"]
    if "text" in subtitle_data:
        subtitle.text = subtitle_data["text"]
    if "text_arabic" in subtitle_data:
        subtitle.text_arabic = subtitle_data["text_arabic"]
    if "font_name" in subtitle_data:
        subtitle.font_name = subtitle_data["font_name"]
    if "font_size" in subtitle_data:
        subtitle.font_size = subtitle_data["font_size"]
    if "font_color" in subtitle_data:
        subtitle.font_color = subtitle_data["font_color"]
    if "background_color" in subtitle_data:
        subtitle.background_color = subtitle_data["background_color"]
    if "stroke_color" in subtitle_data:
        subtitle.stroke_color = subtitle_data["stroke_color"]
    if "stroke_width" in subtitle_data:
        subtitle.stroke_width = subtitle_data["stroke_width"]
    if "shadow_color" in subtitle_data:
        subtitle.shadow_color = subtitle_data["shadow_color"]
    if "shadow_offset" in subtitle_data:
        subtitle.shadow_offset = subtitle_data["shadow_offset"]
    if "opacity" in subtitle_data:
        subtitle.opacity = subtitle_data["opacity"]
    if "x_position" in subtitle_data:
        subtitle.x_position = subtitle_data["x_position"]
    if "y_position" in subtitle_data:
        subtitle.y_position = subtitle_data["y_position"]
    if "alignment" in subtitle_data:
        subtitle.alignment = subtitle_data["alignment"]
    if "is_visible" in subtitle_data:
        subtitle.is_visible = subtitle_data["is_visible"]
    if "is_locked" in subtitle_data:
        subtitle.is_locked = subtitle_data["is_locked"]
    
    subtitle.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(subtitle)
    
    return subtitle.to_dict()


@router.delete("/projects/{project_id}/subtitles/{subtitle_id}")
async def delete_subtitle(
    project_id: int,
    subtitle_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a subtitle"""
    query = delete(Subtitle).where(
        Subtitle.id == subtitle_id,
        Subtitle.project_id == project_id
    )
    
    result = await db.execute(query)
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Subtitle not found")
    
    await db.commit()
    
    return {"message": "Subtitle deleted successfully"}


@router.post("/projects/{project_id}/subtitles/bulk")
async def bulk_create_subtitles(
    project_id: int,
    subtitles_data: list,
    db: AsyncSession = Depends(get_db)
):
    """Bulk create subtitles"""
    created_subtitles = []
    
    for i, sub_data in enumerate(subtitles_data):
        subtitle = Subtitle(
            project_id=project_id,
            start_time=sub_data.get("start_time", 0.0),
            end_time=sub_data.get("end_time", 0.0),
            text=sub_data.get("text", ""),
            text_arabic=sub_data.get("text_arabic"),
            order_index=sub_data.get("order_index", i),
            surah_number=sub_data.get("surah_number"),
            verse_number=sub_data.get("verse_number"),
            verse_text=sub_data.get("verse_text"),
        )
        db.add(subtitle)
    
    await db.commit()
    
    # Fetch created subtitles
    query = select(Subtitle).where(Subtitle.project_id == project_id)
    result = await db.execute(query)
    subtitles = result.scalars().all()
    
    return {"subtitles": [s.to_dict() for s in subtitles]}


@router.get("/projects/{project_id}/subtitles/export")
async def export_subtitles(
    project_id: int,
    format: str = "srt",
    db: AsyncSession = Depends(get_db)
):
    """Export subtitles in SRT or VTT format"""
    query = select(Subtitle).where(
        Subtitle.project_id == project_id
    ).order_by(Subtitle.start_time)
    
    result = await db.execute(query)
    subtitles = result.scalars().all()
    
    if format == "srt":
        content = ""
        for i, sub in enumerate(subtitles, 1):
            start = format_timestamp_srt(sub.start_time)
            end = format_timestamp_srt(sub.end_time)
            content += f"{i}\n{start} --> {end}\n{sub.text}\n\n"
    elif format == "vtt":
        content = "WEBVTT\n\n"
        for sub in subtitles:
            start = format_timestamp_vtt(sub.start_time)
            end = format_timestamp_vtt(sub.end_time)
            content += f"{start} --> {end}\n{sub.text}\n\n"
    else:
        raise HTTPException(status_code=400, detail="Unsupported format. Use 'srt' or 'vtt'")
    
    return {
        "format": format,
        "content": content,
        "filename": f"subtitles.{format}"
    }


def format_timestamp_srt(seconds: float) -> str:
    """Format timestamp for SRT format"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    ms = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{ms:03d}"


def format_timestamp_vtt(seconds: float) -> str:
    """Format timestamp for VTT format"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    ms = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}.{ms:03d}"
