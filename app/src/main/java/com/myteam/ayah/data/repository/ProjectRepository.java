package com.myteam.ayah.data.repository;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.myteam.ayah.data.db.ProjectDao;
import com.myteam.ayah.data.db.ProjectEntity;
import com.myteam.ayah.domain.model.Project;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ProjectRepository {
    private ProjectDao projectDao;
    private ExecutorService executor;
    
    public ProjectRepository(ProjectDao projectDao) {
        this.projectDao = projectDao;
        this.executor = Executors.newCachedThreadPool();
    }
    
    public LiveData<List<Project>> getAllProjects() {
        return new LiveData<List<Project>>() {
            @Override
            public void onActive() {
                super.onActive();
                executor.execute(() -> {
                    List<ProjectEntity> entities = projectDao.getAllProjects();
                    List<Project> projects = new ArrayList<>();
                    for (ProjectEntity entity : entities) {
                        projects.add(entityToModel(entity));
                    }
                    postValue(projects);
                });
            }
        };
    }
    
    public LiveData<Project> getProjectById(long id) {
        return new LiveData<Project>() {
            @Override
            public void onActive() {
                super.onActive();
                executor.execute(() -> {
                    ProjectEntity entity = projectDao.getProjectById(id);
                    if (entity != null) {
                        postValue(entityToModel(entity));
                    }
                });
            }
        };
    }
    
    public void insertProject(Project project, ProjectRepositoryCallback<Long> callback) {
        executor.execute(() -> {
            try {
                ProjectEntity entity = modelToEntity(project);
                entity.createdAt = new Date();
                entity.updatedAt = new Date();
                long id = projectDao.insertProject(entity);
                if (callback != null) {
                    callback.onSuccess(id);
                }
            } catch (Exception e) {
                if (callback != null) {
                    callback.onError(e.getMessage());
                }
            }
        });
    }
    
    public void updateProject(Project project, ProjectRepositoryCallback<Void> callback) {
        executor.execute(() -> {
            try {
                ProjectEntity entity = modelToEntity(project);
                entity.updatedAt = new Date();
                projectDao.updateProject(entity);
                if (callback != null) {
                    callback.onSuccess(null);
                }
            } catch (Exception e) {
                if (callback != null) {
                    callback.onError(e.getMessage());
                }
            }
        });
    }
    
    public void deleteProject(long id, ProjectRepositoryCallback<Void> callback) {
        executor.execute(() -> {
            try {
                projectDao.deleteProject(id);
                if (callback != null) {
                    callback.onSuccess(null);
                }
            } catch (Exception e) {
                if (callback != null) {
                    callback.onError(e.getMessage());
                }
            }
        });
    }
    
    private ProjectEntity modelToEntity(Project model) {
        ProjectEntity entity = new ProjectEntity();
        entity.id = model.id;
        entity.title = model.title;
        entity.videoPath = model.videoPath;
        entity.audioPath = model.audioPath;
        entity.thumbnailPath = model.thumbnailPath;
        entity.projectPath = model.projectPath;
        entity.createdAt = model.createdAt;
        entity.updatedAt = model.updatedAt;
        entity.status = model.status;
        entity.processingError = model.processingError;
        entity.videoWidth = model.videoWidth;
        entity.videoHeight = model.videoHeight;
        entity.videoDurationMs = model.videoDurationMs;
        entity.aspectRatio = model.aspectRatio;
        return entity;
    }
    
    private Project entityToModel(ProjectEntity entity) {
        Project model = new Project();
        model.id = entity.id;
        model.title = entity.title;
        model.videoPath = entity.videoPath;
        model.audioPath = entity.audioPath;
        model.thumbnailPath = entity.thumbnailPath;
        model.projectPath = entity.projectPath;
        model.createdAt = entity.createdAt;
        model.updatedAt = entity.updatedAt;
        model.status = entity.status;
        model.processingError = entity.processingError;
        model.videoWidth = entity.videoWidth;
        model.videoHeight = entity.videoHeight;
        model.videoDurationMs = entity.videoDurationMs;
        model.aspectRatio = entity.aspectRatio;
        return model;
    }
    
    public interface ProjectRepositoryCallback<T> {
        void onSuccess(T result);
        void onError(String message);
    }
}