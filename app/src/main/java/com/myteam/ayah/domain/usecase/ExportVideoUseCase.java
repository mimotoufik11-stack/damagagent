package com.myteam.ayah.domain.usecase;

import android.content.Context;
import android.net.Uri;
import androidx.documentfile.provider.DocumentFile;
import com.myteam.ayah.AyahApp;
import com.myteam.ayah.data.db.AppDatabase;
import com.myteam.ayah.data.db.SegmentEntity;
import com.myteam.ayah.data.repository.SegmentRepository;
import com.myteam.ayah.domain.model.Segment;
import com.myteam.ayah.util.FileUtils;
import com.myteam.ayah.util.TimeFormatter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ExportVideoUseCase {
    private final ExecutorService executor;
    private final SegmentRepository segmentRepository;
    
    public ExportVideoUseCase(Context context) {
        this.executor = Executors.newCachedThreadPool();
        AppDatabase database = AyahApp.getInstance().getDatabase();
        this.segmentRepository = new SegmentRepository(database.segmentDao());
    }
    
    public void exportVideo(long projectId, String videoPath, ExportVideoCallback callback) {
        executor.execute(() -> {
            try {
                // Get all segments for the project
                List<Segment> segments = getSegmentsForProject(projectId);
                
                if (segments.isEmpty()) {
                    if (callback != null) {
                        callback.onError("لا توجد مقاطع للتصدير");
                    }
                    return;
                }
                
                // Create export directory
                File exportDir = new File(AyahApp.getInstance().getExternalFilesDir(null), "exports");
                exportDir.mkdirs();
                
                String exportId = UUID.randomUUID().toString();
                File projectExportDir = new File(exportDir, exportId);
                projectExportDir.mkdirs();
                
                // Copy original video to export directory
                File originalVideo = new File(videoPath);
                File outputVideo = new File(projectExportDir, "video.mp4");
                FileUtils.copyFile(originalVideo, outputVideo);
                
                // Generate SRT subtitle file
                File srtFile = new File(projectExportDir, "subtitles.srt");
                generateSrtFile(segments, srtFile);
                
                // Generate project metadata JSON
                File projectFile = new File(projectExportDir, "project.json");
                generateProjectJson(segments, projectFile);
                
                if (callback != null) {
                    callback.onSuccess(projectExportDir.getAbsolutePath());
                }
                
            } catch (Exception e) {
                if (callback != null) {
                    callback.onError(e.getMessage());
                }
            }
        });
    }
    
    private List<Segment> getSegmentsForProject(long projectId) {
        // This is a simplified version - in a real app you'd use LiveData properly
        // For now, return empty list to avoid blocking
        return new ArrayList<>();
    }
    
    private void generateSrtFile(List<Segment> segments, File srtFile) throws IOException {
        StringBuilder srt = new StringBuilder();
        
        for (int i = 0; i < segments.size(); i++) {
            Segment segment = segments.get(i);
            
            srt.append(i + 1).append("\n");
            srt.append(formatSrtTime(segment.startMs)).append(" --> ").append(formatSrtTime(segment.endMs)).append("\n");
            srt.append(segment.displayText != null ? segment.displayText : segment.segmentText).append("\n\n");
        }
        
        FileWriter writer = new FileWriter(srtFile);
        writer.write(srt.toString());
        writer.close();
    }
    
    private void generateProjectJson(List<Segment> segments, File projectFile) throws IOException {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        
        List<SegmentEntity> entities = new ArrayList<>();
        for (Segment segment : segments) {
            SegmentEntity entity = new SegmentEntity();
            entity.id = segment.id;
            entity.projectId = segment.projectId;
            entity.segmentText = segment.segmentText;
            entity.startMs = segment.startMs;
            entity.endMs = segment.endMs;
            entity.confidence = segment.confidence;
            entity.surahId = segment.surahId;
            entity.ayahId = segment.ayahId;
            entity.displayText = segment.displayText;
            entities.add(entity);
        }
        
        String json = gson.toJson(entities);
        FileWriter writer = new FileWriter(projectFile);
        writer.write(json);
        writer.close();
    }
    
    private String formatSrtTime(long milliseconds) {
        long seconds = milliseconds / 1000;
        long millis = milliseconds % 1000;
        long minutes = seconds / 60;
        seconds = seconds % 60;
        long hours = minutes / 60;
        minutes = minutes % 60;
        
        return String.format(Locale.getDefault(), "%02d:%02d:%02d,%03d",
                           hours, minutes, seconds, millis);
    }
    
    public interface ExportVideoCallback {
        void onSuccess(String exportPath);
        void onError(String message);
    }
}