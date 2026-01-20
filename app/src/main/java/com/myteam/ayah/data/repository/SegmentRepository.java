package com.myteam.ayah.data.repository;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.myteam.ayah.data.db.SegmentDao;
import com.myteam.ayah.data.db.SegmentEntity;
import com.myteam.ayah.domain.model.Segment;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class SegmentRepository {
    private SegmentDao segmentDao;
    private ExecutorService executor;
    
    public SegmentRepository(SegmentDao segmentDao) {
        this.segmentDao = segmentDao;
        this.executor = Executors.newCachedThreadPool();
    }
    
    public LiveData<List<Segment>> getSegmentsByProjectId(long projectId) {
        return new LiveData<List<Segment>>() {
            @Override
            public void onActive() {
                super.onActive();
                executor.execute(() -> {
                    List<SegmentEntity> entities = segmentDao.getSegmentsByProjectId(projectId);
                    List<Segment> segments = new ArrayList<>();
                    for (SegmentEntity entity : entities) {
                        segments.add(entityToModel(entity));
                    }
                    postValue(segments);
                });
            }
        };
    }
    
    public void insertSegment(Segment segment, SegmentRepositoryCallback<Long> callback) {
        executor.execute(() -> {
            try {
                SegmentEntity entity = modelToEntity(segment);
                long id = segmentDao.insertSegment(entity);
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
    
    public void insertSegments(List<Segment> segments, SegmentRepositoryCallback<List<Long>> callback) {
        executor.execute(() -> {
            try {
                List<SegmentEntity> entities = new ArrayList<>();
                for (Segment segment : segments) {
                    entities.add(modelToEntity(segment));
                }
                List<Long> ids = segmentDao.insertSegments(entities);
                if (callback != null) {
                    callback.onSuccess(ids);
                }
            } catch (Exception e) {
                if (callback != null) {
                    callback.onError(e.getMessage());
                }
            }
        });
    }
    
    public void updateSegment(Segment segment, SegmentRepositoryCallback<Void> callback) {
        executor.execute(() -> {
            try {
                SegmentEntity entity = modelToEntity(segment);
                segmentDao.updateSegment(entity);
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
    
    public void deleteSegment(long id, SegmentRepositoryCallback<Void> callback) {
        executor.execute(() -> {
            try {
                segmentDao.deleteSegmentById(id);
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
    
    private SegmentEntity modelToEntity(Segment model) {
        SegmentEntity entity = new SegmentEntity();
        entity.id = model.id;
        entity.projectId = model.projectId;
        entity.segmentText = model.segmentText;
        entity.startMs = model.startMs;
        entity.endMs = model.endMs;
        entity.confidence = model.confidence;
        entity.surahId = model.surahId;
        entity.ayahId = model.ayahId;
        entity.displayText = model.displayText;
        return entity;
    }
    
    private Segment entityToModel(SegmentEntity entity) {
        Segment model = new Segment();
        model.id = entity.id;
        model.projectId = entity.projectId;
        model.segmentText = entity.segmentText;
        model.startMs = entity.startMs;
        model.endMs = entity.endMs;
        model.confidence = entity.confidence;
        model.surahId = entity.surahId;
        model.ayahId = entity.ayahId;
        model.displayText = entity.displayText;
        return model;
    }
    
    public interface SegmentRepositoryCallback<T> {
        void onSuccess(T result);
        void onError(String message);
    }
}