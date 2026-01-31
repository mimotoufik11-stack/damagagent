const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let mainWindow;
let ffmpegPath;
let ffprobePath;

function getFFmpegPath() {
  if (process.env.NODE_ENV === 'development') {
    return {
      ffmpeg: 'ffmpeg',
      ffprobe: 'ffprobe'
    };
  }

  const resourcesPath = process.resourcesPath;
  const ffmpegDir = path.join(resourcesPath, 'ffmpeg');
  
  return {
    ffmpeg: path.join(ffmpegDir, 'ffmpeg.exe'),
    ffprobe: path.join(ffmpegDir, 'ffprobe.exe')
  };
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#1a1a1a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      sandbox: false
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'public/icons/icon.png')
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  const paths = getFFmpegPath();
  ffmpegPath = paths.ffmpeg;
  ffprobePath = paths.ffprobe;
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('dialog:openFile', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle('dialog:saveFile', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle('fs:readFile', async (event, filePath, encoding = null) => {
  try {
    const data = encoding ? fs.readFileSync(filePath, encoding) : fs.readFileSync(filePath);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs:writeFile', async (event, filePath, data) => {
  try {
    fs.writeFileSync(filePath, data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs:exists', async (event, filePath) => {
  return fs.existsSync(filePath);
});

ipcMain.handle('path:join', async (event, ...args) => {
  return path.join(...args);
});

ipcMain.handle('path:dirname', async (event, filePath) => {
  return path.dirname(filePath);
});

ipcMain.handle('path:basename', async (event, filePath) => {
  return path.basename(filePath);
});

ipcMain.handle('ffmpeg:getPath', async () => {
  return ffmpegPath;
});

ipcMain.handle('ffprobe:getPath', async () => {
  return ffprobePath;
});

ipcMain.handle('ffmpeg:execute', async (event, args) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, args);
    
    let stdout = '';
    let stderr = '';

    ffmpeg.stdout.on('data', (data) => {
      stdout += data.toString();
      event.sender.send('ffmpeg:progress', data.toString());
    });

    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
      event.sender.send('ffmpeg:progress', data.toString());
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, stdout, stderr });
      } else {
        reject({ success: false, error: stderr, code });
      }
    });

    ffmpeg.on('error', (error) => {
      reject({ success: false, error: error.message });
    });
  });
});

ipcMain.handle('ffprobe:execute', async (event, filePath) => {
  return new Promise((resolve, reject) => {
    const args = [
      '-v', 'error',
      '-show_entries', 'format=duration,size,bit_rate:stream=width,height,r_frame_rate,codec_name,codec_type',
      '-of', 'json',
      filePath
    ];

    const ffprobe = spawn(ffprobePath, args);
    
    let stdout = '';
    let stderr = '';

    ffprobe.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    ffprobe.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ffprobe.on('close', (code) => {
      if (code === 0) {
        try {
          const metadata = JSON.parse(stdout);
          resolve({ success: true, metadata });
        } catch (error) {
          reject({ success: false, error: 'Failed to parse metadata' });
        }
      } else {
        reject({ success: false, error: stderr, code });
      }
    });

    ffprobe.on('error', (error) => {
      reject({ success: false, error: error.message });
    });
  });
});

ipcMain.handle('app:getPath', async (event, name) => {
  return app.getPath(name);
});

ipcMain.handle('app:getVersion', async () => {
  return app.getVersion();
});
