package com.myteam.ayah.data.db;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;
import java.util.List;

@Dao
public interface SegmentDao {
    @Query("SELECT * FROM segments WHERE projectId = :projectId ORDER BY startMs ASC")
    List<SegmentEntity> getSegmentsByProjectId(long projectId);

    @Query("SELECT * FROM segments WHERE id = :id")
    SegmentEntity getSegmentById(long id);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    long insertSegment(SegmentEntity segment);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    List<Long> insertSegments(List<SegmentEntity> segments);

    @Update
    void updateSegment(SegmentEntity segment);

    @Delete
    void deleteSegment(SegmentEntity segment);

    @Query("DELETE FROM segments WHERE projectId = :projectId")
    void deleteSegmentsByProjectId(long projectId);

    @Query("DELETE FROM segments WHERE id = :id")
    void deleteSegmentById(long id);

    @Query("SELECT COUNT(*) FROM segments WHERE projectId = :projectId")
    int getSegmentCountByProjectId(long projectId);
}