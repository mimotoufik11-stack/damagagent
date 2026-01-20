package com.myteam.ayah.data.db;

import androidx.room.Dao;
import androidx.room.Database;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.Update;
import androidx.room.migration.Migration;
import java.util.List;

@Dao
public interface ProjectDao {
    @Query("SELECT * FROM projects ORDER BY updatedAt DESC")
    List<ProjectEntity> getAllProjects();

    @Query("SELECT * FROM projects WHERE id = :id")
    ProjectEntity getProjectById(long id);

    @Query("SELECT * FROM projects WHERE status = :status ORDER BY updatedAt DESC")
    List<ProjectEntity> getProjectsByStatus(String status);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    long insertProject(ProjectEntity project);

    @Update
    void updateProject(ProjectEntity project);

    @Query("DELETE FROM projects WHERE id = :id")
    void deleteProject(long id);

    @Query("DELETE FROM projects")
    void deleteAllProjects();
}