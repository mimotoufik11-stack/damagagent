package com.myteam.ayah.util;

import android.content.Context;
import android.util.Log;
import com.myteam.ayah.domain.model.QuranVerse;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

/**
 * Utility class to load Quran data from assets.
 */
public class QuranDataLoader {
    private static final String TAG = "QuranDataLoader";
    private static final String QURAN_DATA_PATH = "quran/quran_uthmani.json";
    private static final String SURAH_INDEX_PATH = "quran/surah_index.json";
    
    private static List<QuranVerse> cachedVerses;
    private static List<SurahInfo> cachedSurahIndex;
    
    /**
     * Loads Quran verses from the asset file.
     */
    public static List<QuranVerse> loadQuranVerses(Context context) {
        if (cachedVerses != null) {
            return cachedVerses;
        }
        
        try {
            String json = FileUtils.readTextFromAsset(context, QURAN_DATA_PATH);
            Gson gson = new GsonBuilder().create();
            Type listType = new TypeToken<List<QuranVerse>>(){}.getType();
            cachedVerses = gson.fromJson(json, listType);
            
            if (cachedVerses == null) {
                cachedVerses = new ArrayList<>();
            }
            
            Log.d(TAG, "Loaded " + cachedVerses.size() + " Quran verses");
            return cachedVerses;
            
        } catch (IOException e) {
            Log.e(TAG, "Error loading Quran data", e);
            return new ArrayList<>();
        }
    }
    
    /**
     * Loads Surah index from the asset file.
     */
    public static List<SurahInfo> loadSurahIndex(Context context) {
        if (cachedSurahIndex != null) {
            return cachedSurahIndex;
        }
        
        try {
            String json = FileUtils.readTextFromAsset(context, SURAH_INDEX_PATH);
            Gson gson = new GsonBuilder().create();
            Type listType = new TypeToken<List<SurahInfo>>(){}.getType();
            cachedSurahIndex = gson.fromJson(json, listType);
            
            if (cachedSurahIndex == null) {
                cachedSurahIndex = new ArrayList<>();
            }
            
            Log.d(TAG, "Loaded " + cachedSurahIndex.size() + " Surah info");
            return cachedSurahIndex;
            
        } catch (IOException e) {
            Log.e(TAG, "Error loading Surah index", e);
            return new ArrayList<>();
        }
    }
    
    /**
     * Searches for verses containing the given text.
     */
    public static List<QuranVerse> searchVerses(Context context, String searchText) {
        List<QuranVerse> allVerses = loadQuranVerses(context);
        List<QuranVerse> results = new ArrayList<>();
        
        if (searchText == null || searchText.trim().isEmpty()) {
            return results;
        }
        
        String normalizedSearch = ArabicNormalizer.normalize(searchText);
        
        for (QuranVerse verse : allVerses) {
            String normalizedVerse = ArabicNormalizer.normalize(verse.text);
            if (normalizedVerse.contains(normalizedSearch)) {
                results.add(verse);
            }
        }
        
        return results;
    }
    
    /**
     * Gets verses from a specific Surah.
     */
    public static List<QuranVerse> getVersesBySurah(Context context, int surahId) {
        List<QuranVerse> allVerses = loadQuranVerses(context);
        List<QuranVerse> results = new ArrayList<>();
        
        for (QuranVerse verse : allVerses) {
            if (verse.surahId == surahId) {
                results.add(verse);
            }
        }
        
        return results;
    }
    
    /**
     * Gets a specific verse by Surah and Ayah number.
     */
    public static QuranVerse getVerse(Context context, int surahId, int ayahId) {
        List<QuranVerse> allVerses = loadQuranVerses(context);
        
        for (QuranVerse verse : allVerses) {
            if (verse.surahId == surahId && verse.ayahId == ayahId) {
                return verse;
            }
        }
        
        return null;
    }
    
    /**
     * Information about a Surah.
     */
    public static class SurahInfo {
        public int surahId;
        public String nameAr;
        public String nameEn;
        public int ayahCount;
        
        public SurahInfo() {}
        
        public SurahInfo(int surahId, String nameAr, String nameEn, int ayahCount) {
            this.surahId = surahId;
            this.nameAr = nameAr;
            this.nameEn = nameEn;
            this.ayahCount = ayahCount;
        }
    }
}