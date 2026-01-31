class FFmpegService {
  constructor() {
    this.ffmpegPath = null;
    this.ffprobePath = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      this.ffmpegPath = await window.electronAPI.getFFmpegPath();
      this.ffprobePath = await window.electronAPI.getFFprobePath();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize FFmpeg:', error);
      throw new Error('فشل في تهيئة FFmpeg');
    }
  }

  async getVideoMetadata(videoPath) {
    await this.initialize();

    try {
      const result = await window.electronAPI.executeFFprobe(videoPath);
      if (!result.success) {
        throw new Error(result.error);
      }

      const { metadata } = result;
      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      const audioStream = metadata.streams.find(s => s.codec_type === 'audio');

      return {
        duration: parseFloat(metadata.format.duration) || 0,
        size: parseInt(metadata.format.size) || 0,
        bitrate: parseInt(metadata.format.bit_rate) || 0,
        width: videoStream?.width || 0,
        height: videoStream?.height || 0,
        fps: this.parseFps(videoStream?.r_frame_rate) || 0,
        videoCodec: videoStream?.codec_name || 'unknown',
        audioCodec: audioStream?.codec_name || 'unknown',
        hasAudio: !!audioStream
      };
    } catch (error) {
      console.error('Failed to get video metadata:', error);
      throw error;
    }
  }

  parseFps(fpsString) {
    if (!fpsString) return 0;
    const parts = fpsString.split('/');
    if (parts.length === 2) {
      return Math.round(parseInt(parts[0]) / parseInt(parts[1]));
    }
    return parseInt(fpsString);
  }

  async trimVideo(inputPath, outputPath, startTime, endTime, onProgress) {
    await this.initialize();

    const args = [
      '-i', inputPath,
      '-ss', startTime.toString(),
      '-to', endTime.toString(),
      '-c', 'copy',
      '-y',
      outputPath
    ];

    return await this.executeFFmpeg(args, onProgress);
  }

  async cropVideo(inputPath, outputPath, x, y, width, height, onProgress) {
    await this.initialize();

    const args = [
      '-i', inputPath,
      '-filter:v', `crop=${width}:${height}:${x}:${y}`,
      '-c:a', 'copy',
      '-y',
      outputPath
    ];

    return await this.executeFFmpeg(args, onProgress);
  }

  async changeResolution(inputPath, outputPath, width, height, onProgress) {
    await this.initialize();

    const args = [
      '-i', inputPath,
      '-vf', `scale=${width}:${height}`,
      '-c:a', 'copy',
      '-y',
      outputPath
    ];

    return await this.executeFFmpeg(args, onProgress);
  }

  async changeFps(inputPath, outputPath, fps, onProgress) {
    await this.initialize();

    const args = [
      '-i', inputPath,
      '-r', fps.toString(),
      '-y',
      outputPath
    ];

    return await this.executeFFmpeg(args, onProgress);
  }

  async adjustVolume(inputPath, outputPath, volume, onProgress) {
    await this.initialize();

    const volumeValue = volume / 100;
    const args = [
      '-i', inputPath,
      '-af', `volume=${volumeValue}`,
      '-c:v', 'copy',
      '-y',
      outputPath
    ];

    return await this.executeFFmpeg(args, onProgress);
  }

  async addCaptions(inputPath, outputPath, captions, onProgress) {
    await this.initialize();

    // Create SRT file
    const srtContent = this.generateSRT(captions);
    const srtPath = outputPath.replace(/\.[^.]+$/, '.srt');
    
    await window.electronAPI.writeFile(srtPath, srtContent);

    const args = [
      '-i', inputPath,
      '-vf', `subtitles=${srtPath}`,
      '-c:a', 'copy',
      '-y',
      outputPath
    ];

    return await this.executeFFmpeg(args, onProgress);
  }

  generateSRT(captions) {
    return captions.map((caption, index) => {
      const startTime = this.formatSRTTime(caption.startTime);
      const endTime = this.formatSRTTime(caption.endTime);
      return `${index + 1}\n${startTime} --> ${endTime}\n${caption.text}\n\n`;
    }).join('');
  }

  formatSRTTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  }

  async applyBrightness(inputPath, outputPath, brightness, onProgress) {
    await this.initialize();

    const brightnessValue = brightness / 100;
    const args = [
      '-i', inputPath,
      '-vf', `eq=brightness=${brightnessValue}`,
      '-c:a', 'copy',
      '-y',
      outputPath
    ];

    return await this.executeFFmpeg(args, onProgress);
  }

  async applyContrast(inputPath, outputPath, contrast, onProgress) {
    await this.initialize();

    const args = [
      '-i', inputPath,
      '-vf', `eq=contrast=${contrast}`,
      '-c:a', 'copy',
      '-y',
      outputPath
    ];

    return await this.executeFFmpeg(args, onProgress);
  }

  async applySaturation(inputPath, outputPath, saturation, onProgress) {
    await this.initialize();

    const args = [
      '-i', inputPath,
      '-vf', `eq=saturation=${saturation}`,
      '-c:a', 'copy',
      '-y',
      outputPath
    ];

    return await this.executeFFmpeg(args, onProgress);
  }

  async executeFFmpeg(args, onProgress) {
    try {
      if (onProgress) {
        window.electronAPI.onFFmpegProgress((data) => {
          const match = data.match(/time=(\d+):(\d+):(\d+\.\d+)/);
          if (match) {
            const hours = parseInt(match[1]);
            const minutes = parseInt(match[2]);
            const seconds = parseFloat(match[3]);
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            onProgress(totalSeconds);
          }
        });
      }

      const result = await window.electronAPI.executeFFmpeg(args);
      
      if (onProgress) {
        window.electronAPI.removeFFmpegProgressListener();
      }

      return result;
    } catch (error) {
      console.error('FFmpeg execution failed:', error);
      throw error;
    }
  }
}

export const ffmpegService = new FFmpegService();
