package com.myteam.ayah.domain.model;

public class SegmentStyle {
    public String fontFamily;
    public float fontSize;
    public int textColor;
    public int backgroundColor;
    public boolean backgroundEnabled;
    public float opacity;
    public float cornerRadius;
    public boolean shadowEnabled;
    public int strokeColor;
    public float strokeWidth;
    public String verticalPosition; // "top", "center", "bottom"
    public String horizontalAlignment; // "start", "center", "end"
    public float offsetX;
    public float offsetY;
    
    public SegmentStyle() {
        // Default constructor
        this.fontFamily = "Cairo";
        this.fontSize = 18f;
        this.textColor = 0xFFFFFFFF;
        this.backgroundColor = 0x80000000;
        this.backgroundEnabled = true;
        this.opacity = 1.0f;
        this.cornerRadius = 8f;
        this.shadowEnabled = true;
        this.strokeColor = 0x00000000;
        this.strokeWidth = 0f;
        this.verticalPosition = "bottom";
        this.horizontalAlignment = "center";
        this.offsetX = 0f;
        this.offsetY = 0f;
    }
    
    public SegmentStyle(String fontFamily, float fontSize, int textColor, int backgroundColor,
                       boolean backgroundEnabled, float opacity, float cornerRadius,
                       boolean shadowEnabled, int strokeColor, float strokeWidth,
                       String verticalPosition, String horizontalAlignment, float offsetX, float offsetY) {
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.textColor = textColor;
        this.backgroundColor = backgroundColor;
        this.backgroundEnabled = backgroundEnabled;
        this.opacity = opacity;
        this.cornerRadius = cornerRadius;
        this.shadowEnabled = shadowEnabled;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.verticalPosition = verticalPosition;
        this.horizontalAlignment = horizontalAlignment;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
}