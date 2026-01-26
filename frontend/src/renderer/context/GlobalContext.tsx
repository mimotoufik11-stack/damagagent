import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useProjectStore } from './store/projectStore';
import { useEditorStore } from './store/editorStore';
import { useSettingsStore } from './store/settingsStore';
import { useUIStore } from './store/uiStore';

interface GlobalState {
  isLoading: boolean;
  error: string | null;
  currentProject: any;
  isInitialized: boolean;
}

type GlobalAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_PROJECT'; payload: any }
  | { type: 'SET_INITIALIZED'; payload: boolean };

const initialState: GlobalState = {
  isLoading: false,
  error: null,
  currentProject: null,
  isInitialized: false
};

const globalReducer = (state: GlobalState, action: GlobalAction): GlobalState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    default:
      return state;
  }
};

const GlobalContext = createContext<{
  state: GlobalState;
  dispatch: React.Dispatch<GlobalAction>;
  projectStore: any;
  editorStore: any;
  settingsStore: any;
  uiStore: any;
} | null>(null);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);
  
  // Initialize stores
  const projectStore = useProjectStore();
  const editorStore = useEditorStore();
  const settingsStore = useSettingsStore();
  const uiStore = useUIStore();

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Load settings
        const settings = await window.electronAPI.getSettings();
        if (settings.success) {
          settingsStore.setSettings(settings.settings);
        }

        // Get system info
        const systemInfo = await window.electronAPI.getSystemInfo();
        if (systemInfo.success) {
          // Store system info if needed
        }

        dispatch({ type: 'SET_INITIALIZED', payload: true });
      } catch (error) {
        console.error('Failed to initialize app:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize application' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeApp();
  }, [settingsStore]);

  // Listen for menu actions
  useEffect(() => {
    const handleMenuAction = (action: string) => {
      switch (action) {
        case 'menu-new-project':
          window.location.href = '/new-project';
          break;
        case 'menu-save-project':
          // Handle save project
          break;
        case 'menu-export-video':
          uiStore.setShowExportPanel(true);
          break;
        case 'menu-preferences':
          window.location.href = '/settings';
          break;
        case 'menu-manage-fonts':
          window.location.href = '/fonts';
          break;
        default:
          console.log('Unhandled menu action:', action);
      }
    };

    window.electronAPI.onMenuAction(handleMenuAction);
    
    return () => {
      window.electronAPI.removeAllListeners('menu-action');
    };
  }, [uiStore]);

  return (
    <GlobalContext.Provider
      value={{
        state,
        dispatch,
        projectStore,
        editorStore,
        settingsStore,
        uiStore
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};