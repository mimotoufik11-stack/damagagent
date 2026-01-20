package com.myteam.ayah.service;

import android.content.Context;
import android.content.Intent;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.Environment;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.util.Log;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class SpeechRecognizerService {
    
    private static final String TAG = "SpeechRecognizerService";
    private static final int SAMPLE_RATE = 16000;
    private static final int CHANNEL_CONFIG = AudioFormat.CHANNEL_IN_MONO;
    private static final int AUDIO_FORMAT = AudioFormat.ENCODING_PCM_16BIT;
    
    private Context context;
    private SpeechRecognizer speechRecognizer;
    private AudioRecord audioRecord;
    private boolean isRecording = false;
    private Thread recordingThread;
    
    public SpeechRecognizerService(Context context) {
        this.context = context.getApplicationContext();
        initializeSpeechRecognizer();
    }
    
    private void initializeSpeechRecognizer() {
        if (SpeechRecognizer.isRecognitionAvailable(context)) {
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context);
            speechRecognizer.setRecognitionListener(new RecognitionListener() {
                @Override
                public void onReadyForSpeech(Bundle params) {
                    Log.d(TAG, "Ready for speech");
                }
                
                @Override
                public void onBeginningOfSpeech() {
                    Log.d(TAG, "Beginning of speech");
                }
                
                @Override
                public void onRmsChanged(float rmsdB) {
                    // RMS level changed
                }
                
                @Override
                public void onBufferReceived(byte[] buffer) {
                    // Audio buffer received
                }
                
                @Override
                public void onEndOfSpeech() {
                    Log.d(TAG, "End of speech");
                }
                
                @Override
                public void onError(int error) {
                    Log.e(TAG, "Speech recognition error: " + error);
                }
                
                @Override
                public void onResults(Bundle results) {
                    Log.d(TAG, "Speech recognition results");
                    // Handle final results
                }
                
                @Override
                public void onPartialResults(Bundle partialResults) {
                    Log.d(TAG, "Partial results received");
                    // Handle partial results
                }
                
                @Override
                public void onEvent(int eventType, Bundle params) {
                    // Handle events
                }
            });
        }
    }
    
    public List<AsrSegment> transcribeAudio(String audioFilePath, float confidenceThreshold) {
        List<AsrSegment> segments = new ArrayList<>();
        
        try {
            // For Android SpeechRecognizer, we need to process audio in real-time
            // This is a simplified implementation
            if (startRecording()) {
                // Simulate processing
                Thread.sleep(5000); // Simulate processing time
                stopRecording();
                
                // Create sample segments for testing
                segments.add(new AsrSegment("بسم الله الرحمن الرحيم", 0, 3000, 0.95f));
                segments.add(new AsrSegment("الحمد لله رب العالمين", 3000, 6000, 0.88f));
                segments.add(new AsrSegment("الرحمن الرحيم", 6000, 9000, 0.75f));
            }
        } catch (Exception e) {
            Log.e(TAG, "Error transcribing audio", e);
        }
        
        return segments;
    }
    
    private boolean startRecording() {
        try {
            int bufferSize = AudioRecord.getMinBufferSize(SAMPLE_RATE, CHANNEL_CONFIG, AUDIO_FORMAT);
            audioRecord = new AudioRecord(MediaRecorder.AudioSource.MIC, SAMPLE_RATE, 
                                        CHANNEL_CONFIG, AUDIO_FORMAT, bufferSize);
            
            if (audioRecord.getState() == AudioRecord.STATE_INITIALIZED) {
                audioRecord.startRecording();
                isRecording = true;
                
                recordingThread = new Thread(() -> {
                    writeAudioDataToFile();
                });
                recordingThread.start();
                
                return true;
            }
        } catch (Exception e) {
            Log.e(TAG, "Error starting recording", e);
        }
        
        return false;
    }
    
    private void stopRecording() {
        isRecording = false;
        
        if (audioRecord != null) {
            audioRecord.stop();
            audioRecord.release();
            audioRecord = null;
        }
        
        if (recordingThread != null) {
            try {
                recordingThread.join();
            } catch (InterruptedException e) {
                Log.e(TAG, "Error stopping recording thread", e);
            }
        }
        
        if (speechRecognizer != null) {
            speechRecognizer.destroy();
        }
    }
    
    private void writeAudioDataToFile() {
        String audioFileName = "temp_audio.wav";
        File audioFile = new File(context.getExternalFilesDir(Environment.DIRECTORY_MUSIC), audioFileName);
        
        try (FileOutputStream fos = new FileOutputStream(audioFile)) {
            int bufferSize = AudioRecord.getMinBufferSize(SAMPLE_RATE, CHANNEL_CONFIG, AUDIO_FORMAT);
            short[] audioBuffer = new short[bufferSize / 2];
            
            while (isRecording) {
                int result = audioRecord.read(audioBuffer, 0, audioBuffer.length);
                if (result > 0) {
                    // Write audio data to file
                    for (int i = 0; i < result; i++) {
                        fos.write(audioBuffer[i] & 0xFF);
                        fos.write((audioBuffer[i] >> 8) & 0xFF);
                    }
                }
            }
        } catch (IOException e) {
            Log.e(TAG, "Error writing audio data", e);
        }
    }
    
    public void startContinuousRecognition(String audioFilePath) {
        if (speechRecognizer == null) {
            return;
        }
        
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, 
                       RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "ar-SA"); // Arabic
        intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
        
        speechRecognizer.startListening(intent);
    }
    
    public void stopRecognition() {
        if (speechRecognizer != null) {
            speechRecognizer.stopListening();
        }
        stopRecording();
    }
    
    public static class AsrSegment {
        public String text;
        public long startMs;
        public long endMs;
        public float confidence;
        
        public AsrSegment() {}
        
        public AsrSegment(String text, long startMs, long endMs, float confidence) {
            this.text = text;
            this.startMs = startMs;
            this.endMs = endMs;
            this.confidence = confidence;
        }
    }
}