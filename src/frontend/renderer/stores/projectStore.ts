import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  recentProjects: Project[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: number, data: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  setCurrentProject: (project: Project | null) => void;
  setRecentProjects: (projects: Project[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      currentProject: null,
      recentProjects: [],
      isLoading: false,
      error: null,
      
      setProjects: (projects) => set({ projects }),
      
      addProject: (project) => set((state) => ({
        projects: [project, ...state.projects],
      })),
      
      updateProject: (id, data) => set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...data } : p
        ),
        currentProject: state.currentProject?.id === id
          ? { ...state.currentProject, ...data }
          : state.currentProject,
      })),
      
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
      })),
      
      setCurrentProject: (project) => set({ currentProject: project }),
      
      setRecentProjects: (projects) => set({ recentProjects: projects }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
    }),
    {
      name: 'dammaj-projects',
      partialize: (state) => ({
        recentProjects: state.recentProjects.slice(0, 10),
      }),
    }
  )
);
