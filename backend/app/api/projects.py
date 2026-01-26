from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.database.db import get_db
from app.models import Project, MediaFile, Clip, Subtitle
from app.schemas.project import (
    ProjectCreate, 
    ProjectUpdate, 
    ProjectResponse, 
    ProjectListResponse
)
from app.schemas.media import (
    MediaFileCreate, 
    MediaFileResponse, 
    MediaFileListResponse
)

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    """Create a new video project"""
    try:
        db_project = Project(
            name=project.name,
            description=project.description,
            width=project.settings.width if project.settings else 1920,
            height=project.settings.height if project.settings else 1080,
            fps=project.settings.fps if project.settings else 30,
            bitrate=project.settings.bitrate if project.settings else 5000,
            background_color=project.settings.background_color if project.settings else "#000000"
        )
        
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        
        logger.info(f"Created project: {db_project.id}")
        return ProjectResponse.from_orm(db_project)
        
    except Exception as e:
        logger.error(f"Error creating project: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create project"
        )

@router.get("/", response_model=ProjectListResponse)
async def list_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all projects"""
    try:
        projects = db.query(Project).offset(skip).limit(limit).all()
        total = db.query(Project).count()
        
        return ProjectListResponse(
            projects=[ProjectResponse.from_orm(p) for p in projects],
            total=total,
            skip=skip,
            limit=limit
        )
        
    except Exception as e:
        logger.error(f"Error listing projects: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list projects"
        )

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    db: Session = Depends(get_db)
):
    """Get project by ID"""
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        return ProjectResponse.from_orm(project)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting project {project_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get project"
        )

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db)
):
    """Update project"""
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        # Update fields
        update_data = project_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(project, field, value)
        
        project.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(project)
        
        logger.info(f"Updated project: {project_id}")
        return ProjectResponse.from_orm(project)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating project {project_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update project"
        )

@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    db: Session = Depends(get_db)
):
    """Delete project"""
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        # Delete related records
        db.query(Subtitle).filter(Subtitle.project_id == project_id).delete()
        db.query(Clip).filter(Clip.project_id == project_id).delete()
        db.query(MediaFile).filter(MediaFile.project_id == project_id).delete()
        
        # Delete project
        db.delete(project)
        db.commit()
        
        logger.info(f"Deleted project: {project_id}")
        return {"message": "Project deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting project {project_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete project"
        )

@router.post("/{project_id}/media", response_model=MediaFileResponse)
async def upload_media_file(
    project_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload media file to project"""
    try:
        # Validate project exists
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        # Save file
        file_path = f"uploads/{project_id}/{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Create media file record
        media_file = MediaFile(
            project_id=project_id,
            filename=file.filename,
            original_name=file.filename,
            file_path=file_path,
            file_type=file.content_type or "unknown",
            file_size=len(content)
        )
        
        db.add(media_file)
        db.commit()
        db.refresh(media_file)
        
        logger.info(f"Uploaded media file: {media_file.id}")
        return MediaFileResponse.from_orm(media_file)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading media file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload media file"
        )

@router.get("/{project_id}/media", response_model=List[MediaFileResponse])
async def list_project_media(
    project_id: str,
    db: Session = Depends(get_db)
):
    """List all media files for a project"""
    try:
        # Validate project exists
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        media_files = db.query(MediaFile).filter(MediaFile.project_id == project_id).all()
        
        return [MediaFileResponse.from_orm(mf) for mf in media_files]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing media files for project {project_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list media files"
        )