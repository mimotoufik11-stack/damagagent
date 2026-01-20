package com.myteam.ayah.util;

import java.util.Locale;

/**
 * Utility class for formatting time values.
 */
public class TimeFormatter {
    
    /**
     * Formats milliseconds to MM:SS format.
     * 
     * @param milliseconds Time in milliseconds
     * @return Formatted time string (MM:SS)
     */
    public static String formatTime(long milliseconds) {
        long seconds = milliseconds / 1000;
        long minutes = seconds / 60;
        seconds = seconds % 60;
        
        return String.format(Locale.getDefault(), "%02d:%02d", minutes, seconds);
    }
    
    /**
     * Formats milliseconds to HH:MM:SS format.
     * 
     * @param milliseconds Time in milliseconds
     * @return Formatted time string (HH:MM:SS)
     */
    public static String formatTimeWithHours(long milliseconds) {
        long seconds = milliseconds / 1000;
        long minutes = seconds / 60;
        seconds = seconds % 60;
        long hours = minutes / 60;
        minutes = minutes % 60;
        
        return String.format(Locale.getDefault(), "%02d:%02d:%02d", hours, minutes, seconds);
    }
    
    /**
     * Formats milliseconds to SRT time format (HH:MM:SS,mmm).
     * 
     * @param milliseconds Time in milliseconds
     * @return Formatted SRT time string
     */
    public static String formatSrtTime(long milliseconds) {
        long seconds = milliseconds / 1000;
        long millis = milliseconds % 1000;
        long minutes = seconds / 60;
        seconds = seconds % 60;
        long hours = minutes / 60;
        minutes = minutes % 60;
        
        return String.format(Locale.getDefault(), "%02d:%02d:%02d,%03d",
                           hours, minutes, seconds, millis);
    }
    
    /**
     * Formats milliseconds to a readable duration format.
     * 
     * @param milliseconds Time in milliseconds
     * @return Human-readable duration (e.g., "2 min 30 sec")
     */
    public static String formatDuration(long milliseconds) {
        long seconds = milliseconds / 1000;
        long minutes = seconds / 60;
        seconds = seconds % 60;
        long hours = minutes / 60;
        minutes = minutes % 60;
        
        StringBuilder duration = new StringBuilder();
        
        if (hours > 0) {
            duration.append(hours).append(" س ");
        }
        
        if (minutes > 0) {
            duration.append(minutes).append(" د ");
        }
        
        if (seconds > 0 || duration.length() == 0) {
            duration.append(seconds).append(" ث ");
        }
        
        return duration.toString().trim();
    }
    
    /**
     * Parses time string in MM:SS format to milliseconds.
     * 
     * @param timeString Time string in MM:SS format
     * @return Time in milliseconds
     */
    public static long parseTime(String timeString) {
        try {
            String[] parts = timeString.split(":");
            if (parts.length == 2) {
                long minutes = Long.parseLong(parts[0]);
                long seconds = Long.parseLong(parts[1]);
                return (minutes * 60 + seconds) * 1000;
            }
        } catch (NumberFormatException e) {
            // Invalid format, return 0
        }
        return 0;
    }
}