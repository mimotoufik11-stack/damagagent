"""
Dammaj Al-Quran - Fonts API Router
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update
from datetime import datetime
import os

from app.db.database import get_db
from app.models.font import Font


router = APIRouter()


@router.get("/fonts")
async def list_fonts(
    category: Optional[str] = None,
    include_inactive: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """List all available fonts"""
    query = select(Font)
    
    if not include_inactive:
        query = query.where(Font.is_active == True)
    
    if category:
        query = query.where(Font.category == category)
    
    query = query.order_by(Font.category, Font.display_name)
    
    result = await db.execute(query)
    fonts = result.scalars().all()
    
    # Group by category
    fonts_by_category = {}
    for font in fonts:
        cat = font.category
        if cat not in fonts_by_category:
            fonts_by_category[cat] = []
        fonts_by_category[cat].append(font.to_dict())
    
    return {
        "fonts": [f.to_dict() for f in fonts],
        "by_category": fonts_by_category,
        "total": len(fonts)
    }


@router.get("/fonts/{font_id}")
async def get_font(
    font_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get font details"""
    query = select(Font).where(Font.id == font_id)
    result = await db.execute(query)
    font = result.scalar_one_or_none()
    
    if not font:
        raise HTTPException(status_code=404, detail="Font not found")
    
    return font.to_dict()


@router.post("/fonts")
async def create_font(
    font_data: dict,
    db: AsyncSession = Depends(get_db)
):
    """Add a new font to the library"""
    font = Font(
        name=font_data.get("name"),
        display_name=font_data.get("display_name"),
        family=font_data.get("family"),
        style=font_data.get("style"),
        file_path=font_data.get("file_path"),
        file_size=font_data.get("file_size", 0),
        version=font_data.get("version"),
        license=font_data.get("license"),
        category=font_data.get("category", "general"),
        is_arabic=font_data.get("is_arabic", True),
        is_default=font_data.get("is_default", False),
    )
    
    db.add(font)
    await db.commit()
    await db.refresh(font)
    
    return font.to_dict()


@router.put("/fonts/{font_id}")
async def update_font(
    font_id: int,
    font_data: dict,
    db: AsyncSession = Depends(get_db)
):
    """Update font metadata"""
    query = select(Font).where(Font.id == font_id)
    result = await db.execute(query)
    font = result.scalar_one_or_none()
    
    if not font:
        raise HTTPException(status_code=404, detail="Font not found")
    
    if "display_name" in font_data:
        font.display_name = font_data["display_name"]
    if "category" in font_data:
        font.category = font_data["category"]
    if "is_default" in font_data:
        font.is_default = font_data["is_default"]
    if "is_active" in font_data:
        font.is_active = font_data["is_active"]
    
    font.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(font)
    
    return font.to_dict()


@router.delete("/fonts/{font_id}")
async def delete_font(
    font_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a font"""
    query = select(Font).where(Font.id == font_id)
    result = await db.execute(query)
    font = result.scalar_one_or_none()
    
    if not font:
        raise HTTPException(status_code=404, detail="Font not found")
    
    # Delete font file
    if os.path.exists(font.file_path):
        os.remove(font.file_path)
    
    await db.delete(font)
    await db.commit()
    
    return {"message": "Font deleted successfully"}


@router.post("/fonts/default")
async def set_default_font(
    font_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Set a font as default"""
    # Remove default from all fonts
    query = select(Font).where(Font.is_default == True)
    result = await db.execute(query)
    default_fonts = result.scalars().all()
    
    for f in default_fonts:
        f.is_default = False
    
    # Set new default
    query = select(Font).where(Font.id == font_id)
    result = await db.execute(query)
    font = result.scalar_one_or_none()
    
    if not font:
        raise HTTPException(status_code=404, detail="Font not found")
    
    font.is_default = True
    
    await db.commit()
    await db.refresh(font)
    
    return font.to_dict()


@router.get("/fonts/categories")
async def get_font_categories():
    """Get list of font categories"""
    return {
        "categories": [
            {"id": "quran", "name": "Quran", "description": "Fonts optimized for Quranic text"},
            {"id": "arabic", "name": "Arabic", "description": "General Arabic fonts"},
            {"id": "english", "name": "English", "description": "English fonts"},
            {"id": "heading", "name": "Headings", "description": "Fonts for titles and headings"},
            {"id": "body", "name": "Body", "description": "Fonts for body text"},
        ]
    }
