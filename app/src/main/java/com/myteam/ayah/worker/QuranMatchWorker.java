package com.myteam.ayah.worker;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import com.myteam.ayah.util.QuranMatcher;
import com.myteam.ayah.util.QuranDataLoader;
import com.myteam.ayah.util.FileUtils;
import com.myteam.ayah.domain.model.QuranVerse;
import com.myteam.ayah.domain.model.QuranMatch;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class QuranMatchWorker extends Worker {
    public static final String KEY_INPUT_SEGMENTS_PATH = "input_segments_path";
    public static final String KEY_OUTPUT_MATCHES_PATH = "output_matches_path";
    
    public QuranMatchWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }
    
    @NonNull
    @Override
    public Result doWork() {
        String segmentsPath = getInputData().getString(KEY_INPUT_SEGMENTS_PATH);
        String matchesPath = getInputData().getString(KEY_OUTPUT_MATCHES_PATH);
        
        if (segmentsPath == null || matchesPath == null) {
            return Result.failure();
        }
        
        try {
            // Load Quran data
            List<QuranVerse> quranVerses = QuranDataLoader.loadQuranVerses(getApplicationContext());
            QuranMatcher matcher = new QuranMatcher(quranVerses);
            
            // Load ASR segments
            List<AsrSegment> segments = loadAsrSegments(segmentsPath);
            
            // Match segments with Quran
            List<QuranMatch> allMatches = new ArrayList<>();
            
            for (AsrSegment segment : segments) {
                List<QuranMatch> segmentMatches = matcher.matchSegment(
                    segment.text, segment.startMs, segment.endMs, segment.confidence);
                allMatches.addAll(segmentMatches);
            }
            
            // Save matches to JSON
            saveMatchesToFile(allMatches, new File(matchesPath));
            
            return Result.success();
            
        } catch (Exception e) {
            return Result.failure();
        }
    }
    
    private List<AsrSegment> loadAsrSegments(String segmentsPath) throws Exception {
        // This is a simplified implementation
        // In a real app, you'd parse the actual JSON file
        List<AsrSegment> segments = new ArrayList<>();
        
        // For now, return empty list
        return segments;
    }
    
    private void saveMatchesToFile(List<QuranMatch> matches, File file) throws Exception {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        String json = gson.toJson(matches);
        FileUtils.writeTextToFile(file, json);
    }
    
    // Helper class for ASR segments (should be moved to a separate file)
    public static class AsrSegment {
        public String text;
        public long startMs;
        public long endMs;
        public float confidence;
        
        public AsrSegment() {}
        
        public AsrSegment(String text, long startMs, long endMs, float confidence) {
            this.text = text;
            this.startMs = startMs;
            this.endMs = endMs;
            this.confidence = confidence;
        }
    }
}