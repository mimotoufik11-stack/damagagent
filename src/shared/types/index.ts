/**
 * Dammaj Al-Quran - Global Type Definitions
 */

// Project Types
export interface ProjectResolution {
  width: number;
  height: number;
}

export interface ProjectSettings {
  resolution: ProjectResolution;
  fps: number;
  format: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  settings: ProjectSettings;
  duration: number;
  thumbnail_path?: string;
  is_saved: boolean;
  last_saved_at?: string;
  created_at: string;
  updated_at: string;
}

// Media Types
export type MediaType = 'video' | 'audio' | 'image' | 'font';

export interface MediaItem {
  id: number;
  project_id: number;
  name: string;
  file_path: string;
  file_size: number;
  media_type: MediaType;
  mime_type?: string;
  duration?: number;
  width?: number;
  height?: number;
  thumbnail_path?: string;
  created_at: string;
}

// Timeline Types
export type TrackType = 'video' | 'audio' | 'subtitle';

export interface Track {
  id: string;
  type: TrackType;
  name: string;
  index: number;
  is_locked: boolean;
  is_hidden: boolean;
  is_muted: boolean;
  height: number;
}

export interface Effect {
  id: string;
  type: string;
  name: string;
  params: Record<string, any>;
  is_enabled: boolean;
}

export interface Clip {
  id: number;
  project_id: number;
  media_id?: number;
  track_id: string;
  track_type: TrackType;
  track_index: number;
  start_time: number;
  duration: number;
  source_start: number;
  source_end: number;
  name: string;
  volume: number;
  opacity: number;
  speed: number;
  effects: Effect[];
  order_index: number;
  is_locked: boolean;
  is_hidden: boolean;
  is_muted: boolean;
  thumbnail_path?: string;
}

// Subtitle Types
export interface SubtitleStyle {
  font_name: string;
  font_size: number;
  font_color: string;
  background_color?: string;
  stroke_color: string;
  stroke_width: number;
  shadow_color: string;
  shadow_offset: number;
  opacity: number;
}

export interface SubtitlePosition {
  x: number;
  y: number;
  alignment: 'left' | 'center' | 'right';
}

export interface Subtitle {
  id: number;
  project_id: number;
  start_time: number;
  end_time: number;
  text: string;
  text_arabic?: string;
  style: SubtitleStyle;
  position: SubtitlePosition;
  quran?: {
    surah_number?: number;
    verse_number?: number;
    verse_text?: string;
  };
  order_index: number;
  is_locked: boolean;
  is_visible: boolean;
}

// Export Types
export type ExportFormat = 'mp4' | 'webm' | 'mov' | 'mp3';
export type ExportQuality = 'low' | 'medium' | 'high' | 'ultra';

export interface ExportSettings {
  format: ExportFormat;
  resolution: ProjectResolution;
  fps: number;
  quality: ExportQuality;
  bitrate?: string;
}

export interface ExportJob {
  id: number;
  project_id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  output_path?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

// AI Types
export type AIJobType = 'transcription' | 'dubbing' | 'noise_reduction' | 'subtitle_generation' | 'verse_recognition';
export type AIJobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface AIJob {
  id: number;
  project_id: number;
  job_type: AIJobType;
  status: AIJobStatus;
  progress: number;
  message?: string;
  error_message?: string;
  parameters: Record<string, any>;
  result_data?: Record<string, any>;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}

// Font Types
export interface Font {
  id: number;
  name: string;
  display_name: string;
  family?: string;
  style?: string;
  file_path: string;
  file_size: number;
  category: string;
  is_arabic: boolean;
  is_default: boolean;
  is_downloaded: boolean;
}

// Utility Types
export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TimeRange {
  start: number;
  end: number;
}

// Window Controls
export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
