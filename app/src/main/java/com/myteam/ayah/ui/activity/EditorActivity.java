package com.myteam.ayah.ui.activity;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.media3.common.Player;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.ui.PlayerView;
import com.myteam.ayah.R;
import com.myteam.ayah.ui.adapter.TimelineSegmentAdapter;
import com.myteam.ayah.ui.widget.CaptionOverlayView;
import com.myteam.ayah.ui.widget.TimelineView;

public class EditorActivity extends AppCompatActivity {
    
    private PlayerView playerView;
    private ExoPlayer player;
    private CaptionOverlayView captionOverlay;
    private RecyclerView timelineRecyclerView;
    private TimelineView timelineView;
    
    private TimelineSegmentAdapter timelineAdapter;
    private long projectId;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_editor);
        
        projectId = getIntent().getLongExtra("projectId", -1);
        if (projectId == -1) {
            finish();
            return;
        }
        
        initializePlayer();
        initializeViews();
        setupTimeline();
    }
    
    private void initializePlayer() {
        player = new ExoPlayer.Builder(this).build();
        playerView.setPlayer(player);
        
        // Add listener for playback position updates
        player.addListener(new Player.Listener() {
            @Override
            public void onIsPlayingChanged(boolean isPlaying) {
                // Update play button state
            }
        });
    }
    
    private void initializeViews() {
        playerView = findViewById(R.id.player_view);
        captionOverlay = findViewById(R.id.caption_overlay);
        timelineRecyclerView = findViewById(R.id.rv_timeline);
        timelineView = findViewById(R.id.timeline_view);
        
        // Set up caption overlay
        captionOverlay.setPlayer(player);
    }
    
    private void setupTimeline() {
        timelineAdapter = new TimelineSegmentAdapter(this);
        timelineRecyclerView.setLayoutManager(
            new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        timelineRecyclerView.setAdapter(timelineAdapter);
        
        // Set up timeline view
        timelineView.setPlayer(player);
        timelineView.setCaptionOverlay(captionOverlay);
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_editor, menu);
        return true;
    }
    
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        
        if (id == R.id.action_export) {
            // Open ExportActivity
            return true;
        } else if (id == R.id.action_manual_add) {
            // Show manual add dialog
            showManualAddDialog();
            return true;
        } else if (id == R.id.action_review_matches) {
            // Show review matches dialog
            showReviewMatchesDialog();
            return true;
        }
        
        return super.onOptionsItemSelected(item);
    }
    
    private void showManualAddDialog() {
        // TODO: Implement manual add dialog
        Toast.makeText(this, "إضافة يدوية (قريباً)", Toast.LENGTH_SHORT).show();
    }
    
    private void showReviewMatchesDialog() {
        // TODO: Implement review matches dialog
        Toast.makeText(this, "مراجعة المطابقات (قريباً)", Toast.LENGTH_SHORT).show();
    }
    
    @Override
    protected void onStart() {
        super.onStart();
        if (player != null) {
            player.prepare();
        }
    }
    
    @Override
    protected void onStop() {
        super.onStop();
        if (player != null) {
            player.stop();
        }
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (player != null) {
            player.release();
        }
    }
}