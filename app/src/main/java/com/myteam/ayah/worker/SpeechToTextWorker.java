package com.myteam.ayah.worker;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import com.myteam.ayah.util.FileUtils;
import com.myteam.ayah.service.SpeechRecognizerService;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SpeechToTextWorker extends Worker {
    public static final String KEY_INPUT_AUDIO_PATH = "input_audio_path";
    public static final String KEY_OUTPUT_SEGMENTS_PATH = "output_segments_path";
    public static final String KEY_CONFIDENCE_THRESHOLD = "confidence_threshold";
    
    public SpeechToTextWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }
    
    @NonNull
    @Override
    public Result doWork() {
        String audioPath = getInputData().getString(KEY_INPUT_AUDIO_PATH);
        String segmentsPath = getInputData().getString(KEY_OUTPUT_SEGMENTS_PATH);
        float confidenceThreshold = getInputData().getFloat(KEY_CONFIDENCE_THRESHOLD, 0.6f);
        
        if (audioPath == null || segmentsPath == null) {
            return Result.failure();
        }
        
        try {
            File audioFile = new File(audioPath);
            if (!audioFile.exists()) {
                return Result.failure();
            }
            
            // Use SpeechRecognizerService to transcribe audio
            SpeechRecognizerService recognizerService = new SpeechRecognizerService(getApplicationContext());
            List<SpeechRecognizerService.AsrSegment> segments = recognizerService.transcribeAudio(audioPath, confidenceThreshold);
            
            // Save segments to JSON file
            File segmentsFile = new File(segmentsPath);
            saveSegmentsToFile(segments, segmentsFile);
            
            return Result.success();
            
        } catch (Exception e) {
            return Result.failure();
        }
    }
    
    private void saveSegmentsToFile(List<SpeechRecognizerService.AsrSegment> segments, File file) throws Exception {
        // This is a simplified implementation - in a real app you'd use proper JSON serialization
        StringBuilder json = new StringBuilder();
        json.append("[\n");
        
        for (int i = 0; i < segments.size(); i++) {
            SpeechRecognizerService.AsrSegment segment = segments.get(i);
            json.append("  {\n");
            json.append("    \"segment\": \"").append(escapeJson(segment.text)).append("\",\n");
            json.append("    \"startMs\": ").append(segment.startMs).append(",\n");
            json.append("    \"endMs\": ").append(segment.endMs).append(",\n");
            json.append("    \"confidence\": ").append(segment.confidence).append("\n");
            json.append("  }");
            
            if (i < segments.size() - 1) {
                json.append(",");
            }
            json.append("\n");
        }
        
        json.append("]");
        
        FileUtils.writeTextToFile(file, json.toString());
    }
    
    private String escapeJson(String text) {
        if (text == null) return "";
        return text.replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }
}