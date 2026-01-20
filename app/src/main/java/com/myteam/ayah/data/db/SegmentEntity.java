package com.myteam.ayah.data.db;

import androidx.room.Entity;
import androidx.room.ForeignKey;
import androidx.room.PrimaryKey;
import androidx.room.Index;

@Entity(tableName = "segments",
        foreignKeys = @ForeignKey(
                entity = ProjectEntity.class,
                parentColumns = "id",
                childColumns = "projectId",
                onDelete = ForeignKey.CASCADE
        ),
        indices = @Index(value = "projectId"))
public class SegmentEntity {
    @PrimaryKey(autoGenerate = true)
    public long id;
    
    public long projectId;
    public String segmentText;
    public long startMs;
    public long endMs;
    public float confidence;
    public int surahId;
    public int ayahId;
    public String displayText;
    
    // Style properties
    public String fontFamily;
    public float fontSize;
    public int textColor;
    public int backgroundColor;
    public boolean backgroundEnabled;
    public float opacity;
    public float cornerRadius;
    public boolean shadowEnabled;
    public int strokeColor;
    public float strokeWidth;
    
    // Position properties
    public String verticalPosition; // "top", "center", "bottom"
    public String horizontalAlignment; // "start", "center", "end"
    public float offsetX;
    public float offsetY;
    
    public SegmentEntity() {}
    
    public SegmentEntity(long projectId, String segmentText, long startMs, long endMs,
                        float confidence, int surahId, int ayahId, String displayText) {
        this.projectId = projectId;
        this.segmentText = segmentText;
        this.startMs = startMs;
        this.endMs = endMs;
        this.confidence = confidence;
        this.surahId = surahId;
        this.ayahId = ayahId;
        this.displayText = displayText;
        
        // Default style
        this.fontFamily = "Cairo";
        this.fontSize = 18f;
        this.textColor = 0xFFFFFFFF;
        this.backgroundColor = 0x80000000;
        this.backgroundEnabled = true;
        this.opacity = 1.0f;
        this.cornerRadius = 8f;
        this.shadowEnabled = true;
        this.strokeColor = 0x00000000;
        this.strokeWidth = 0f;
        this.verticalPosition = "bottom";
        this.horizontalAlignment = "center";
        this.offsetX = 0f;
        this.offsetY = 0f;
    }
}