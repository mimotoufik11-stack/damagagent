export const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const formatBitrate = (bitrate) => {
  if (!bitrate || bitrate === 0) return '0 kbps';
  
  const kbps = Math.round(bitrate / 1000);
  if (kbps > 1000) {
    return (kbps / 1000).toFixed(2) + ' Mbps';
  }
  return kbps + ' kbps';
};

export const parseTime = (timeString) => {
  const parts = timeString.split(':').map(Number);
  
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0];
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const hexToRgba = (hex, alpha = 1) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const rgbaToHex = (rgba) => {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (!match) return '#000000';
  
  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');
  
  return `#${r}${g}${b}`;
};

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const getFileName = (filepath) => {
  return filepath.split(/[\\/]/).pop();
};

export const isVideoFile = (filename) => {
  const ext = getFileExtension(filename).toLowerCase();
  return ['mp4', 'avi', 'mkv', 'mov', 'webm', 'flv', 'wmv'].includes(ext);
};

export const isAudioFile = (filename) => {
  const ext = getFileExtension(filename).toLowerCase();
  return ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'].includes(ext);
};

export const isImageFile = (filename) => {
  const ext = getFileExtension(filename).toLowerCase();
  return ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext);
};

export const calculateAspectRatio = (width, height) => {
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
};

export const getResolutionFromDimensions = (width, height) => {
  if (width === 3840 && height === 2160) return '4K';
  if (width === 2560 && height === 1440) return '2K';
  if (width === 1920 && height === 1080) return '1080p';
  if (width === 1280 && height === 720) return '720p';
  if (width === 854 && height === 480) return '480p';
  return `${width}x${height}`;
};

export const validateCaption = (caption) => {
  const errors = [];
  
  if (!caption.text || caption.text.trim() === '') {
    errors.push('النص مطلوب');
  }
  
  if (caption.startTime < 0) {
    errors.push('وقت البداية يجب أن يكون أكبر من أو يساوي 0');
  }
  
  if (caption.endTime <= caption.startTime) {
    errors.push('وقت النهاية يجب أن يكون أكبر من وقت البداية');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const sortCaptionsByTime = (captions) => {
  return [...captions].sort((a, b) => a.startTime - b.startTime);
};

export const detectCaptionOverlaps = (captions) => {
  const sorted = sortCaptionsByTime(captions);
  const overlaps = [];
  
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].endTime > sorted[i + 1].startTime) {
      overlaps.push({
        caption1: sorted[i],
        caption2: sorted[i + 1]
      });
    }
  }
  
  return overlaps;
};
