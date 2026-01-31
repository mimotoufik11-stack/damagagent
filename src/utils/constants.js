export const VIDEO_FORMATS = {
  MP4: 'mp4',
  AVI: 'avi',
  MKV: 'mkv',
  MOV: 'mov',
  WEBM: 'webm',
  FLV: 'flv',
  WMV: 'wmv'
};

export const RESOLUTIONS = {
  SD_480P: { width: 854, height: 480, label: '480p (SD)' },
  HD_720P: { width: 1280, height: 720, label: '720p (HD)' },
  FULL_HD_1080P: { width: 1920, height: 1080, label: '1080p (Full HD)' },
  QHD_1440P: { width: 2560, height: 1440, label: '1440p (2K)' },
  UHD_4K: { width: 3840, height: 2160, label: '2160p (4K)' }
};

export const ASPECT_RATIOS = {
  '16:9': { width: 16, height: 9, label: '16:9 (افتراضي)' },
  '4:3': { width: 4, height: 3, label: '4:3 (قديم)' },
  '1:1': { width: 1, height: 1, label: '1:1 (مربع)' },
  '9:16': { width: 9, height: 16, label: '9:16 (عمودي)' },
  '21:9': { width: 21, height: 9, label: '21:9 (سينمائي)' }
};

export const CODECS = {
  H264: { value: 'h264', label: 'H.264', ffmpegCodec: 'libx264' },
  H265: { value: 'h265', label: 'H.265 (HEVC)', ffmpegCodec: 'libx265' },
  VP9: { value: 'vp9', label: 'VP9', ffmpegCodec: 'libvpx-vp9' },
  MPEG4: { value: 'mpeg4', label: 'MPEG-4', ffmpegCodec: 'mpeg4' }
};

export const QUALITY_PRESETS = {
  LOW: { label: 'منخفضة', crf: 28, preset: 'fast' },
  MEDIUM: { label: 'متوسطة', crf: 23, preset: 'medium' },
  HIGH: { label: 'عالية', crf: 18, preset: 'slow' },
  BEST: { label: 'أفضل جودة', crf: 15, preset: 'veryslow' }
};

export const FRAME_RATES = [
  { value: 24, label: '24 FPS (سينمائي)' },
  { value: 30, label: '30 FPS (قياسي)' },
  { value: 60, label: '60 FPS (سلس)' },
  { value: 120, label: '120 FPS (بطيء جداً)' }
];

export const CAPTION_POSITIONS = {
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  TOP_RIGHT: 'top-right',
  MIDDLE_LEFT: 'middle-left',
  CENTER: 'center',
  MIDDLE_RIGHT: 'middle-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_RIGHT: 'bottom-right'
};

export const ARABIC_FONTS = [
  { value: 'Cairo', label: 'Cairo' },
  { value: 'Noto Sans Arabic', label: 'Noto Sans Arabic' },
  { value: 'Amiri Quran', label: 'Amiri Quran' },
  { value: 'Traditional Arabic', label: 'Traditional Arabic' },
  { value: 'Arial', label: 'Arial' }
];

export const DEFAULT_CAPTION_STYLE = {
  fontSize: 24,
  color: '#ffffff',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  fontFamily: 'Amiri Quran',
  bold: true,
  italic: false,
  shadow: true,
  position: CAPTION_POSITIONS.BOTTOM_CENTER
};

export const SUPPORTED_VIDEO_EXTENSIONS = [
  'mp4', 'avi', 'mkv', 'mov', 'webm', 'flv', 'wmv', 'm4v', 'mpg', 'mpeg'
];

export const SUPPORTED_AUDIO_EXTENSIONS = [
  'mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a', 'wma'
];

export const SUPPORTED_IMAGE_EXTENSIONS = [
  'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'
];
