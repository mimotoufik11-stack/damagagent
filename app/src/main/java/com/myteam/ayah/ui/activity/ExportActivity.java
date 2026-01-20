package com.myteam.ayah.ui.activity;

import android.os.Bundle;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.myteam.ayah.R;
import com.myteam.ayah.domain.usecase.ExportVideoUseCase;

public class ExportActivity extends AppCompatActivity {
    
    private Button exportButton;
    private Button cancelButton;
    private ProgressBar progressBar;
    
    private long projectId;
    private ExportVideoUseCase exportUseCase;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_export);
        
        projectId = getIntent().getLongExtra("projectId", -1);
        if (projectId == -1) {
            finish();
            return;
        }
        
        exportUseCase = new ExportVideoUseCase(this);
        
        initializeViews();
        setupClickListeners();
    }
    
    private void initializeViews() {
        exportButton = findViewById(R.id.btn_export);
        cancelButton = findViewById(R.id.btn_cancel);
        progressBar = findViewById(R.id.progress_bar);
    }
    
    private void setupClickListeners() {
        exportButton.setOnClickListener(v -> startExport());
        cancelButton.setOnClickListener(v -> finish());
    }
    
    private void startExport() {
        exportButton.setEnabled(false);
        exportButton.setText("جاري التصدير...");
        progressBar.setProgress(0);
        
        // For now, show a placeholder dialog
        new androidx.appcompat.app.AlertDialog.Builder(this)
                .setTitle("تصدير تجريبي")
                .setMessage("سيتم إنشاء ملفات MP4 + SRT + JSON في مجلد التصدير")
                .setPositiveButton("موافق", (dialog, which) -> {
                    exportButton.setEnabled(true);
                    exportButton.setText("تصدير");
                    Toast.makeText(this, "تم التصدير بنجاح!", Toast.LENGTH_SHORT).show();
                    finish();
                })
                .show();
    }
}