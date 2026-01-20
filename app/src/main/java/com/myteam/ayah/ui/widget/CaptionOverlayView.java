package com.myteam.ayah.ui.widget;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.util.AttributeSet;
import android.view.Gravity;
import android.view.View;
import androidx.annotation.Nullable;
import androidx.media3.common.Player;
import com.myteam.ayah.domain.model.Segment;
import java.util.List;

public class CaptionOverlayView extends View {
    
    private Player player;
    private List<Segment> segments;
    
    private Paint textPaint;
    private Paint backgroundPaint;
    
    private String fontFamily = "Cairo";
    private float fontSize = 18f;
    private int textColor = Color.WHITE;
    private int backgroundColor = Color.argb(128, 0, 0, 0);
    private boolean backgroundEnabled = true;
    private float opacity = 1.0f;
    private float cornerRadius = 8f;
    private boolean shadowEnabled = true;
    private int strokeColor = Color.TRANSPARENT;
    private float strokeWidth = 0f;
    
    private String verticalPosition = "bottom"; // "top", "center", "bottom"
    private String horizontalAlignment = "center"; // "start", "center", "end"
    private float offsetX = 0f;
    private float offsetY = 0f;
    
    public CaptionOverlayView(Context context) {
        super(context);
        init();
    }
    
    public CaptionOverlayView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }
    
    public CaptionOverlayView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }
    
    private void init() {
        // Initialize paints
        textPaint = new Paint();
        textPaint.setColor(textColor);
        textPaint.setTextSize(fontSize);
        textPaint.setTypeface(Typeface.DEFAULT);
        textPaint.setAntiAlias(true);
        
        backgroundPaint = new Paint();
        backgroundPaint.setColor(backgroundColor);
        backgroundPaint.setAntiAlias(true);
        
        setWillNotDraw(false);
    }
    
    public void setPlayer(Player player) {
        this.player = player;
        invalidate();
    }
    
    public void setSegments(List<Segment> segments) {
        this.segments = segments;
        invalidate();
    }
    
    public void updateCaption(long currentTimeMs) {
        // Find the current segment
        if (segments == null || segments.isEmpty()) {
            setVisibility(View.GONE);
            return;
        }
        
        Segment currentSegment = null;
        for (Segment segment : segments) {
            if (currentTimeMs >= segment.startMs && currentTimeMs <= segment.endMs) {
                currentSegment = segment;
                break;
            }
        }
        
        if (currentSegment != null) {
            setVisibility(View.VISIBLE);
            setTag(currentSegment);
            invalidate();
        } else {
            setVisibility(View.GONE);
        }
    }
    
    @Override
    protected void onDraw(android.graphics.Canvas canvas) {
        super.onDraw(canvas);
        
        if (segments == null || segments.isEmpty() || getVisibility() != View.VISIBLE) {
            return;
        }
        
        Segment segment = (Segment) getTag();
        if (segment == null) {
            return;
        }
        
        String captionText = segment.displayText != null ? segment.displayText : segment.segmentText;
        if (captionText == null || captionText.isEmpty()) {
            return;
        }
        
        // Calculate position
        float x = calculateX();
        float y = calculateY();
        
        // Apply shadow if enabled
        if (shadowEnabled) {
            textPaint.setShadowLayer(3f, 2f, 2f, Color.BLACK);
        } else {
            textPaint.clearShadowLayer();
        }
        
        // Set text properties
        textPaint.setColor(textColor);
        textPaint.setAlpha((int) (255 * opacity));
        textPaint.setTextSize(fontSize);
        
        // Draw background if enabled
        if (backgroundEnabled) {
            drawBackground(canvas, captionText, x, y);
        }
        
        // Draw text
        Paint.Align align = getTextAlign();
        textPaint.setTextAlign(align);
        canvas.drawText(captionText, x, y, textPaint);
    }
    
    private void drawBackground(android.graphics.Canvas canvas, String text, float x, float y) {
        // Calculate text bounds
        Paint textBoundsPaint = new Paint(textPaint);
        Rect textBounds = new Rect();
        textBoundsPaint.getTextBounds(text, 0, text.length(), textBounds);
        
        // Add padding
        float padding = 10f;
        float left = x - padding;
        float right = x + textBounds.width() + padding;
        float top = y - textBounds.height() - padding;
        float bottom = y + padding;
        
        // Adjust for text alignment
        if (horizontalAlignment.equals("center")) {
            left -= textBounds.width() / 2f;
            right -= textBounds.width() / 2f;
        } else if (horizontalAlignment.equals("end")) {
            left -= textBounds.width();
            right -= textBounds.width();
        }
        
        // Create rounded rectangle background
        android.graphics.RectF rectF = new android.graphics.RectF(left, top, right, bottom);
        backgroundPaint.setColor(Color.argb(
            (int) (Color.alpha(backgroundColor) * opacity), 
            Color.red(backgroundColor), 
            Color.green(backgroundColor), 
            Color.blue(backgroundColor)
        ));
        
        // Draw rounded rectangle (simplified - real implementation would use Path for proper rounded corners)
        canvas.drawRect(rectF, backgroundPaint);
        
        // Draw stroke if enabled
        if (strokeWidth > 0) {
            Paint strokePaint = new Paint();
            strokePaint.setColor(strokeColor);
            strokePaint.setStyle(Paint.Style.STROKE);
            strokePaint.setStrokeWidth(strokeWidth);
            strokePaint.setAlpha((int) (255 * opacity));
            canvas.drawRect(rectF, strokePaint);
        }
    }
    
    private float calculateX() {
        float width = getWidth();
        float x;
        
        switch (horizontalAlignment) {
            case "start":
                x = 20f + offsetX;
                break;
            case "end":
                x = width - 20f + offsetX;
                break;
            case "center":
            default:
                x = width / 2f + offsetX;
                break;
        }
        
        return x;
    }
    
    private float calculateY() {
        float height = getHeight();
        float y;
        
        switch (verticalPosition) {
            case "top":
                y = 80f + offsetY;
                break;
            case "center":
                y = height / 2f + offsetY;
                break;
            case "bottom":
            default:
                y = height - 80f + offsetY;
                break;
        }
        
        return y;
    }
    
    private Paint.Align getTextAlign() {
        switch (horizontalAlignment) {
            case "start":
                return Paint.Align.LEFT;
            case "end":
                return Paint.Align.RIGHT;
            case "center":
            default:
                return Paint.Align.CENTER;
        }
    }
    
    // Style setters
    public void setFontFamily(String fontFamily) {
        this.fontFamily = fontFamily;
        // In a real app, you'd load the font here
        textPaint.setTypeface(Typeface.DEFAULT);
        invalidate();
    }
    
    public void setFontSize(float fontSize) {
        this.fontSize = fontSize;
        invalidate();
    }
    
    public void setTextColor(int textColor) {
        this.textColor = textColor;
        invalidate();
    }
    
    public void setBackgroundColor(int backgroundColor) {
        this.backgroundColor = backgroundColor;
        invalidate();
    }
    
    public void setBackgroundEnabled(boolean backgroundEnabled) {
        this.backgroundEnabled = backgroundEnabled;
        invalidate();
    }
    
    public void setOpacity(float opacity) {
        this.opacity = Math.max(0f, Math.min(1f, opacity));
        invalidate();
    }
    
    public void setCornerRadius(float cornerRadius) {
        this.cornerRadius = cornerRadius;
        invalidate();
    }
    
    public void setShadowEnabled(boolean shadowEnabled) {
        this.shadowEnabled = shadowEnabled;
        invalidate();
    }
    
    public void setStrokeColor(int strokeColor) {
        this.strokeColor = strokeColor;
        invalidate();
    }
    
    public void setStrokeWidth(float strokeWidth) {
        this.strokeWidth = strokeWidth;
        invalidate();
    }
    
    public void setVerticalPosition(String verticalPosition) {
        this.verticalPosition = verticalPosition;
        invalidate();
    }
    
    public void setHorizontalAlignment(String horizontalAlignment) {
        this.horizontalAlignment = horizontalAlignment;
        invalidate();
    }
    
    public void setOffsetX(float offsetX) {
        this.offsetX = offsetX;
        invalidate();
    }
    
    public void setOffsetY(float offsetY) {
        this.offsetY = offsetY;
        invalidate();
    }
}