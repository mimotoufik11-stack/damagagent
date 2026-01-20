package com.myteam.ayah.worker;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import com.myteam.ayah.AyahApp;
import com.myteam.ayah.data.db.AppDatabase;
import com.myteam.ayah.data.db.SegmentEntity;
import com.myteam.ayah.data.repository.SegmentRepository;
import com.myteam.ayah.domain.model.Segment;
import com.myteam.ayah.domain.model.QuranMatch;
import com.myteam.ayah.util.FileUtils;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class BuildSegmentsWorker extends Worker {
    public static final String KEY_INPUT_MATCHES_PATH = "input_matches_path";
    public static final String KEY_OUTPUT_SEGMENTS_PATH = "output_segments_path";
    public static final String KEY_PROJECT_ID = "project_id";
    
    public BuildSegmentsWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }
    
    @NonNull
    @Override
    public Result doWork() {
        String matchesPath = getInputData().getString(KEY_INPUT_MATCHES_PATH);
        String segmentsPath = getInputData().getString(KEY_OUTPUT_SEGMENTS_PATH);
        long projectId = getInputData().getLong(KEY_PROJECT_ID, -1);
        
        if (matchesPath == null || projectId == -1) {
            return Result.failure();
        }
        
        try {
            // Load Quran matches
            List<QuranMatch> matches = loadMatches(matchesPath);
            
            // Build segments from matches
            List<SegmentEntity> segments = buildSegmentsFromMatches(matches, projectId);
            
            // Save segments to database
            AppDatabase database = AyahApp.getInstance().getDatabase();
            for (SegmentEntity segment : segments) {
                database.segmentDao().insertSegment(segment);
            }
            
            // Save segments to JSON file
            saveSegmentsToFile(segments, new File(segmentsPath));
            
            return Result.success();
            
        } catch (Exception e) {
            return Result.failure();
        }
    }
    
    private List<QuranMatch> loadMatches(String matchesPath) throws Exception {
        File file = new File(matchesPath);
        if (!file.exists()) {
            return new ArrayList<>();
        }
        
        String json = FileUtils.readTextFromFile(file);
        Gson gson = new GsonBuilder().create();
        return java.util.Arrays.asList(gson.fromJson(json, QuranMatch[].class));
    }
    
    private List<SegmentEntity> buildSegmentsFromMatches(List<QuranMatch> matches, long projectId) {
        List<SegmentEntity> segments = new ArrayList<>();
        
        for (QuranMatch match : matches) {
            SegmentEntity segment = new SegmentEntity();
            segment.projectId = projectId;
            segment.segmentText = String.join(" ", match.asrTokens);
            segment.startMs = match.startMs;
            segment.endMs = match.endMs;
            segment.confidence = (float) match.confidence;
            segment.surahId = match.surahId;
            segment.ayahId = match.ayahId;
            segment.displayText = match.verseText;
            segments.add(segment);
        }
        
        return segments;
    }
    
    private void saveSegmentsToFile(List<SegmentEntity> segments, File file) throws Exception {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        String json = gson.toJson(segments);
        FileUtils.writeTextToFile(file, json);
    }
}