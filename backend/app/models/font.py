"""
Dammaj Al-Quran - Font Model
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from app.db.base import Base


class Font(Base):
    """Font model for storing available fonts"""
    
    __tablename__ = "fonts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    display_name = Column(String(255), nullable=False)
    family = Column(String(100), nullable=True)
    style = Column(String(50), nullable=True)
    
    # File information
    file_path = Column(String(1024), nullable=False)
    file_size = Column(Integer, default=0)
    
    # Font metadata
    version = Column(String(20), nullable=True)
    license = Column(String(100), nullable=True)
    
    # Categories
    category = Column(String(50), default="general")  # quran, arabic, english, heading, body
    is_arabic = Column(Boolean, default=True)
    is_default = Column(Boolean, default=False)
    is_downloaded = Column(Boolean, default=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self) -> str:
        return f"<Font(id={self.id}, name='{self.name}', display='{self.display_name}')>"
    
    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "display_name": self.display_name,
            "family": self.family,
            "style": self.style,
            "file_path": self.file_path,
            "file_size": self.file_size,
            "version": self.version,
            "license": self.license,
            "category": self.category,
            "is_arabic": self.is_arabic,
            "is_default": self.is_default,
            "is_downloaded": self.is_downloaded,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
