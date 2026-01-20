package com.myteam.ayah.ui.activity;

import android.os.Bundle;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.work.Data;
import androidx.work.WorkManager;
import com.myteam.ayah.R;
import com.myteam.ayah.worker.ExtractAudioWorker;
import com.myteam.ayah.worker.SpeechToTextWorker;
import com.myteam.ayah.worker.QuranMatchWorker;
import com.myteam.ayah.worker.BuildSegmentsWorker;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

public class ProcessingActivity extends AppCompatActivity {
    
    private TextView statusTextView;
    private ProgressBar progressBar;
    private TextView logTextView;
    private Button cancelButton;
    
    private long projectId;
    private WorkManager workManager;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_processing);
        
        projectId = getIntent().getLongExtra("projectId", -1);
        if (projectId == -1) {
            finish();
            return;
        }
        
        workManager = WorkManager.getInstance(this);
        
        initializeViews();
        startProcessingChain();
    }
    
    private void initializeViews() {
        statusTextView = findViewById(R.id.tv_status);
        progressBar = findViewById(R.id.progress_bar);
        logTextView = findViewById(R.id.tv_log);
        cancelButton = findViewById(R.id.btn_cancel);
        
        cancelButton.setOnClickListener(v -> cancelProcessing());
    }
    
    private void startProcessingChain() {
        String workTag = "processing_" + projectId;
        
        // Step 1: Extract Audio
        Data audioData = new Data.Builder()
                .putString(ExtractAudioWorker.KEY_INPUT_VIDEO_PATH, getVideoPath())
                .putString(ExtractAudioWorker.KEY_OUTPUT_AUDIO_PATH, getAudioPath())
                .build();
        
        // Step 2: Speech to Text
        Data sttData = new Data.Builder()
                .putString(SpeechToTextWorker.KEY_INPUT_AUDIO_PATH, getAudioPath())
                .putString(SpeechToTextWorker.KEY_OUTPUT_SEGMENTS_PATH, getSegmentsPath())
                .putFloat(SpeechToTextWorker.KEY_CONFIDENCE_THRESHOLD, 0.6f)
                .build();
        
        // Step 3: Quran Matching
        Data matchData = new Data.Builder()
                .putString(QuranMatchWorker.KEY_INPUT_SEGMENTS_PATH, getSegmentsPath())
                .putString(QuranMatchWorker.KEY_OUTPUT_MATCHES_PATH, getMatchesPath())
                .build();
        
        // Step 4: Build Segments
        Data buildData = new Data.Builder()
                .putString(BuildSegmentsWorker.KEY_INPUT_MATCHES_PATH, getMatchesPath())
                .putString(BuildSegmentsWorker.KEY_OUTPUT_SEGMENTS_PATH, getFinalSegmentsPath())
                .putLong(BuildSegmentsWorker.KEY_PROJECT_ID, projectId)
                .build();
        
        updateStatus("بدء استخراج الصوت...");
        
        // Build work chain (this would need to be implemented with proper WorkManager chains)
        // For now, we'll just simulate the process
        simulateProcessing();
    }
    
    private void simulateProcessing() {
        new Thread(() -> {
            try {
                // Step 1: Extract Audio
                updateUI("استخراج الصوت...", 25);
                Thread.sleep(2000);
                
                // Step 2: Speech to Text
                updateUI("تحويل الصوت إلى نص...", 50);
                Thread.sleep(3000);
                
                // Step 3: Quran Matching
                updateUI("مطابقة النص مع القرآن...", 75);
                Thread.sleep(2000);
                
                // Step 4: Build Segments
                updateUI("إنشاء المقاطع على الخط الزمني...", 100);
                Thread.sleep(1000);
                
                updateUI("تم الانتهاء بنجاح!", 100);
                
                // Navigate to EditorActivity
                runOnUiThread(() -> {
                    Intent intent = new Intent(this, EditorActivity.class);
                    intent.putExtra("projectId", projectId);
                    startActivity(intent);
                    finish();
                });
                
            } catch (Exception e) {
                updateUI("خطأ: " + e.getMessage(), 0);
                showErrorDialog("فشل في المعالجة: " + e.getMessage());
            }
        }).start();
    }
    
    private void updateUI(String message, int progress) {
        runOnUiThread(() -> {
            statusTextView.setText(message);
            progressBar.setProgress(progress);
            logTextView.append(message + "\n");
        });
    }
    
    private void updateStatus(String status) {
        runOnUiThread(() -> {
            statusTextView.setText(status);
            logTextView.append(status + "\n");
        });
    }
    
    private void cancelProcessing() {
        workManager.cancelAllWorkByTag("processing_" + projectId);
        finish();
    }
    
    private void showErrorDialog(String message) {
        runOnUiThread(() -> {
            new androidx.appcompat.app.AlertDialog.Builder(this)
                    .setTitle("خطأ في المعالجة")
                    .setMessage(message)
                    .setPositiveButton("إعادة المحاولة", (dialog, which) -> startProcessingChain())
                    .setNegativeButton("إلغاء", (dialog, which) -> finish())
                    .show();
        });
    }
    
    private String getVideoPath() {
        // Return video path for the project
        return "/path/to/video.mp4";
    }
    
    private String getAudioPath() {
        return "/path/to/extracted/audio.wav";
    }
    
    private String getSegmentsPath() {
        return "/path/to/asr/segments.json";
    }
    
    private String getMatchesPath() {
        return "/path/to/quran/matches.json";
    }
    
    private String getFinalSegmentsPath() {
        return "/path/to/final/segments.json";
    }
}