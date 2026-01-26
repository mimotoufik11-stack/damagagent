"""
Dammaj Al-Quran - Timeline Clip Model
"""

from datetime import datetime
from typing import Optional
from enum import Enum
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, JSON, Enum as SQLEnum
from app.db.base import Base


class TrackType(str, Enum):
    """Track type enumeration"""
    VIDEO = "video"
    AUDIO = "audio"
    SUBTITLE = "subtitle"


class Project(Base):
    """Project model - referenced for foreign key"""
    pass


class Media(Base):
    """Media model - referenced for foreign key"""
    pass


class Clip(Base):
    """Timeline clip model for storing clips on the timeline"""
    
    __tablename__ = "clips"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, index=True)
    media_id = Column(Integer, ForeignKey("media.id"), nullable=True)
    
    # Track information
    track_id = Column(String(50), nullable=False, index=True)
    track_type = Column(SQLEnum(TrackType), default=TrackType.VIDEO)
    track_index = Column(Integer, default=0)
    
    # Clip timing
    start_time = Column(Float, default=0.0)  # Position on timeline in seconds
    duration = Column(Float, default=0.0)     # Duration on timeline
    source_start = Column(Float, default=0.0) # Start point in source media
    source_end = Column(Float, default=0.0)   # End point in source media
    
    # Clip properties
    name = Column(String(255), nullable=False)
    volume = Column(Float, default=1.0)
    opacity = Column(Float, default=1.0)
    speed = Column(Float, default=1.0)
    
    # Effects
    effects = Column(JSON, default=list)
    
    # Ordering
    order_index = Column(Integer, default=0)
    
    # Status
    is_locked = Column(Boolean, default=False)
    is_hidden = Column(Boolean, default=False)
    is_muted = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self) -> str:
        return f"<Clip(id={self.id}, name='{self.name}', track='{self.track_id}')>"
    
    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "project_id": self.project_id,
            "media_id": self.media_id,
            "track_id": self.track_id,
            "track_type": self.track_type.value,
            "track_index": self.track_index,
            "start_time": self.start_time,
            "duration": self.duration,
            "source_start": self.source_start,
            "source_end": self.source_end,
            "name": self.name,
            "volume": self.volume,
            "opacity": self.opacity,
            "speed": self.speed,
            "effects": self.effects,
            "order_index": self.order_index,
            "is_locked": self.is_locked,
            "is_hidden": self.is_hidden,
            "is_muted": self.is_muted,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
