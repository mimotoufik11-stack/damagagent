package com.myteam.ayah.ui.activity;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;
import com.myteam.ayah.R;
import com.myteam.ayah.domain.usecase.ImportVideoUseCase;
import java.io.File;

public class ImportActivity extends AppCompatActivity {
    
    private static final int PICK_VIDEO_REQUEST = 1;
    private static final int PICK_AUDIO_REQUEST = 2;
    
    private TextView dropZoneText;
    private Button browseVideoButton;
    private Button browseAudioButton;
    private Button importButton;
    private Button ratio16_9Button;
    private Button ratio1_1Button;
    private Button ratio9_16Button;
    
    private Uri videoUri;
    private Uri audioUri;
    private String selectedAspectRatio = "original";
    
    private ImportVideoUseCase importVideoUseCase;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_import);
        
        initializeViews();
        setupClickListeners();
        
        importVideoUseCase = new ImportVideoUseCase(this);
    }
    
    private void initializeViews() {
        dropZoneText = findViewById(R.id.tv_drop_zone);
        browseVideoButton = findViewById(R.id.btn_browse_video);
        browseAudioButton = findViewById(R.id.btn_browse_audio);
        importButton = findViewById(R.id.btn_import);
        ratio16_9Button = findViewById(R.id.btn_ratio_16_9);
        ratio1_1Button = findViewById(R.id.btn_ratio_1_1);
        ratio9_16Button = findViewById(R.id.btn_ratio_9_16);
        
        // Set initial aspect ratio button state
        ratio16_9Button.setSelected(true);
    }
    
    private void setupClickListeners() {
        browseVideoButton.setOnClickListener(v -> selectVideo());
        browseAudioButton.setOnClickListener(v -> selectAudio());
        
        importButton.setOnClickListener(v -> importProject());
        
        // Aspect ratio buttons
        ratio16_9Button.setOnClickListener(v -> selectAspectRatio("16:9", ratio16_9Button));
        ratio1_1Button.setOnClickListener(v -> selectAspectRatio("1:1", ratio1_1Button));
        ratio9_16Button.setOnClickListener(v -> selectAspectRatio("9:16", ratio9_16Button));
    }
    
    private void selectVideo() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("video/*");
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        startActivityForResult(intent, PICK_VIDEO_REQUEST);
    }
    
    private void selectAudio() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("audio/*");
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        startActivityForResult(intent, PICK_AUDIO_REQUEST);
    }
    
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        if (resultCode == RESULT_OK && data != null) {
            if (requestCode == PICK_VIDEO_REQUEST) {
                videoUri = data.getData();
                dropZoneText.setText("تم اختيار الفيديو: " + getFileName(videoUri));
            } else if (requestCode == PICK_AUDIO_REQUEST) {
                audioUri = data.getData();
                browseAudioButton.setText("تم اختيار الصوت: " + getFileName(audioUri));
            }
        }
    }
    
    private void selectAspectRatio(String ratio, Button button) {
        // Clear all button states
        ratio16_9Button.setSelected(false);
        ratio1_1Button.setSelected(false);
        ratio9_16Button.setSelected(false);
        
        // Set selected button state
        button.setSelected(true);
        selectedAspectRatio = ratio;
    }
    
    private void importProject() {
        if (videoUri == null) {
            Toast.makeText(this, "يرجى اختيار ملف فيديو", Toast.LENGTH_SHORT).show();
            return;
        }
        
        importButton.setEnabled(false);
        importButton.setText("جاري التحميل...");
        
        importVideoUseCase.importVideo(videoUri, "مشروع جديد", new ImportVideoUseCase.ImportVideoCallback() {
            @Override
            public void onSuccess(long projectId) {
                runOnUiThread(() -> {
                    Toast.makeText(ImportActivity.this, "تم تحميل المشروع بنجاح", Toast.LENGTH_SHORT).show();
                    
                    // Navigate to ProcessingActivity
                    Intent intent = new Intent(ImportActivity.this, ProcessingActivity.class);
                    intent.putExtra("projectId", projectId);
                    startActivity(intent);
                    finish();
                });
            }
            
            @Override
            public void onError(String message) {
                runOnUiThread(() -> {
                    importButton.setEnabled(true);
                    importButton.setText("استيراد");
                    Toast.makeText(ImportActivity.this, "خطأ في التحميل: " + message, Toast.LENGTH_SHORT).show();
                });
            }
        });
    }
    
    private String getFileName(Uri uri) {
        String[] projection = {android.provider.OpenableColumns.DISPLAY_NAME};
        android.database.Cursor cursor = getContentResolver().query(uri, projection, null, null, null);
        if (cursor != null) {
            int nameIndex = cursor.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME);
            cursor.moveToFirst();
            String name = cursor.getString(nameIndex);
            cursor.close();
            return name;
        }
        return "ملف غير معروف";
    }
}