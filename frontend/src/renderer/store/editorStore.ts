import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface EditorState {
  // Timeline state
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  zoom: number;
  selectedClips: string[];
  selectedTracks: string[];
  
  // View state
  showWaveform: boolean;
  snapToGrid: boolean;
  showSafeArea: boolean;
  showGrid: boolean;
  
  // Playback state
  playbackSpeed: number;
  isLooping: boolean;
  volume: number;
  muted: boolean;
  
  // Tool state
  activeTool: string;
  brushSize: number;
  
  // Effects state
  activeEffects: any[];
}

interface EditorActions {
  // Timeline actions
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setZoom: (zoom: number) => void;
  setSelectedClips: (clipIds: string[]) => void;
  addSelectedClip: (clipId: string) => void;
  removeSelectedClip: (clipId: string) => void;
  clearSelectedClips: () => void;
  
  // View actions
  toggleWaveform: () => void;
  toggleSnapToGrid: () => void;
  toggleSafeArea: () => void;
  toggleGrid: () => void;
  
  // Playback actions
  setPlaybackSpeed: (speed: number) => void;
  toggleLoop: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  
  // Tool actions
  setActiveTool: (tool: string) => void;
  setBrushSize: (size: number) => void;
  
  // Effects actions
  setActiveEffects: (effects: any[]) => void;
  addEffect: (effect: any) => void;
  removeEffect: (effectId: string) => void;
}

type EditorStore = EditorState & EditorActions;

export const useEditorStore = create<EditorStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    zoom: 1,
    selectedClips: [],
    selectedTracks: [],
    showWaveform: true,
    snapToGrid: true,
    showSafeArea: true,
    showGrid: false,
    playbackSpeed: 1,
    isLooping: false,
    volume: 1,
    muted: false,
    activeTool: 'select',
    brushSize: 10,
    activeEffects: [],

    // Timeline actions
    setCurrentTime: (time: number) => set({ currentTime: time }),
    setDuration: (duration: number) => set({ duration }),
    setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
    setZoom: (zoom: number) => set({ zoom: Math.max(0.1, Math.min(10, zoom)) }),
    setSelectedClips: (clipIds: string[]) => set({ selectedClips: clipIds }),
    addSelectedClip: (clipId: string) => set(state => ({
      selectedClips: [...state.selectedClips, clipId]
    })),
    removeSelectedClip: (clipId: string) => set(state => ({
      selectedClips: state.selectedClips.filter(id => id !== clipId)
    })),
    clearSelectedClips: () => set({ selectedClips: [] }),
    
    // View actions
    toggleWaveform: () => set(state => ({ showWaveform: !state.showWaveform })),
    toggleSnapToGrid: () => set(state => ({ snapToGrid: !state.snapToGrid })),
    toggleSafeArea: () => set(state => ({ showSafeArea: !state.showSafeArea })),
    toggleGrid: () => set(state => ({ showGrid: !state.showGrid })),
    
    // Playback actions
    setPlaybackSpeed: (speed: number) => set({ playbackSpeed: Math.max(0.1, Math.min(4, speed)) }),
    toggleLoop: () => set(state => ({ isLooping: !state.isLooping })),
    setVolume: (volume: number) => set({ volume: Math.max(0, Math.min(1, volume)) }),
    toggleMute: () => set(state => ({ muted: !state.muted })),
    
    // Tool actions
    setActiveTool: (tool: string) => set({ activeTool: tool }),
    setBrushSize: (size: number) => set({ brushSize: Math.max(1, Math.min(100, size)) }),
    
    // Effects actions
    setActiveEffects: (effects: any[]) => set({ activeEffects: effects }),
    addEffect: (effect: any) => set(state => ({
      activeEffects: [...state.activeEffects, effect]
    })),
    removeEffect: (effectId: string) => set(state => ({
      activeEffects: state.activeEffects.filter(effect => effect.id !== effectId)
    }))
  }))
);

// Selectors
export const useCurrentTime = () => useEditorStore(state => state.currentTime);
export const useDuration = () => useEditorStore(state => state.duration);
export const useIsPlaying = () => useEditorStore(state => state.isPlaying);
export const useZoom = () => useEditorStore(state => state.zoom);
export const useSelectedClips = () => useEditorStore(state => state.selectedClips);
export const useActiveTool = () => useEditorStore(state => state.activeTool);
export const useVolume = () => useEditorStore(state => state.volume);
export const useMuted = () => useEditorStore(state => state.muted);
export const useActiveEffects = () => useEditorStore(state => state.activeEffects);