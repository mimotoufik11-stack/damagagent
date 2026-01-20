package com.myteam.ayah.ui.fragment;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.SeekBar;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.myteam.ayah.R;

public class StyleBottomSheet extends BottomSheetDialogFragment {
    
    private static final String ARG_SEGMENT_ID = "segment_id";
    
    private long segmentId;
    
    // Font settings
    private TextView fontFamilyTextView;
    private TextView fontSizeTextView;
    private SeekBar fontSizeSeekBar;
    
    // Color settings
    private TextView textColorTextView;
    private TextView backgroundColorTextView;
    private View textColorPreview;
    private View backgroundColorPreview;
    
    // Style settings
    private TextView opacityTextView;
    private SeekBar opacitySeekBar;
    private TextView cornerRadiusTextView;
    private SeekBar cornerRadiusSeekBar;
    private TextView strokeWidthTextView;
    private SeekBar strokeWidthSeekBar;
    
    // Buttons
    private Button saveButton;
    private Button cancelButton;
    
    private StyleListener listener;
    
    public interface StyleListener {
        void onStyleApplied(long segmentId, SegmentStyle style);
    }
    
    public static class SegmentStyle {
        public String fontFamily = "Cairo";
        public float fontSize = 18f;
        public int textColor = Color.WHITE;
        public int backgroundColor = Color.argb(128, 0, 0, 0);
        public boolean backgroundEnabled = true;
        public float opacity = 1.0f;
        public float cornerRadius = 8f;
        public float strokeWidth = 0f;
        public int strokeColor = Color.TRANSPARENT;
    }
    
    public static StyleBottomSheet newInstance(long segmentId) {
        StyleBottomSheet fragment = new StyleBottomSheet();
        Bundle args = new Bundle();
        args.putLong(ARG_SEGMENT_ID, segmentId);
        fragment.setArguments(args);
        return fragment;
    }
    
    public void setStyleListener(StyleListener listener) {
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
        return inflater.inflate(R.layout.bottom_sheet_style, container, false);
    }
    
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        initializeViews(view);
        setupControls();
        setupClickListeners();
    }
    
    private void initializeViews(View view) {
        // Font controls
        fontFamilyTextView = view.findViewById(R.id.tv_font_family);
        fontSizeTextView = view.findViewById(R.id.tv_font_size);
        fontSizeSeekBar = view.findViewById(R.id.seekbar_font_size);
        
        // Color controls
        textColorTextView = view.findViewById(R.id.tv_text_color);
        backgroundColorTextView = view.findViewById(R.id.tv_background_color);
        textColorPreview = view.findViewById(R.id.v_text_color_preview);
        backgroundColorPreview = view.findViewById(R.id.v_background_color_preview);
        
        // Style controls
        opacityTextView = view.findViewById(R.id.tv_opacity);
        opacitySeekBar = view.findViewById(R.id.seekbar_opacity);
        cornerRadiusTextView = view.findViewById(R.id.tv_corner_radius);
        cornerRadiusSeekBar = view.findViewById(R.id.seekbar_corner_radius);
        strokeWidthTextView = view.findViewById(R.id.tv_stroke_width);
        strokeWidthSeekBar = view.findViewById(R.id.seekbar_stroke_width);
        
        // Buttons
        saveButton = view.findViewById(R.id.btn_save);
        cancelButton = view.findViewById(R.id.btn_cancel);
    }
    
    private void setupControls() {
        // Font size (12sp to 36sp)
        fontSizeSeekBar.setMax(24);
        fontSizeSeekBar.setProgress(6); // 18sp default
        fontSizeTextView.setText("18sp");
        
        fontSizeSeekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                if (fromUser) {
                    int fontSize = 12 + progress; // 12sp to 36sp
                    fontSizeTextView.setText(fontSize + "sp");
                }
            }
            
            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}
            
            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {}
        });
        
        // Opacity (0% to 100%)
        opacitySeekBar.setMax(100);
        opacitySeekBar.setProgress(100); // 100% default
        opacityTextView.setText("100%");
        
        opacitySeekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                if (fromUser) {
                    opacityTextView.setText(progress + "%");
                }
            }
            
            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}
            
            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {}
        });
        
        // Corner radius (0dp to 16dp)
        cornerRadiusSeekBar.setMax(16);
        cornerRadiusSeekBar.setProgress(8); // 8dp default
        cornerRadiusTextView.setText("8dp");
        
        cornerRadiusSeekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                if (fromUser) {
                    cornerRadiusTextView.setText(progress + "dp");
                }
            }
            
            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}
            
            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {}
        });
        
        // Stroke width (0dp to 4dp)
        strokeWidthSeekBar.setMax(4);
        strokeWidthSeekBar.setProgress(0); // 0dp default
        strokeWidthTextView.setText("0dp");
        
        strokeWidthSeekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                if (fromUser) {
                    strokeWidthTextView.setText(progress + "dp");
                }
            }
            
            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}
            
            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {}
        });
        
        // Set default colors
        textColorPreview.setBackgroundColor(Color.WHITE);
        backgroundColorPreview.setBackgroundColor(Color.argb(128, 0, 0, 0));
    }
    
    private void setupClickListeners() {
        // Font family selection
        fontFamilyTextView.setOnClickListener(v -> showFontFamilyDialog());
        
        // Color selection
        textColorTextView.setOnClickListener(v -> showColorPicker("text"));
        backgroundColorTextView.setOnClickListener(v -> showColorPicker("background"));
        
        // Buttons
        saveButton.setOnClickListener(v -> {
            SegmentStyle style = new SegmentStyle();
            style.fontSize = 12 + fontSizeSeekBar.getProgress();
            style.opacity = opacitySeekBar.getProgress() / 100f;
            style.cornerRadius = cornerRadiusSeekBar.getProgress();
            style.strokeWidth = strokeWidthSeekBar.getProgress();
            
            if (listener != null) {
                listener.onStyleApplied(segmentId, style);
            }
            dismiss();
        });
        
        cancelButton.setOnClickListener(v -> dismiss());
    }
    
    private void showFontFamilyDialog() {
        // Simple font family selection - in a real app, this would be more sophisticated
        android.app.AlertDialog.Builder builder = new android.app.AlertDialog.Builder(getActivity());
        builder.setTitle("اختيار الخط")
                .setItems(new String[]{"Cairo", "Amiri", "Roboto", "Times New Roman"}, (dialog, which) -> {
                    String[] fonts = {"Cairo", "Amiri", "Roboto", "Times New Roman"};
                    fontFamilyTextView.setText(fonts[which]);
                })
                .show();
    }
    
    private void showColorPicker(String type) {
        // Simple color picker - in a real app, this would use a proper color picker
        String[] colors = {"أبيض", "أسود", "ذهبي", "أزرق", "أحمر", "أخضر", "شفاف"};
        int[] colorValues = {Color.WHITE, Color.BLACK, Color.parseColor("#D4AF37"), 
                           Color.BLUE, Color.RED, Color.GREEN, Color.TRANSPARENT};
        
        android.app.AlertDialog.Builder builder = new android.app.AlertDialog.Builder(getActivity());
        builder.setTitle("اختيار لون " + (type.equals("text") ? "النص" : "الخلفية"))
                .setItems(colors, (dialog, which) -> {
                    int color = colorValues[which];
                    if (type.equals("text")) {
                        textColorPreview.setBackgroundColor(color);
                        textColorTextView.setText(colors[which]);
                    } else {
                        backgroundColorPreview.setBackgroundColor(color);
                        backgroundColorTextView.setText(colors[which]);
                    }
                })
                .show();
    }
}