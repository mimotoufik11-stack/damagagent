package com.myteam.ayah.domain.model;

public class Segment {
    public long id;
    public long projectId;
    public String segmentText;
    public long startMs;
    public long endMs;
    public float confidence;
    public int surahId;
    public int ayahId;
    public String displayText;
    
    public Segment() {}
    
    public Segment(long id, long projectId, String segmentText, long startMs, long endMs,
                   float confidence, int surahId, int ayahId, String displayText) {
        this.id = id;
        this.projectId = projectId;
        this.segmentText = segmentText;
        this.startMs = startMs;
        this.endMs = endMs;
        this.confidence = confidence;
        this.surahId = surahId;
        this.ayahId = ayahId;
        this.displayText = displayText;
    }
}