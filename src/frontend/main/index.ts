/**
 * Dammaj Al-Quran - Electron Main Process
 * Professional Quran Video Editing Studio
 */

import { app, BrowserWindow, ipcMain, dialog, shell, Notification } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AppWindow {
  constructor() {
    this.mainWindow = null;
    this.isReady = false;
  }

  createWindow() {
    // Create the browser window
    this.mainWindow = new BrowserWindow({
      title: 'دماج للقرآن الكريم',
      width: 1920,
      height: 1080,
      minWidth: 1280,
      minHeight: 720,
      backgroundColor: '#0a0a0f',
      show: false,
      frame: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        sandbox: false,
      },
      icon: path.join(__dirname, 'renderer/assets/icons/icon.ico'),
    });

    // Load the app
    if (app.isPackaged) {
      this.mainWindow.loadFile(path.join(__dirname, 'index.html'));
    } else {
      this.mainWindow.loadURL('http://localhost:3000');
    }

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
      this.mainWindow.focus();
    });

    // Handle window events
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    // Maximize window by default
    this.mainWindow.maximize();

    // Setup IPC handlers
    this.setupIPCHandlers();

    // Open external links in browser
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });
  }

  setupIPCHandlers() {
    // Window controls
    ipcMain.handle('window:minimize', () => {
      this.mainWindow?.minimize();
    });

    ipcMain.handle('window:maximize', () => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow?.maximize();
      }
    });

    ipcMain.handle('window:close', () => {
      this.mainWindow?.close();
    });

    ipcMain.handle('window:isMaximized', () => {
      return this.mainWindow?.isMaximized() || false;
    });

    // File dialogs
    ipcMain.handle('dialog:openFile', async (event, options) => {
      const result = await dialog.showOpenDialog(this.mainWindow, {
        properties: ['openFile', 'multiSelections'],
        ...options,
      });
      return result;
    });

    ipcMain.handle('dialog:openDirectory', async (event, options) => {
      const result = await dialog.showOpenDialog(this.mainWindow, {
        properties: ['openDirectory'],
        ...options,
      });
      return result;
    });

    ipcMain.handle('dialog:saveFile', async (event, options) => {
      const result = await dialog.showSaveDialog(this.mainWindow, options);
      return result;
    });

    // File system operations
    ipcMain.handle('fs:readFile', async (event, filePath) => {
      try {
        const content = await fs.promises.readFile(filePath);
        return content.toString('base64');
      } catch (error) {
        throw error;
      }
    });

    ipcMain.handle('fs:writeFile', async (event, filePath, data) => {
      try {
        await fs.promises.writeFile(filePath, Buffer.from(data, 'base64'));
        return true;
      } catch (error) {
        throw error;
      }
    });

    ipcMain.handle('fs:exists', async (event, filePath) => {
      return fs.existsSync(filePath);
    });

    ipcMain.handle('fs:mkdir', async (event, dirPath) => {
      try {
        await fs.promises.mkdir(dirPath, { recursive: true });
        return true;
      } catch (error) {
        throw error;
      }
    });

    ipcMain.handle('fs:rename', async (event, oldPath, newPath) => {
      try {
        await fs.promises.rename(oldPath, newPath);
        return true;
      } catch (error) {
        throw error;
      }
    });

    ipcMain.handle('fs:unlink', async (event, filePath) => {
      try {
        await fs.promises.unlink(filePath);
        return true;
      } catch (error) {
        throw error;
      }
    });

    ipcMain.handle('fs:readdir', async (event, dirPath) => {
      try {
        const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
        return entries.map(entry => ({
          name: entry.name,
          isDirectory: entry.isDirectory(),
          isFile: entry.isFile(),
        }));
      } catch (error) {
        throw error;
      }
    });

    // Path operations
    ipcMain.handle('path:join', (event, ...paths) => {
      return path.join(...paths);
    });

    ipcMain.handle('path:basename', (event, pathStr, ext) => {
      return path.basename(pathStr, ext);
    });

    ipcMain.handle('path:dirname', (event, pathStr) => {
      return path.dirname(pathStr);
    });

    ipcMain.handle('path:extname', (event, pathStr) => {
      return path.extname(pathStr);
    });

    // Notifications
    ipcMain.handle('notification:show', async (event, options) => {
      const notification = new Notification({
        title: options.title || 'دماج للقرآن الكريم',
        body: options.body || '',
        icon: options.icon || path.join(__dirname, 'renderer/assets/icons/icon.ico'),
      });
      notification.show();
    });

    // App info
    ipcMain.handle('app:getPath', (event, name) => {
      return app.getPath(name);
    });

    ipcMain.handle('app:getVersion', () => {
      return app.getVersion();
    });

    ipcMain.handle('app:isPackaged', () => {
      return app.isPackaged;
    });

    // Copy to clipboard
    ipcMain.handle('clipboard:writeText', (event, text) => {
      return import('electron').then(({ clipboard }) => clipboard.writeText(text));
    });

    ipcMain.handle('clipboard:readText', () => {
      return import('electron').then(({ clipboard }) => clipboard.readText());
    });
  }
}

// App lifecycle
let mainWindow = null;

app.whenReady().then(() => {
  const appWindow = new AppWindow();
  appWindow.createWindow();
  mainWindow = appWindow.mainWindow;

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      appWindow.createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Cleanup before quitting
});
