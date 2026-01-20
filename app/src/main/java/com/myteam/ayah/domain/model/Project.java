package com.myteam.ayah.domain.model;

import java.util.Date;

public class Project {
    public long id;
    public String title;
    public String videoPath;
    public String audioPath;
    public String thumbnailPath;
    public String projectPath;
    public Date createdAt;
    public Date updatedAt;
    public String status;
    public String processingError;
    public int videoWidth;
    public int videoHeight;
    public long videoDurationMs;
    public String aspectRatio;
    
    public Project() {}
    
    public Project(long id, String title, String videoPath, String audioPath,
                   String thumbnailPath, String projectPath, Date createdAt,
                   Date updatedAt, String status) {
        this.id = id;
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