"""
Dammaj Al-Quran - Project Model
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, JSON
from app.db.base import Base


class Project(Base):
    """Project model for storing video editing projects"""
    
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Project settings
    resolution_width = Column(Integer, default=1920)
    resolution_height = Column(Integer, default=1080)
    fps = Column(Float, default=30.0)
    duration = Column(Float, default=0.0)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_saved = Column(Boolean, default=True)
    last_saved_at = Column(DateTime, nullable=True)
    
    # Metadata
    thumbnail_path = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Timeline data stored as JSON
    timeline_data = Column(JSON, default=dict)
    
    def __repr__(self) -> str:
        return f"<Project(id={self.id}, name='{self.name}')>"
    
    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "resolution": {
                "width": self.resolution_width,
                "height": self.resolution_height,
            },
            "fps": self.fps,
            "duration": self.duration,
            "is_active": self.is_active,
            "is_saved": self.is_saved,
            "last_saved_at": self.last_saved_at.isoformat() if self.last_saved_at else None,
            "thumbnail_path": self.thumbnail_path,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "timeline_data": self.timeline_data,
        }
