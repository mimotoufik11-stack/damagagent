"""
Dammaj Al-Quran - Subtitle Model
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, JSON
from app.db.base import Base


class Project(Base):
    """Project model - referenced for foreign key"""
    pass


class Subtitle(Base):
    """Subtitle model for storing subtitles"""
    
    __tablename__ = "subtitles"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, index=True)
    
    # Timing
    start_time = Column(Float, default=0.0)
    end_time = Column(Float, default=0.0)
    start_frame = Column(Integer, nullable=True)
    end_frame = Column(Integer, nullable=True)
    
    # Content
    text = Column(Text, nullable=False)
    text_arabic = Column(Text, nullable=True)  # Arabic translation if needed
    
    # Styling
    font_name = Column(String(100), default="Amiri")
    font_size = Column(Integer, default=48)
    font_color = Column(String(20), default="#FFFFFF")
    background_color = Column(String(20), nullable=True)
    stroke_color = Column(String(20), default="#000000")
    stroke_width = Column(Float, default=2.0)
    shadow_color = Column(String(20), default="#000000")
    shadow_offset = Column(Float, default=2.0)
    opacity = Column(Float, default=1.0)
    
    # Position
    x_position = Column(Float, default=0.5)  # 0-1 range
    y_position = Column(Float, default=0.9)  # 0-1 range
    alignment = Column(String(20), default="center")  # left, center, right
    
    # Quran-specific
    surah_number = Column(Integer, nullable=True)
    verse_number = Column(Integer, nullable=True)
    verse_text = Column(Text, nullable=True)
    
    # Ordering
    order_index = Column(Integer, default=0)
    
    # Status
    is_locked = Column(Boolean, default=False)
    is_visible = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self) -> str:
        return f"<Subtitle(id={self.id}, start={self.start_time}, text='{self.text[:30]}...')>"
    
    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "project_id": self.project_id,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "start_frame": self.start_frame,
            "end_frame": self.end_frame,
            "text": self.text,
            "text_arabic": self.text_arabic,
            "style": {
                "font_name": self.font_name,
                "font_size": self.font_size,
                "font_color": self.font_color,
                "background_color": self.background_color,
                "stroke_color": self.stroke_color,
                "stroke_width": self.stroke_width,
                "shadow_color": self.shadow_color,
                "shadow_offset": self.shadow_offset,
                "opacity": self.opacity,
            },
            "position": {
                "x": self.x_position,
                "y": self.y_position,
                "alignment": self.alignment,
            },
            "quran": {
                "surah_number": self.surah_number,
                "verse_number": self.verse_number,
                "verse_text": self.verse_text,
            },
            "order_index": self.order_index,
            "is_locked": self.is_locked,
            "is_visible": self.is_visible,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
