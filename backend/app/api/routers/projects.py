"""
Dammaj Al-Quran - Projects API Router
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.db.database import get_db
from app.models.project import Project
from app.schemas.project import (
    ProjectCreate, ProjectUpdate, ProjectResponse, 
    ProjectListResponse, ProjectSettings
)


router = APIRouter()


@router.post("/projects", response_model=ProjectResponse, status_code=201)
async def create_project(
    project: ProjectCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new project"""
    db_project = Project(
        name=project.name,
        description=project.description,
        resolution_width=project.settings.resolution.width if project.settings else 1920,
        resolution_height=project.settings.resolution.height if project.settings else 1080,
        fps=project.settings.fps if project.settings else 30.0,
    )
    
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    
    return db_project.to_dict()


@router.get("/projects", response_model=ProjectListResponse)
async def list_projects(
    skip: int = 0,
    limit: int = 50,
    include_inactive: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """List all projects"""
    query = select(Project).order_by(Project.updated_at.desc())
    
    if not include_inactive:
        query = query.where(Project.is_active == True)
    
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    projects = result.scalars().all()
    
    total_query = select(Project)
    if not include_inactive:
        total_query = total_query.where(Project.is_active == True)
    
    total_result = await db.execute(total_query)
    total = len(total_result.scalars().all())
    
    return {
        "projects": [p.to_dict() for p in projects],
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a project by ID"""
    query = select(Project).where(Project.id == project_id)
    result = await db.execute(query)
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project.to_dict()


@router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a project"""
    query = select(Project).where(Project.id == project_id)
    result = await db.execute(query)
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Update fields
    update_data = project_update.model_dump(exclude_unset=True)
    
    if "name" in update_data:
        project.name = update_data["name"]
    if "description" in update_data:
        project.description = update_data["description"]
    if "settings" in update_data:
        settings = update_data["settings"]
        if settings:
            if "resolution" in settings:
                project.resolution_width = settings["resolution"].get("width", 1920)
                project.resolution_height = settings["resolution"].get("height", 1080)
            if "fps" in settings:
                project.fps = settings["fps"]
    
    project.updated_at = datetime.utcnow()
    project.is_saved = False
    
    await db.commit()
    await db.refresh(project)
    
    return project.to_dict()


@router.delete("/projects/{project_id}", status_code=204)
async def delete_project(
    project_id: int,
    permanent: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """Delete a project"""
    if permanent:
        query = delete(Project).where(Project.id == project_id)
    else:
        query = update(Project).where(Project.id == project_id).values(is_active=False)
    
    result = await db.execute(query)
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    await db.commit()


@router.post("/projects/{project_id}/save", response_model=ProjectResponse)
async def save_project(
    project_id: int,
    timeline_data: Optional[dict] = None,
    db: AsyncSession = Depends(get_db)
):
    """Save project state"""
    query = select(Project).where(Project.id == project_id)
    result = await db.execute(query)
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if timeline_data:
        project.timeline_data = timeline_data
    
    project.is_saved = True
    project.last_saved_at = datetime.utcnow()
    project.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(project)
    
    return project.to_dict()


@router.get("/projects/{project_id}/recent", response_model=ProjectResponse)
async def get_recent_project(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get recent project with timeline data"""
    query = select(Project).where(Project.id == project_id)
    result = await db.execute(query)
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project.to_dict()
