package com.myteam.ayah.domain.model;

/**
 * Represents a verse from the Quran.
 */
public class QuranVerse {
    public int surahId;
    public int ayahId;
    public String text;
    
    public QuranVerse() {}
    
    public QuranVerse(int surahId, int ayahId, String text) {
        this.surahId = surahId;
        this.ayahId = ayahId;
        this.text = text;
    }
    
    @Override
    public String toString() {
        return "QuranVerse{" +
                "surahId=" + surahId +
                ", ayahId=" + ayahId +
                ", text='" + text + '\'' +
                '}';
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        QuranVerse that = (QuranVerse) obj;
        return surahId == that.surahId && ayahId == that.ayahId;
    }
    
    @Override
    public int hashCode() {
        return surahId * 1000 + ayahId;
    }
}