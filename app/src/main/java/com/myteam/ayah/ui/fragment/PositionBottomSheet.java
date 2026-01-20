package com.myteam.ayah.ui.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.myteam.ayah.R;

public class PositionBottomSheet extends BottomSheetDialogFragment {
    
    private static final String ARG_SEGMENT_ID = "segment_id";
    
    private long segmentId;
    
    // Position controls
    private RadioGroup verticalPositionGroup;
    private RadioGroup horizontalAlignmentGroup;
    
    // Offset controls
    private Button offsetUpButton;
    private Button offsetDownButton;
    private Button offsetLeftButton;
    private Button offsetRightButton;
    private Button resetOffsetButton;
    
    // Buttons
    private Button saveButton;
    private Button cancelButton;
    
    private PositionListener listener;
    
    public interface PositionListener {
        void onPositionApplied(long segmentId, String verticalPosition, String horizontalAlignment, float offsetX, float offsetY);
    }
    
    public static class PositionSettings {
        public String verticalPosition = "bottom"; // "top", "center", "bottom"
        public String horizontalAlignment = "center"; // "start", "center", "end"
        public float offsetX = 0f;
        public float offsetY = 0f;
    }
    
    public static PositionBottomSheet newInstance(long segmentId) {
        PositionBottomSheet fragment = new PositionBottomSheet();
        Bundle args = new Bundle();
        args.putLong(ARG_SEGMENT_ID, segmentId);
        fragment.setArguments(args);
        return fragment;
    }
    
    public void setPositionListener(PositionListener listener) {
        this.listener = listener;
    }
    
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            segmentId = getArguments().getLong(ARG_SEGMENT_ID);
        }
    }
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.bottom_sheet_position, container, false);
    }
    
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        initializeViews(view);
        setupControls();
        setupClickListeners();
    }
    
    private void initializeViews(View view) {
        // Position controls
        verticalPositionGroup = view.findViewById(R.id.rg_vertical_position);
        horizontalAlignmentGroup = view.findViewById(R.id.rg_horizontal_alignment);
        
        // Offset controls
        offsetUpButton = view.findViewById(R.id.btn_offset_up);
        offsetDownButton = view.findViewById(R.id.btn_offset_down);
        offsetLeftButton = view.findViewById(R.id.btn_offset_left);
        offsetRightButton = view.findViewById(R.id.btn_offset_right);
        resetOffsetButton = view.findViewById(R.id.btn_reset_offset);
        
        // Buttons
        saveButton = view.findViewById(R.id.btn_save);
        cancelButton = view.findViewById(R.id.btn_cancel);
    }
    
    private void setupControls() {
        // Set default selections
        RadioButton bottomRadio = view.findViewById(R.id.rb_bottom);
        if (bottomRadio != null) bottomRadio.setChecked(true);
        
        RadioButton centerRadio = view.findViewById(R.id.rb_center);
        if (centerRadio != null) centerRadio.setChecked(true);
    }
    
    private void setupClickListeners() {
        // Offset buttons
        offsetUpButton.setOnClickListener(v -> adjustOffset(0, -10));
        offsetDownButton.setOnClickListener(v -> adjustOffset(0, 10));
        offsetLeftButton.setOnClickListener(v -> adjustOffset(-10, 0));
        offsetRightButton.setOnClickListener(v -> adjustOffset(10, 0));
        resetOffsetButton.setOnClickListener(v -> resetOffset());
        
        // Buttons
        saveButton.setOnClickListener(v -> {
            String verticalPosition = getSelectedVerticalPosition();
            String horizontalAlignment = getSelectedHorizontalAlignment();
            
            if (listener != null) {
                listener.onPositionApplied(segmentId, verticalPosition, horizontalAlignment, 0f, 0f);
            }
            dismiss();
        });
        
        cancelButton.setOnClickListener(v -> dismiss());
    }
    
    private String getSelectedVerticalPosition() {
        int selectedId = verticalPositionGroup.getCheckedRadioButtonId();
        if (selectedId == R.id.rb_top) return "top";
        if (selectedId == R.id.rb_center) return "center";
        return "bottom"; // default
    }
    
    private String getSelectedHorizontalAlignment() {
        int selectedId = horizontalAlignmentGroup.getCheckedRadioButtonId();
        if (selectedId == R.id.rb_start) return "start";
        if (selectedId == R.id.rb_end) return "end";
        return "center"; // default
    }
    
    private void adjustOffset(float deltaX, float deltaY) {
        // In a real implementation, you would maintain current offset values
        // and update UI to show the changes
    }
    
    private void resetOffset() {
        // Reset offset values to 0,0
        // In a real implementation, you would clear any offset displays
    }
}