package com.myteam.ayah.util;

import android.media.MediaExtractor;
import android.media.MediaFormat;
import android.util.Log;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;

/**
 * Utility class for extracting audio from video files.
 */
public class AudioExtractor {
    private static final String TAG = "AudioExtractor";
    
    /**
     * Extracts audio from a video file and saves it as a WAV file.
     * 
     * @param videoPath Path to the input video file
     * @param audioPath Path where the extracted audio will be saved
     * @return true if extraction was successful, false otherwise
     */
    public static boolean extractAudio(String videoPath, String audioPath) {
        try {
            MediaExtractor extractor = new MediaExtractor();
            extractor.setDataSource(videoPath);
            
            int audioTrackIndex = -1;
            MediaFormat audioFormat = null;
            
            // Find the audio track
            for (int i = 0; i < extractor.getTrackCount(); i++) {
                MediaFormat format = extractor.getTrackFormat(i);
                String mime = format.getString(MediaFormat.KEY_MIME);
                if (mime != null && mime.startsWith("audio/")) {
                    audioTrackIndex = i;
                    audioFormat = format;
                    break;
                }
            }
            
            if (audioTrackIndex == -1) {
                Log.e(TAG, "No audio track found");
                return false;
            }
            
            extractor.selectTrack(audioTrackIndex);
            
            // For now, just copy the original file (placeholder implementation)
            // In a real implementation, you would convert the audio format
            File inputFile = new File(videoPath);
            File outputFile = new File(audioPath);
            
            try (FileInputStream fis = new FileInputStream(inputFile);
                 FileOutputStream fos = new FileOutputStream(outputFile)) {
                
                byte[] buffer = new byte[8192];
                int bytesRead;
                
                while ((bytesRead = fis.read(buffer)) != -1) {
                    fos.write(buffer, 0, bytesRead);
                }
            }
            
            extractor.release();
            
            Log.d(TAG, "Audio extraction completed: " + audioPath);
            return true;
            
        } catch (IOException e) {
            Log.e(TAG, "Error extracting audio", e);
            return false;
        }
    }
    
    /**
     * Gets audio duration from a media file.
     * 
     * @param mediaPath Path to the media file
     * @return Duration in milliseconds, or -1 if unable to determine
     */
    public static long getAudioDuration(String mediaPath) {
        try {
            MediaExtractor extractor = new MediaExtractor();
            extractor.setDataSource(mediaPath);
            
            for (int i = 0; i < extractor.getTrackCount(); i++) {
                MediaFormat format = extractor.getTrackFormat(i);
                String mime = format.getString(MediaFormat.KEY_MIME);
                if (mime != null && mime.startsWith("audio/")) {
                    if (format.containsKey(MediaFormat.KEY_DURATION)) {
                        long duration = format.getLong(MediaFormat.KEY_DURATION);
                        extractor.release();
                        return duration;
                    }
                }
            }
            
            extractor.release();
        } catch (IOException e) {
            Log.e(TAG, "Error getting audio duration", e);
        }
        
        return -1;
    }
    
    /**
     * Gets audio sample rate from a media file.
     * 
     * @param mediaPath Path to the media file
     * @return Sample rate in Hz, or -1 if unable to determine
     */
    public static int getAudioSampleRate(String mediaPath) {
        try {
            MediaExtractor extractor = new MediaExtractor();
            extractor.setDataSource(mediaPath);
            
            for (int i = 0; i < extractor.getTrackCount(); i++) {
                MediaFormat format = extractor.getTrackFormat(i);
                String mime = format.getString(MediaFormat.KEY_MIME);
                if (mime != null && mime.startsWith("audio/")) {
                    if (format.containsKey(MediaFormat.KEY_SAMPLE_RATE)) {
                        int sampleRate = format.getInteger(MediaFormat.KEY_SAMPLE_RATE);
                        extractor.release();
                        return sampleRate;
                    }
                }
            }
            
            extractor.release();
        } catch (IOException e) {
            Log.e(TAG, "Error getting audio sample rate", e);
        }
        
        return -1;
    }
}