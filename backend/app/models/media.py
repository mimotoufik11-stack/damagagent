"""
Dammaj Al-Quran - Media Asset Model
"""

from datetime import datetime
from typing import Optional
from enum import Enum
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, Enum as SQLEnum
from app.db.base import Base


class MediaType(str, Enum):
    """Media type enumeration"""
    VIDEO = "video"
    AUDIO = "audio"
    IMAGE = "image"
    FONT = "font"


class Project(Base):
    """Project model - already created in project.py, referenced here for clarity"""
    pass


class Media(Base):
    """Media asset model for storing imported media files"""
    
    __tablename__ = "media"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, index=True)
    
    # File information
    name = Column(String(255), nullable=False)
    original_filename = Column(String(512), nullable=True)
    file_path = Column(String(1024), nullable=False)
    file_size = Column(Integer, default=0)
    media_type = Column(SQLEnum(MediaType), default=MediaType.VIDEO)
    mime_type = Column(String(100), nullable=True)
    
    # Media metadata
    duration = Column(Float, default=0.0)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    frame_rate = Column(Float, nullable=True)
    sample_rate = Column(Integer, nullable=True)
    channels = Column(Integer, nullable=True)
    
    # Thumbnail
    thumbnail_path = Column(String(512), nullable=True)
    
    # Status
    is_imported = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self) -> str:
        return f"<Media(id={self.id}, name='{self.name}', type='{self.media_type}')>"
    
    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "project_id": self.project_id,
            "name": self.name,
            "original_filename": self.original_filename,
            "file_path": self.file_path,
            "file_size": self.file_size,
            "media_type": self.media_type.value,
            "mime_type": self.mime_type,
            "duration": self.duration,
            "width": self.width,
            "height": self.height,
            "frame_rate": self.frame_rate,
            "sample_rate": self.sample_rate,
            "channels": self.channels,
            "thumbnail_path": self.thumbnail_path,
            "is_imported": self.is_imported,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
