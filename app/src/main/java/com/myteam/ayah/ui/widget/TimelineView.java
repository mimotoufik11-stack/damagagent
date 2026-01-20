package com.myteam.ayah.ui.widget;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import androidx.annotation.Nullable;
import androidx.media3.common.Player;
import androidx.media3.common.Timeline;
import com.myteam.ayah.domain.model.Segment;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class TimelineView extends View {
    
    private static final String TAG = "TimelineView";
    
    private Player player;
    private CaptionOverlayView captionOverlay;
    private List<Segment> segments;
    
    private Paint segmentPaint;
    private Paint playheadPaint;
    private Paint textPaint;
    private Paint backgroundPaint;
    
    private float segmentHeight = 60f;
    private float playheadWidth = 4f;
    private float margin = 20f;
    
    private long durationMs = 0;
    private float pixelsPerMs = 0f;
    
    private int selectedSegmentIndex = -1;
    
    public TimelineView(Context context) {
        super(context);
        init();
    }
    
    public TimelineView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }
    
    public TimelineView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }
    
    private void init() {
        // Initialize paints
        segmentPaint = new Paint();
        segmentPaint.setColor(Color.parseColor("#4CAF50"));
        segmentPaint.setStyle(Paint.Style.FILL);
        
        backgroundPaint = new Paint();
        backgroundPaint.setColor(Color.parseColor("#1A1F26"));
        backgroundPaint.setStyle(Paint.Style.FILL);
        
        playheadPaint = new Paint();
        playheadPaint.setColor(Color.parseColor("#D4AF37"));
        playheadPaint.setStyle(Paint.Style.FILL);
        
        textPaint = new Paint();
        textPaint.setColor(Color.WHITE);
        textPaint.setTextSize(14f);
        textPaint.setTypeface(Typeface.DEFAULT);
        
        setWillNotDraw(false);
    }
    
    public void setPlayer(Player player) {
        this.player = player;
        if (player != null) {
            // Update duration when player is set
            Timeline timeline = player.getCurrentTimeline();
            if (!timeline.isEmpty()) {
                Timeline.Window window = timeline.getWindow(0, new Timeline.Window());
                durationMs = window.getDurationMs();
            }
        }
        invalidate();
    }
    
    public void setCaptionOverlay(CaptionOverlayView captionOverlay) {
        this.captionOverlay = captionOverlay;
    }
    
    public void setSegments(List<Segment> segments) {
        this.segments = segments;
        invalidate();
    }
    
    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        
        if (durationMs > 0) {
            pixelsPerMs = (float) (w - 2 * margin) / (float) durationMs;
        }
    }
    
    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        
        if (segments == null || segments.isEmpty()) {
            drawEmptyState(canvas);
            return;
        }
        
        drawBackground(canvas);
        drawSegments(canvas);
        drawPlayhead(canvas);
        drawTimeMarkers(canvas);
    }
    
    private void drawEmptyState(Canvas canvas) {
        String message = "لا توجد كابتشن بعد. يمكنك إعادة التحليل أو إضافة آية يدويًا.";
        Paint emptyTextPaint = new Paint();
        emptyTextPaint.setColor(Color.GRAY);
        emptyTextPaint.setTextSize(16f);
        emptyTextPaint.setTextAlign(Paint.Align.CENTER);
        
        Rect bounds = new Rect();
        emptyTextPaint.getTextBounds(message, 0, message.length(), bounds);
        
        float x = getWidth() / 2f;
        float y = getHeight() / 2f;
        
        canvas.drawText(message, x, y, emptyTextPaint);
    }
    
    private void drawBackground(Canvas canvas) {
        canvas.drawRect(0, 0, getWidth(), getHeight(), backgroundPaint);
    }
    
    private void drawSegments(Canvas canvas) {
        if (segments == null) return;
        
        for (int i = 0; i < segments.size(); i++) {
            Segment segment = segments.get(i);
            drawSegment(canvas, segment, i);
        }
    }
    
    private void drawSegment(Canvas canvas, Segment segment, int index) {
        float startX = margin + (segment.startMs * pixelsPerMs);
        float endX = margin + (segment.endMs * pixelsPerMs);
        float segmentWidth = endX - startX;
        
        if (segmentWidth <= 0) return;
        
        float topY = margin;
        float bottomY = topY + segmentHeight;
        
        // Set segment color based on confidence
        Paint paint = new Paint(segmentPaint);
        if (segment.confidence < 0.6f) {
            paint.setColor(Color.parseColor("#F44336")); // Red for low confidence
        } else if (segment.confidence < 0.8f) {
            paint.setColor(Color.parseColor("#FF9800")); // Orange for medium confidence
        } else {
            paint.setColor(Color.parseColor("#4CAF50")); // Green for high confidence
        }
        
        // Draw segment rectangle
        Rect segmentRect = new Rect((int) startX, (int) topY, (int) endX, (int) bottomY);
        canvas.drawRect(segmentRect, paint);
        
        // Draw border for selected segment
        if (index == selectedSegmentIndex) {
            Paint borderPaint = new Paint();
            borderPaint.setColor(Color.WHITE);
            borderPaint.setStyle(Paint.Style.STROKE);
            borderPaint.setStrokeWidth(3f);
            canvas.drawRect(segmentRect, borderPaint);
        }
        
        // Draw segment text (truncated if too long)
        String text = segment.displayText != null ? segment.displayText : segment.segmentText;
        if (text != null && !text.isEmpty()) {
            Paint textPaint = new Paint(this.textPaint);
            textPaint.setColor(Color.WHITE);
            
            // Truncate text to fit
            float maxWidth = segmentWidth - 10f;
            String truncatedText = text;
            float textWidth = textPaint.measureText(truncatedText);
            
            if (textWidth > maxWidth) {
                while (truncatedText.length() > 0 && textPaint.measureText(truncatedText + "...") > maxWidth) {
                    truncatedText = truncatedText.substring(0, truncatedText.length() - 1);
                }
                truncatedText = truncatedText + "...";
            }
            
            float textX = startX + 5f;
            float textY = topY + segmentHeight / 2f + 5f;
            
            canvas.drawText(truncatedText, textX, textY, textPaint);
        }
    }
    
    private void drawPlayhead(Canvas canvas) {
        if (player == null || durationMs <= 0) return;
        
        long currentTimeMs = player.getCurrentPosition();
        float playheadX = margin + (currentTimeMs * pixelsPerMs);
        
        // Don't draw playhead outside the timeline
        if (playheadX < margin || playheadX > getWidth() - margin) {
            return;
        }
        
        float topY = 0;
        float bottomY = getHeight();
        
        Rect playheadRect = new Rect((int) playheadX, (int) topY, 
                                   (int) (playheadX + playheadWidth), (int) bottomY);
        canvas.drawRect(playheadRect, playheadPaint);
        
        // Update caption overlay
        if (captionOverlay != null) {
            captionOverlay.updateCaption(currentTimeMs);
        }
    }
    
    private void drawTimeMarkers(Canvas canvas) {
        if (durationMs <= 0) return;
        
        Paint markerPaint = new Paint();
        markerPaint.setColor(Color.GRAY);
        markerPaint.setTextSize(12f);
        
        // Draw time markers every 10 seconds
        long intervalMs = 10000; // 10 seconds
        long numIntervals = durationMs / intervalMs;
        
        for (int i = 0; i <= numIntervals; i++) {
            long timeMs = i * intervalMs;
            float x = margin + (timeMs * pixelsPerMs);
            
            // Draw marker line
            canvas.drawLine(x, getHeight() - 20, x, getHeight(), markerPaint);
            
            // Draw time text
            String timeText = formatTime(timeMs);
            canvas.drawText(timeText, x - 10, getHeight() - 5, markerPaint);
        }
    }
    
    private String formatTime(long milliseconds) {
        long seconds = milliseconds / 1000;
        long minutes = seconds / 60;
        seconds = seconds % 60;
        long hours = minutes / 60;
        minutes = minutes % 60;
        
        if (hours > 0) {
            return String.format(Locale.getDefault(), "%02d:%02d:%02d", hours, minutes, seconds);
        } else {
            return String.format(Locale.getDefault(), "%02d:%02d", minutes, seconds);
        }
    }
    
    public void setSelectedSegment(int index) {
        this.selectedSegmentIndex = index;
        invalidate();
    }
    
    public Segment getSegmentAtPosition(float x, float y) {
        if (segments == null) return null;
        
        float adjustedX = x - margin;
        for (Segment segment : segments) {
            float startX = segment.startMs * pixelsPerMs;
            float endX = segment.endMs * pixelsPerMs;
            
            if (adjustedX >= startX && adjustedX <= endX && 
                y >= margin && y <= margin + segmentHeight) {
                return segment;
            }
        }
        
        return null;
    }
}