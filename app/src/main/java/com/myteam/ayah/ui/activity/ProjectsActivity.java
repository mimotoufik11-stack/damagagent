package com.myteam.ayah.ui.activity;

import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.myteam.ayah.R;
import com.myteam.ayah.ui.adapter.ProjectsAdapter;

public class ProjectsActivity extends AppCompatActivity {
    
    private RecyclerView projectsRecyclerView;
    private Button backButton;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_projects);
        
        initializeViews();
        setupRecyclerView();
    }
    
    private void initializeViews() {
        projectsRecyclerView = findViewById(R.id.rv_projects);
        backButton = findViewById(R.id.btn_back);
        
        backButton.setOnClickListener(v -> finish());
    }
    
    private void setupRecyclerView() {
        // TODO: Load projects from database
        ProjectsAdapter adapter = new ProjectsAdapter(this::onProjectSelected, this::onProjectDeleted);
        projectsRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        projectsRecyclerView.setAdapter(adapter);
    }
    
    private void onProjectSelected(long projectId) {
        // Open editor with selected project
        android.content.Intent intent = new android.content.Intent(this, EditorActivity.class);
        intent.putExtra("projectId", projectId);
        startActivity(intent);
    }
    
    private void onProjectDeleted(long projectId) {
        // TODO: Delete project from database
        Toast.makeText(this, "تم حذف المشروع", Toast.LENGTH_SHORT).show();
    }
}