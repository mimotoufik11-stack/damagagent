const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Dialog APIs
  openFileDialog: (options) => ipcRenderer.invoke('dialog:openFile', options),
  saveFileDialog: (options) => ipcRenderer.invoke('dialog:saveFile', options),

  // File System APIs
  readFile: (filePath, encoding) => ipcRenderer.invoke('fs:readFile', filePath, encoding),
  writeFile: (filePath, data) => ipcRenderer.invoke('fs:writeFile', filePath, data),
  fileExists: (filePath) => ipcRenderer.invoke('fs:exists', filePath),

  // Path APIs
  joinPath: (...args) => ipcRenderer.invoke('path:join', ...args),
  getDirname: (filePath) => ipcRenderer.invoke('path:dirname', filePath),
  getBasename: (filePath) => ipcRenderer.invoke('path:basename', filePath),

  // FFmpeg APIs
  getFFmpegPath: () => ipcRenderer.invoke('ffmpeg:getPath'),
  getFFprobePath: () => ipcRenderer.invoke('ffprobe:getPath'),
  executeFFmpeg: (args) => ipcRenderer.invoke('ffmpeg:execute', args),
  executeFFprobe: (filePath) => ipcRenderer.invoke('ffprobe:execute', filePath),
  onFFmpegProgress: (callback) => {
    ipcRenderer.on('ffmpeg:progress', (event, data) => callback(data));
  },
  removeFFmpegProgressListener: () => {
    ipcRenderer.removeAllListeners('ffmpeg:progress');
  },

  // App APIs
  getAppPath: (name) => ipcRenderer.invoke('app:getPath', name),
  getAppVersion: () => ipcRenderer.invoke('app:getVersion')
});
