# Workers Directory

This directory contains worker scripts for heavy processing tasks.

## Purpose

Workers are used to perform CPU-intensive operations in the background without blocking the main UI thread.

## Files

- `ffmpeg-worker.js` - FFmpeg processing worker
- `whisper-worker.js` - Whisper transcription worker
- `video-processor.js` - Video processing utilities

## Usage

Workers are automatically loaded and managed by the service layer.

## Note

In the current implementation, these workers are not fully utilized as the processing is handled directly through the Electron main process for better FFmpeg integration.

Future versions may implement true Web Workers for improved performance.
