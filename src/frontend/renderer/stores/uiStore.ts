import { create } from 'zustand';

export type ModalType = 
  | 'newProject'
  | 'export'
  | 'import'
  | 'about'
  | 'shortcuts'
  | 'confirmDelete'
  | 'fontManager'
  | 'AITools'
  | 'subtitleStyle'
  | 'clipProperties'
  | 'none';

export interface ModalState {
  type: ModalType;
  data: any;
  isOpen: boolean;
  
  // Actions
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  updateModalData: (data: any) => void;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ToastState {
  toasts: Toast[];
  
  // Actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export interface LoadingState {
  global: boolean;
  project: boolean;
  media: boolean;
  export: boolean;
  ai: boolean;
  messages: Record<string, string>;
  
  // Actions
  setGlobalLoading: (loading: boolean, message?: string) => void;
  setProjectLoading: (loading: boolean, message?: string) => void;
  setMediaLoading: (loading: boolean, message?: string) => void;
  setExportLoading: (loading: boolean, message?: string) => void;
  setAILoading: (loading: boolean, message?: string) => void;
}

export interface UIState {
  modal: ModalState;
  toasts: ToastState;
  loading: LoadingState;
  
  // Sidebar
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
  activeLeftTab: string;
  activeRightTab: string;
  
  // Actions
  setLeftPanelCollapsed: (collapsed: boolean) => void;
  setRightPanelCollapsed: (collapsed: boolean) => void;
  setActiveLeftTab: (tab: string) => void;
  setActiveRightTab: (tab: string) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  type: 'none',
  data: null,
  isOpen: false,
  
  openModal: (type, data = null) => set({ type, data, isOpen: true }),
  closeModal: () => set({ type: 'none', data: null, isOpen: false }),
  updateModalData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
}));

let toastId = 0;
export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = `toast-${++toastId}`;
    const newToast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
    
    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id),
  })),
  
  clearToasts: () => set({ toasts: [] }),
}));

export const useLoadingStore = create<LoadingState>((set) => ({
  global: false,
  project: false,
  media: false,
  export: false,
  ai: false,
  messages: {},
  
  setGlobalLoading: (loading, message = '') => set((state) => ({
    global: loading,
    messages: { ...state.messages, global: message },
  })),
  
  setProjectLoading: (loading, message = '') => set((state) => ({
    project: loading,
    messages: { ...state.messages, project: message },
  })),
  
  setMediaLoading: (loading, message = '') => set((state) => ({
    media: loading,
    messages: { ...state.messages, media: message },
  })),
  
  setExportLoading: (loading, message = '') => set((state) => ({
    export: loading,
    messages: { ...state.messages, export: message },
  })),
  
  setAILoading: (loading, message = '') => set((state) => ({
    ai: loading,
    messages: { ...state.messages, ai: message },
  })),
}));

export const useUIStore = create<UIState>((set) => ({
  modal: useModalStore.getState(),
  toasts: useToastStore.getState(),
  loading: useLoadingStore.getState(),
  
  leftPanelCollapsed: false,
  rightPanelCollapsed: false,
  activeLeftTab: 'media',
  activeRightTab: 'properties',
  
  setLeftPanelCollapsed: (collapsed) => set({ leftPanelCollapsed: collapsed }),
  setRightPanelCollapsed: (collapsed) => set({ rightPanelCollapsed: collapsed }),
  setActiveLeftTab: (tab) => set({ activeLeftTab: tab }),
  setActiveRightTab: (tab) => set({ activeRightTab: tab }),
  
  toggleLeftPanel: () => set((state) => ({
    leftPanelCollapsed: !state.leftPanelCollapsed,
  })),
  
  toggleRightPanel: () => set((state) => ({
    rightPanelCollapsed: !state.rightPanelCollapsed,
  })),
}));
