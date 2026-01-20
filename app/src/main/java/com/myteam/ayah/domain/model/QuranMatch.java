package com.myteam.ayah.domain.model;

/**
 * Represents a match between ASR text and a Quran verse.
 */
public class QuranMatch {
    public int surahId;
    public int ayahId;
    public String verseText;
    public long startMs;
    public long endMs;
    public double confidence;
    public java.util.List<String> asrTokens;
    public java.util.List<String> verseTokens;
    
    public QuranMatch() {}
    
    public QuranMatch(int surahId, int ayahId, String verseText, long startMs, long endMs,
                     float confidence, java.util.List<String> asrTokens, java.util.List<String> verseTokens) {
        this.surahId = surahId;
        this.ayahId = ayahId;
        this.verseText = verseText;
        this.startMs = startMs;
        this.endMs = endMs;
        this.confidence = confidence;
        this.asrTokens = asrTokens;
        this.verseTokens = verseTokens;
    }
    
    @Override
    public String toString() {
        return "QuranMatch{" +
                "surahId=" + surahId +
                ", ayahId=" + ayahId +
                ", confidence=" + confidence +
                ", verseText='" + verseText + '\'' +
                '}';
    }
}