"""
Dammaj Al-Quran - AI Job Model
"""

from datetime import datetime
from typing import Optional
from enum import Enum
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, Enum as SQLEnum, JSON
from app.db.base import Base


class JobStatus(str, Enum):
    """Job status enumeration"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class JobType(str, Enum):
    """AI job type enumeration"""
    TRANSCRIPTION = "transcription"
    DUBBING = "dubbing"
    NOISE_REDUCTION = "noise_reduction"
    SUBTITLE_GENERATION = "subtitle_generation"
    VERSE_RECOGNITION = "verse_recognition"


class AIJob(Base):
    """AI job model for tracking background AI tasks"""
    
    __tablename__ = "ai_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, index=True)
    
    # Job information
    job_type = Column(SQLEnum(JobType), nullable=False)
    status = Column(SQLEnum(JobStatus), default=JobStatus.PENDING)
    
    # Input/Output
    input_path = Column(String(1024), nullable=True)
    output_path = Column(String(1024), nullable=True)
    result_data = Column(JSON, nullable=True)
    
    # Progress
    progress = Column(Float, default=0.0)
    message = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Settings
    parameters = Column(JSON, default=dict)
    
    # Timing
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self) -> str:
        return f"<AIJob(id={self.id}, type='{self.job_type}', status='{self.status}')>"
    
    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "project_id": self.project_id,
            "job_type": self.job_type.value,
            "status": self.status.value,
            "input_path": self.input_path,
            "output_path": self.output_path,
            "result_data": self.result_data,
            "progress": self.progress,
            "message": self.message,
            "error_message": self.error_message,
            "parameters": self.parameters,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
