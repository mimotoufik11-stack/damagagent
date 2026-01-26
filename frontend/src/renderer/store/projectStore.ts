import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface MediaFile {
  id: string;
  name: string;
  path: string;
  type: 'video' | 'audio' | 'image';
  duration?: number;
  size: number;
  createdAt: string;
  thumbnail?: string;
  metadata?: any;
}

interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'text';
  clips: Clip[];
  muted: boolean;
  locked: boolean;
  volume: number;
  visible: boolean;
}

interface Clip {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  mediaId?: string;
  duration: number;
  trackId: string;
  effects: Effect[];
  properties: any;
}

interface Effect {
  id: string;
  type: string;
  parameters: any;
  enabled: boolean;
}

interface Timeline {
  duration: number;
  currentTime: number;
  tracks: Track[];
  selectedClips: string[];
}

interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  timeline: Timeline;
  settings: ProjectSettings;
  assets: MediaFile[];
}

interface ProjectSettings {
  width: number;
  height: number;
  fps: number;
  bitrate: number;
  audioSampleRate: number;
  backgroundColor: string;
  aspectRatio: string;
}

interface ProjectStore {
  // State
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  error: string | null;

  // Actions
  createProject: (name: string) => void;
  loadProject: (projectId: string) => Promise<void>;
  saveProject: () => Promise<void>;
  saveProjectAs: (filePath: string) => Promise<void>;
  closeProject: () => void;
  loadLastProject: () => Promise<void>;
  updateProject: (updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentProject: null,
    projects: [],
    isLoading: false,
    error: null,

    // Actions
    createProject: (name: string) => {
      const newProject: Project = {
        id: generateId(),
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: {
          duration: 0,
          currentTime: 0,
          tracks: [
            {
              id: generateId(),
              name: 'Video Track 1',
              type: 'video',
              clips: [],
              muted: false,
              locked: false,
              volume: 1,
              visible: true
            },
            {
              id: generateId(),
              name: 'Audio Track 1',
              type: 'audio',
              clips: [],
              muted: false,
              locked: false,
              volume: 1,
              visible: true
            },
            {
              id: generateId(),
              name: 'Text Track 1',
              type: 'text',
              clips: [],
              muted: false,
              locked: false,
              volume: 1,
              visible: true
            }
          ],
          selectedClips: []
        },
        settings: {
          width: 1920,
          height: 1080,
          fps: 30,
          bitrate: 5000,
          audioSampleRate: 44100,
          backgroundColor: '#000000',
          aspectRatio: '16:9'
        },
        assets: []
      };

      set({ currentProject: newProject });
    },

    loadProject: async (projectId: string) => {
      try {
        set({ isLoading: true, error: null });
        
        // This would typically load from file or API
        const result = await window.electronAPI.openProject(projectId);
        
        if (result.success) {
          set({ currentProject: result.project, isLoading: false });
        } else {
          set({ error: result.error, isLoading: false });
        }
      } catch (error) {
        set({ error: error.message, isLoading: false });
      }
    },

    saveProject: async () => {
      const { currentProject } = get();
      if (!currentProject) return;

      try {
        set({ isLoading: true, error: null });
        
        const result = await window.electronAPI.saveProject(currentProject);
        
        if (result.success) {
          set({ 
            currentProject: {
              ...currentProject,
              updatedAt: new Date().toISOString()
            },
            isLoading: false 
          });
        } else {
          set({ error: result.error, isLoading: false });
        }
      } catch (error) {
        set({ error: error.message, isLoading: false });
      }
    },

    saveProjectAs: async (filePath: string) => {
      const { currentProject } = get();
      if (!currentProject) return;

      try {
        set({ isLoading: true, error: null });
        
        const result = await window.electronAPI.saveProjectAs(filePath, currentProject);
        
        if (result.success) {
          set({ 
            currentProject: {
              ...currentProject,
              updatedAt: new Date().toISOString()
            },
            isLoading: false 
          });
        } else {
          set({ error: result.error, isLoading: false });
        }
      } catch (error) {
        set({ error: error.message, isLoading: false });
      }
    },

    closeProject: () => {
      set({ currentProject: null });
    },

    loadLastProject: async () => {
      try {
        set({ isLoading: true, error: null });
        
        // Load from recent projects or default project
        const recentProjects = JSON.parse(localStorage.getItem('recentProjects') || '[]');
        
        if (recentProjects.length > 0) {
          await get().loadProject(recentProjects[0].id);
        } else {
          get().createProject('Untitled Project');
        }
      } catch (error) {
        set({ error: error.message, isLoading: false });
      }
    },

    updateProject: (updates: Partial<Project>) => {
      const { currentProject } = get();
      if (currentProject) {
        set({
          currentProject: {
            ...currentProject,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        });
      }
    },

    deleteProject: async (projectId: string) => {
      try {
        set({ isLoading: true, error: null });
        
        // Implementation would delete from file system or API
        const projects = get().projects.filter(p => p.id !== projectId);
        set({ projects, isLoading: false });
      } catch (error) {
        set({ error: error.message, isLoading: false });
      }
    },

    setError: (error: string | null) => {
      set({ error });
    }
  }))
);

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Selectors for common use cases
export const useCurrentProject = () => useProjectStore(state => state.currentProject);
export const useProjectTimeline = () => 
  useProjectStore(state => state.currentProject?.timeline);
export const useProjectSettings = () => 
  useProjectStore(state => state.currentProject?.settings);
export const useProjectAssets = () => 
  useProjectStore(state => state.currentProject?.assets);