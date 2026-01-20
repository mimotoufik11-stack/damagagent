package com.myteam.ayah.ui.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.SeekBar;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentManager;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.myteam.ayah.R;

public class TrimBottomSheet extends BottomSheetDialogFragment {
    
    private static final String ARG_SEGMENT_ID = "segment_id";
    private static final String ARG_START_MS = "start_ms";
    private static final String ARG_END_MS = "end_ms";
    
    private long segmentId;
    private long startMs;
    private long endMs;
    
    private SeekBar startSeekBar;
    private SeekBar endSeekBar;
    private TextView startTimeTextView;
    private TextView endTimeTextView;
    private TextView durationTextView;
    private Button saveButton;
    private Button cancelButton;
    
    private TrimListener listener;
    
    public interface TrimListener {
        void onTrimApplied(long segmentId, long newStartMs, long newEndMs);
    }
    
    public static TrimBottomSheet newInstance(long segmentId, long startMs, long endMs) {
        TrimBottomSheet fragment = new TrimBottomSheet();
        Bundle args = new Bundle();
        args.putLong(ARG_SEGMENT_ID, segmentId);
        args.putLong(ARG_START_MS, startMs);
        args.putLong(ARG_END_MS, endMs);
        fragment.setArguments(args);
        return fragment;
    }
    
    public void setTrimListener(TrimListener listener) {
        this.listener = listener;
    }
    
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            segmentId = getArguments().getLong(ARG_SEGMENT_ID);
            startMs = getArguments().getLong(ARG_START_MS);
            endMs = getArguments().getLong(ARG_END_MS);
        }
    }
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.bottom_sheet_trim, container, false);
    }
    
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        initializeViews(view);
        setupSeekBars();
        setupClickListeners();
        updateTimeDisplay();
    }
    
    private void initializeViews(View view) {
        startSeekBar = view.findViewById(R.id.seekbar_start);
        endSeekBar = view.findViewById(R.id.seekbar_end);
        startTimeTextView = view.findViewById(R.id.tv_start_time);
        endTimeTextView = view.findViewById(R.id.tv_end_time);
        durationTextView = view.findViewById(R.id.tv_duration);
        saveButton = view.findViewById(R.id.btn_save);
        cancelButton = view.findViewById(R.id.btn_cancel);
    }
    
    private void setupSeekBars() {
        long duration = endMs - startMs;
        
        // Setup start seekbar (0 to duration - 500ms)
        startSeekBar.setMax((int) (duration - 500));
        startSeekBar.setProgress(0);
        
        // Setup end seekbar (500ms to duration)
        endSeekBar.setMax((int) (duration - 500));
        endSeekBar.setProgress((int) (duration - 500));
        
        startSeekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                if (fromUser && progress < endSeekBar.getProgress()) {
                    updateTimeDisplay();
                }
            }
            
            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}
            
            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
                if (seekBar.getProgress() >= endSeekBar.getProgress()) {
                    seekBar.setProgress(endSeekBar.getProgress() - 500);
                }
            }
        });
        
        endSeekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                if (fromUser && progress > startSeekBar.getProgress()) {
                    updateTimeDisplay();
                }
            }
            
            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}
            
            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
                if (seekBar.getProgress() <= startSeekBar.getProgress()) {
                    seekBar.setProgress(startSeekBar.getProgress() + 500);
                }
            }
        });
    }
    
    private void setupClickListeners() {
        saveButton.setOnClickListener(v -> {
            long newStartMs = startMs + startSeekBar.getProgress();
            long newEndMs = endMs - (endSeekBar.getMax() - endSeekBar.getProgress());
            
            if (listener != null) {
                listener.onTrimApplied(segmentId, newStartMs, newEndMs);
            }
            dismiss();
        });
        
        cancelButton.setOnClickListener(v -> dismiss());
    }
    
    private void updateTimeDisplay() {
        long newStartMs = startMs + startSeekBar.getProgress();
        long newEndMs = endMs - (endSeekBar.getMax() - endSeekBar.getProgress());
        
        startTimeTextView.setText(formatTime(newStartMs));
        endTimeTextView.setText(formatTime(newEndMs));
        durationTextView.setText(formatDuration(newEndMs - newStartMs));
    }
    
    private String formatTime(long ms) {
        long seconds = ms / 1000;
        long minutes = seconds / 60;
        seconds = seconds % 60;
        return String.format("%02d:%02d", minutes, seconds);
    }
    
    private String formatDuration(long ms) {
        long seconds = ms / 1000;
        long minutes = seconds / 60;
        seconds = seconds % 60;
        return String.format("%02d:%02d", minutes, seconds);
    }
}