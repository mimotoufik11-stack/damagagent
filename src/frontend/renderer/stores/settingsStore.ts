import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light';
export type Language = 'ar' | 'en';

export interface Settings {
  // General
  language: Language;
  theme: Theme;
  
  // Editor
  autoSaveInterval: number;
  snapToGrid: boolean;
  gridSize: number;
  showWaveforms: boolean;
  showThumbnails: boolean;
  
  // Playback
  defaultFPS: number;
  defaultResolution: string;
  loopPlayback: boolean;
  autoPlayOnLoad: boolean;
  
  // Export
  defaultFormat: string;
  defaultQuality: string;
  exportPath: string;
  
  // AI
  whisperModel: string;
  ttsVoice: string;
  
  // UI
  sidebarWidth: number;
  panelWidth: number;
  timelineHeight: number;
  showRulers: boolean;
  compactMode: boolean;
}

export interface SettingsState {
  settings: Settings;
  
  // Actions
  setSettings: (settings: Partial<Settings>) => void;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  setAutoSaveInterval: (interval: number) => void;
  setDefaultFPS: (fps: number) => void;
  setDefaultResolution: (resolution: string) => void;
  setExportPath: (path: string) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  language: 'ar',
  theme: 'dark',
  autoSaveInterval: 30,
  snapToGrid: true,
  gridSize: 10,
  showWaveforms: true,
  showThumbnails: true,
  defaultFPS: 30,
  defaultResolution: '1920x1080',
  loopPlayback: false,
  autoPlayOnLoad: true,
  defaultFormat: 'mp4',
  defaultQuality: 'high',
  exportPath: '',
  whisperModel: 'base',
  ttsVoice: 'arabic',
  sidebarWidth: 280,
  panelWidth: 320,
  timelineHeight: 200,
  showRulers: true,
  compactMode: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      
      setSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),
      
      setLanguage: (language) => set((state) => ({
        settings: { ...state.settings, language },
      })),
      
      setTheme: (theme) => set((state) => ({
        settings: { ...state.settings, theme },
      })),
      
      setAutoSaveInterval: (interval) => set((state) => ({
        settings: { ...state.settings, autoSaveInterval: interval },
      })),
      
      setDefaultFPS: (fps) => set((state) => ({
        settings: { ...state.settings, defaultFPS: fps },
      })),
      
      setDefaultResolution: (resolution) => set((state) => ({
        settings: { ...state.settings, defaultResolution: resolution },
      })),
      
      setExportPath: (path) => set((state) => ({
        settings: { ...state.settings, exportPath: path },
      })),
      
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'dammaj-settings',
    }
  )
);
