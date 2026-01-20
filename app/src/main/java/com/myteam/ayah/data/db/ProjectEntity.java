package com.myteam.ayah.data.db;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
import java.util.Date;

@Entity(tableName = "projects")
public class ProjectEntity {
    @PrimaryKey(autoGenerate = true)
    public long id;
    
    public String title;
    public String videoPath;
    public String audioPath;
    public String thumbnailPath;
    public String projectPath;
    public Date createdAt;
    public Date updatedAt;
    public String status; // "draft", "processing", "completed", "error"
    public String processingError;
    public int videoWidth;
    public int videoHeight;
    public long videoDurationMs;
    public String aspectRatio;
    
    public ProjectEntity() {}
    
    public ProjectEntity(String title, String videoPath, String audioPath, 
                        String thumbnailPath, String projectPath,
                        Date createdAt, Date updatedAt, String status) {
        this.title = title;
        this.videoPath = videoPath;
        this.audioPath = audioPath;
        this.thumbnailPath = thumbnailPath;
        this.projectPath = projectPath;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.status = status;
    }
}