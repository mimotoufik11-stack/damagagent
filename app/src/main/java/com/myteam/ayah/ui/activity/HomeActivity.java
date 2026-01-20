package com.myteam.ayah.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.myteam.ayah.R;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class HomeActivity extends AppCompatActivity {
    
    private Button createProjectButton;
    private Button projectsButton;
    private RecyclerView recentProjectsRecyclerView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        
        initializeViews();
        setupRecyclerView();
        setupClickListeners();
    }
    
    private void initializeViews() {
        createProjectButton = findViewById(R.id.btn_create_project);
        projectsButton = findViewById(R.id.btn_projects);
        recentProjectsRecyclerView = findViewById(R.id.rv_recent_projects);
    }
    
    private void setupRecyclerView() {
        // TODO: Set up with real data from database
        List<String> recentProjects = new ArrayList<>();
        recentProjects.add("مشروع تجريبي 1");
        recentProjects.add("مشروع تجريبي 2");
        
        // Create adapter with placeholder data
        // ProjectsAdapter adapter = new ProjectsAdapter(recentProjects, this::onProjectSelected);
        // recentProjectsRecyclerView.setAdapter(adapter);
        recentProjectsRecyclerView.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
    }
    
    private void setupClickListeners() {
        createProjectButton.setOnClickListener(v -> {
            Intent intent = new Intent(this, ImportActivity.class);
            startActivity(intent);
        });
        
        projectsButton.setOnClickListener(v -> {
            Intent intent = new Intent(this, ProjectsActivity.class);
            startActivity(intent);
        });
    }
    
    private void onProjectSelected(String projectTitle) {
        // TODO: Open editor with selected project
    }
}