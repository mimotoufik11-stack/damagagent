/**
 * Dammaj Al-Quran - Electron Preload Script
 * Security layer for IPC communication
 */

import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that only the renderer can use
const handlers = {
  // Window controls
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  },

  // File dialogs
  dialog: {
    openFile: (options) => ipcRenderer.invoke('dialog:openFile', options),
    openDirectory: (options) => ipcRenderer.invoke('dialog:openDirectory', options),
    saveFile: (options) => ipcRenderer.invoke('dialog:saveFile', options),
  },

  // File system
  fs: {
    readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
    writeFile: (filePath, data) => ipcRenderer.invoke('fs:writeFile', filePath, data),
    exists: (filePath) => ipcRenderer.invoke('fs:exists', filePath),
    mkdir: (dirPath) => ipcRenderer.invoke('fs:mkdir', dirPath),
    rename: (oldPath, newPath) => ipcRenderer.invoke('fs:rename', oldPath, newPath),
    unlink: (filePath) => ipcRenderer.invoke('fs:unlink', filePath),
    readdir: (dirPath) => ipcRenderer.invoke('fs:readdir', dirPath),
  },

  // Path utilities
  path: {
    join: (...paths) => ipcRenderer.invoke('path:join', ...paths),
    basename: (pathStr, ext) => ipcRenderer.invoke('path:basename', pathStr, ext),
    dirname: (pathStr) => ipcRenderer.invoke('path:dirname', pathStr),
    extname: (pathStr) => ipcRenderer.invoke('path:extname', pathStr),
  },

  // Notifications
  notification: {
    show: (options) => ipcRenderer.invoke('notification:show', options),
  },

  // App info
  app: {
    getPath: (name) => ipcRenderer.invoke('app:getPath', name),
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    isPackaged: () => ipcRenderer.invoke('app:isPackaged'),
  },

  // Clipboard
  clipboard: {
    writeText: (text) => ipcRenderer.invoke('clipboard:writeText', text),
    readText: () => ipcRenderer.invoke('clipboard:readText'),
  },
};

// Expose to renderer
contextBridge.exposeInMainWorld('electronAPI', handlers);

// Also expose a simpler API for backward compatibility
contextBridge.exposeInMainWorld('windowControls', {
  minimize: handlers.window.minimize,
  maximize: handlers.window.maximize,
  close: handlers.window.close,
});

contextBridge.exposeInMainWorld('fileSystem', {
  readFile: handlers.fs.readFile,
  writeFile: handlers.fs.writeFile,
});
