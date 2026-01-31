import { ffmpegService } from './ffmpegService';

class VideoService {
  async getVideoMetadata(videoPath) {
    return await ffmpegService.getVideoMetadata(videoPath);
  }

  async exportVideo({ inputPath, captions, exportSettings, onProgress }) {
    const { outputPath, format, resolution, quality, codec, fps } = exportSettings;
    
    try {
      // Parse resolution
      const [width, height] = resolution.split('x').map(Number);
      
      // Build FFmpeg arguments
      const args = ['-i', inputPath];
      
      // Video filters
      const filters = [];
      
      // Resolution
      if (width && height) {
        filters.push(`scale=${width}:${height}`);
      }
      
      // Add captions if any
      if (captions && captions.length > 0) {
        const srtContent = ffmpegService.generateSRT(captions);
        const srtPath = outputPath.replace(/\.[^.]+$/, '_temp.srt');
        await window.electronAPI.writeFile(srtPath, srtContent);
        
        // Apply captions with custom styling
        const captionStyle = this.buildCaptionStyle(captions[0]);
        filters.push(`subtitles=${srtPath}:${captionStyle}`);
      }
      
      if (filters.length > 0) {
        args.push('-vf', filters.join(','));
      }
      
      // Frame rate
      if (fps) {
        args.push('-r', fps.toString());
      }
      
      // Codec
      args.push('-c:v', this.getVideoCodec(codec));
      args.push('-c:a', 'aac');
      
      // Quality
      args.push(...this.getQualityArgs(quality, codec));
      
      // Output
      args.push('-y', outputPath);
      
      // Execute
      const result = await ffmpegService.executeFFmpeg(args, onProgress);
      
      if (result.success) {
        return outputPath;
      } else {
        throw new Error('فشل في تصدير الفيديو');
      }
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  buildCaptionStyle(caption) {
    const styles = [];
    
    if (caption.fontSize) {
      styles.push(`FontSize=${caption.fontSize}`);
    }
    
    if (caption.color) {
      const color = caption.color.replace('#', '&H').toUpperCase();
      styles.push(`PrimaryColour=${color}`);
    }
    
    if (caption.bold) {
      styles.push('Bold=1');
    }
    
    if (caption.italic) {
      styles.push('Italic=1');
    }
    
    return styles.join(':');
  }

  getVideoCodec(codec) {
    const codecs = {
      'h264': 'libx264',
      'h265': 'libx265',
      'vp9': 'libvpx-vp9',
      'mpeg4': 'mpeg4'
    };
    return codecs[codec] || 'libx264';
  }

  getQualityArgs(quality, codec) {
    const args = [];
    
    switch (quality) {
      case 'low':
        args.push('-crf', '28', '-preset', 'fast');
        break;
      case 'medium':
        args.push('-crf', '23', '-preset', 'medium');
        break;
      case 'high':
        args.push('-crf', '18', '-preset', 'slow');
        break;
      case 'best':
        args.push('-crf', '15', '-preset', 'veryslow');
        break;
      default:
        args.push('-crf', '18', '-preset', 'medium');
    }
    
    return args;
  }

  async applyTool(videoPath, tool, settings, onProgress) {
    const tempPath = videoPath.replace(/\.[^.]+$/, '_temp.mp4');
    
    switch (tool) {
      case 'trim':
        return await ffmpegService.trimVideo(
          videoPath,
          tempPath,
          settings.startTime,
          settings.endTime,
          onProgress
        );
        
      case 'crop':
        return await ffmpegService.cropVideo(
          videoPath,
          tempPath,
          settings.x,
          settings.y,
          settings.width,
          settings.height,
          onProgress
        );
        
      case 'resolution':
        return await ffmpegService.changeResolution(
          videoPath,
          tempPath,
          settings.width,
          settings.height,
          onProgress
        );
        
      case 'fps':
        return await ffmpegService.changeFps(
          videoPath,
          tempPath,
          settings.fps,
          onProgress
        );
        
      case 'volume':
        return await ffmpegService.adjustVolume(
          videoPath,
          tempPath,
          settings.volume,
          onProgress
        );
        
      default:
        throw new Error('أداة غير مدعومة');
    }
  }

  async applyEffect(videoPath, effect, settings, onProgress) {
    const tempPath = videoPath.replace(/\.[^.]+$/, '_temp.mp4');
    
    switch (effect) {
      case 'brightness':
        return await ffmpegService.applyBrightness(
          videoPath,
          tempPath,
          settings.brightness,
          onProgress
        );
        
      case 'contrast':
        return await ffmpegService.applyContrast(
          videoPath,
          tempPath,
          settings.contrast,
          onProgress
        );
        
      case 'saturation':
        return await ffmpegService.applySaturation(
          videoPath,
          tempPath,
          settings.saturation,
          onProgress
        );
        
      default:
        throw new Error('تأثير غير مدعوم');
    }
  }
}

export const videoService = new VideoService();
