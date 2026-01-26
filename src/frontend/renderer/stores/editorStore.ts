import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Track Types
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

export interface Clip {
  id: number;
  track_id: string;
  media_id?: number;
  name: string;
  start_time: number;
  duration: number;
  source_start: number;
  source_end: number;
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

export interface Effect {
  id: string;
  type: string;
  name: string;
  params: Record<string, any>;
  is_enabled: boolean;
}

export interface TimelineState {
  tracks: Track[];
  clips: Clip[];
  currentTime: number;
  duration: number;
  zoom: number;
  scrollPosition: number;
  selectedClipIds: number[];
  selectedTrackId: string | null;
  isPlaying: boolean;
  isRecording: boolean;
  playbackRate: number;
  snapEnabled: boolean;
  rippleEnabled: boolean;
  
  // Actions
  setTracks: (tracks: Track[]) => void;
  addTrack: (track: Track) => void;
  updateTrack: (id: string, data: Partial<Track>) => void;
  deleteTrack: (id: string) => void;
  
  setClips: (clips: Clip[]) => void;
  addClip: (clip: Clip) => void;
  updateClip: (id: number, data: Partial<Clip>) => void;
  deleteClip: (id: number) => void;
  moveClip: (id: number, startTime: number, targetTrackId?: string) => void;
  
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setZoom: (zoom: number) => void;
  setScrollPosition: (position: number) => void;
  
  selectClip: (id: number) => void;
  selectClips: (ids: number[]) => void;
  deselectClip: (id: number) => void;
  clearSelection: () => void;
  
  setSelectedTrack: (id: string | null) => void;
  
  setIsPlaying: (playing: boolean) => void;
  setIsRecording: (recording: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  
  toggleSnap: () => void;
  toggleRipple: () => void;
  
  resetTimeline: () => void;
}

const defaultTracks: Track[] = [
  { id: 'video_1', type: 'video', name: 'Video 1', index: 0, is_locked: false, is_hidden: false, is_muted: false, height: 60 },
  { id: 'video_2', type: 'video', name: 'Video 2', index: 1, is_locked: false, is_hidden: false, is_muted: false, height: 60 },
  { id: 'audio_1', type: 'audio', name: 'Audio 1', index: 0, is_locked: false, is_hidden: false, is_muted: false, height: 40 },
  { id: 'audio_2', type: 'audio', name: 'Audio 2', index: 1, is_locked: false, is_hidden: false, is_muted: false, height: 40 },
  { id: 'subtitle_1', type: 'subtitle', name: 'Subtitles', index: 0, is_locked: false, is_hidden: false, is_muted: false, height: 40 },
];

export const useEditorStore = create<TimelineState>()(
  persist(
    (set, get) => ({
      tracks: defaultTracks,
      clips: [],
      currentTime: 0,
      duration: 300,
      zoom: 1,
      scrollPosition: 0,
      selectedClipIds: [],
      selectedTrackId: null,
      isPlaying: false,
      isRecording: false,
      playbackRate: 1,
      snapEnabled: true,
      rippleEnabled: false,
      
      setTracks: (tracks) => set({ tracks }),
      
      addTrack: (track) => set((state) => ({
        tracks: [...state.tracks, track],
      })),
      
      updateTrack: (id, data) => set((state) => ({
        tracks: state.tracks.map((t) =>
          t.id === id ? { ...t, ...data } : t
        ),
      })),
      
      deleteTrack: (id) => set((state) => ({
        tracks: state.tracks.filter((t) => t.id !== id),
        clips: state.clips.filter((c) => c.track_id !== id),
      })),
      
      setClips: (clips) => set({ clips }),
      
      addClip: (clip) => set((state) => ({
        clips: [...state.clips, clip],
      })),
      
      updateClip: (id, data) => set((state) => ({
        clips: state.clips.map((c) =>
          c.id === id ? { ...c, ...data } : c
        ),
      })),
      
      deleteClip: (id) => set((state) => ({
        clips: state.clips.filter((c) => c.id !== id),
        selectedClipIds: state.selectedClipIds.filter((clipId) => clipId !== id),
      })),
      
      moveClip: (id, startTime, targetTrackId) => set((state) => {
        const clip = state.clips.find((c) => c.id === id);
        if (!clip) return state;
        
        return {
          clips: state.clips.map((c) =>
            c.id === id
              ? {
                  ...c,
                  start_time: startTime,
                  track_id: targetTrackId || c.track_id,
                }
              : c
          ),
        };
      }),
      
      setCurrentTime: (time) => set({ currentTime: Math.max(0, time) }),
      
      setDuration: (duration) => set({ duration }),
      
      setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(10, zoom)) }),
      
      setScrollPosition: (position) => set({ scrollPosition: position }),
      
      selectClip: (id) => set((state) => ({
        selectedClipIds: state.selectedClipIds.includes(id)
          ? state.selectedClipIds
          : [...state.selectedClipIds, id],
      })),
      
      selectClips: (ids) => set({ selectedClipIds: ids }),
      
      deselectClip: (id) => set((state) => ({
        selectedClipIds: state.selectedClipIds.filter((clipId) => clipId !== id),
      })),
      
      clearSelection: () => set({ selectedClipIds: [] }),
      
      setSelectedTrack: (id) => set({ selectedTrackId: id }),
      
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      
      setIsRecording: (recording) => set({ isRecording: recording }),
      
      setPlaybackRate: (rate) => set({ playbackRate: rate }),
      
      toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),
      
      toggleRipple: () => set((state) => ({ rippleEnabled: !state.rippleEnabled })),
      
      resetTimeline: () => set({
        tracks: defaultTracks,
        clips: [],
        currentTime: 0,
        duration: 300,
        selectedClipIds: [],
        selectedTrackId: null,
      }),
    }),
    {
      name: 'dammaj-timeline',
      partialize: (state) => ({
        snapEnabled: state.snapEnabled,
        rippleEnabled: state.rippleEnabled,
        zoom: state.zoom,
      }),
    }
  )
);
