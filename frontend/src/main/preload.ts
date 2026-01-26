import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  openFile: (options: any) => ipcRenderer.invoke('dialog:openFile', options),
  saveFile: (options: any) => ipcRenderer.invoke('dialog:saveFile', options),
  showMessageBox: (options: any) => ipcRenderer.invoke('dialog:showMessageBox', options),
  
  // Project operations
  newProject: () => ipcRenderer.invoke('project:new'),
  openProject: (filePath: string) => ipcRenderer.invoke('project:open', filePath),
  saveProject: (projectData: any) => ipcRenderer.invoke('project:save', projectData),
  saveProjectAs: (filePath: string, projectData: any) => ipcRenderer.invoke('project:saveAs', filePath, projectData),
  
  // Media operations
  importMedia: (filePaths: string[]) => ipcRenderer.invoke('media:import', filePaths),
  processMedia: (filePath: string, options: any) => ipcRenderer.invoke('media:process', filePath, options),
  
  // Audio operations
  transcribeAudio: (filePath: string) => ipcRenderer.invoke('audio:transcribe', filePath),
  generateTTS: (text: string, voice: string, options: any) => ipcRenderer.invoke('audio:tts', text, voice, options),
  normalizeAudio: (filePath: string, options: any) => ipcRenderer.invoke('audio:normalize', filePath, options),
  
  // Video operations
  exportVideo: (projectData: any, options: any) => ipcRenderer.invoke('video:export', projectData, options),
  processVideo: (filePath: string, options: any) => ipcRenderer.invoke('video:process', filePath, options),
  
  // Font operations
  getFonts: () => ipcRenderer.invoke('fonts:get'),
  installFont: (fontPath: string) => ipcRenderer.invoke('fonts:install', fontPath),
  uninstallFont: (fontName: string) => ipcRenderer.invoke('fonts:uninstall', fontName),
  
  // System operations
  getSystemInfo: () => ipcRenderer.invoke('system:info'),
  getAppPath: () => ipcRenderer.invoke('app:getPath'),
  showItemInFolder: (fullPath: string) => ipcRenderer.invoke('shell:showItemInFolder', fullPath),
  
  // Settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  setSettings: (settings: any) => ipcRenderer.invoke('settings:set', settings),
  
  // Event listeners
  onMenuAction: (callback: (action: string) => void) => {
    ipcRenderer.on('menu-action', (event, action) => callback(action));
  },
  
  onProjectLoaded: (callback: (project: any) => void) => {
    ipcRenderer.on('project:loaded', (event, project) => callback(project));
  },
  
  onProjectSaved: (callback: (success: boolean) => void) => {
    ipcRenderer.on('project:saved', (event, success) => callback(success));
  },
  
  onExportProgress: (callback: (progress: any) => void) => {
    ipcRenderer.on('export:progress', (event, progress) => callback(progress));
  },
  
  onError: (callback: (error: any) => void) => {
    ipcRenderer.on('error', (event, error) => callback(error));
  },
  
  // Remove listeners
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel)
});

// Define the global type for TypeScript
declare global {
  interface Window {
    electronAPI: {
      openFile: (options: any) => Promise<any>;
      saveFile: (options: any) => Promise<any>;
      showMessageBox: (options: any) => Promise<any>;
      newProject: () => Promise<any>;
      openProject: (filePath: string) => Promise<any>;
      saveProject: (projectData: any) => Promise<any>;
      saveProjectAs: (filePath: string, projectData: any) => Promise<any>;
      importMedia: (filePaths: string[]) => Promise<any>;
      processMedia: (filePath: string, options: any) => Promise<any>;
      transcribeAudio: (filePath: string) => Promise<any>;
      generateTTS: (text: string, voice: string, options: any) => Promise<any>;
      normalizeAudio: (filePath: string, options: any) => Promise<any>;
      exportVideo: (projectData: any, options: any) => Promise<any>;
      processVideo: (filePath: string, options: any) => Promise<any>;
      getFonts: () => Promise<any>;
      installFont: (fontPath: string) => Promise<any>;
      uninstallFont: (fontName: string) => Promise<any>;
      getSystemInfo: () => Promise<any>;
      getAppPath: () => Promise<any>;
      showItemInFolder: (fullPath: string) => Promise<any>;
      getSettings: () => Promise<any>;
      setSettings: (settings: any) => Promise<any>;
      onMenuAction: (callback: (action: string) => void) => void;
      onProjectLoaded: (callback: (project: any) => void) => void;
      onProjectSaved: (callback: (success: boolean) => void) => void;
      onExportProgress: (callback: (progress: any) => void) => void;
      onError: (callback: (error: any) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}