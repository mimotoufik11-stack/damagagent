import { ipcMain } from 'electron';
import { dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as os from 'os';
import { spawn } from 'child_process';
import { promisify } from 'util';

const exec = promisify(require('child_process').exec);

export function initializeIPC() {
  // Dialog handlers
  ipcMain.handle('dialog:openFile', async (event, options) => {
    const result = await dialog.showOpenDialog(options);
    return result;
  });

  ipcMain.handle('dialog:saveFile', async (event, options) => {
    const result = await dialog.showSaveDialog(options);
    return result;
  });

  ipcMain.handle('dialog:showMessageBox', async (event, options) => {
    const result = await dialog.showMessageBox(options);
    return result;
  });

  // Project handlers
  ipcMain.handle('project:new', async () => {
    try {
      const defaultProject = {
        id: generateId(),
        name: 'New Project',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: {
          duration: 0,
          tracks: []
        },
        settings: {
          width: 1920,
          height: 1080,
          fps: 30,
          bitrate: 5000,
          audioSampleRate: 44100,
          backgroundColor: '#000000'
        }
      };

      return { success: true, project: defaultProject };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('project:open', async (event, filePath: string) => {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const project = JSON.parse(content);
      return { success: true, project };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('project:save', async (event, projectData: any) => {
    try {
      const projectsDir = path.join(os.homedir(), 'DammajQuran', 'projects');
      await fs.mkdir(projectsDir, { recursive: true });
      
      const filePath = path.join(projectsDir, `${projectData.name}.dammaj`);
      await fs.writeFile(filePath, JSON.stringify(projectData, null, 2));
      
      return { success: true, filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('project:saveAs', async (event, filePath: string, projectData: any) => {
    try {
      await fs.writeFile(filePath, JSON.stringify(projectData, null, 2));
      return { success: true, filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Media handlers
  ipcMain.handle('media:import', async (event, filePaths: string[]) => {
    try {
      const importedMedia = [];
      
      for (const filePath of filePaths) {
        const stats = await fs.stat(filePath);
        const ext = path.extname(filePath).toLowerCase();
        
        let mediaType = 'unknown';
        if (['.mp4', '.avi', '.mov', '.mkv', '.webm'].includes(ext)) {
          mediaType = 'video';
        } else if (['.mp3', '.wav', '.flac', '.ogg', '.m4a'].includes(ext)) {
          mediaType = 'audio';
        } else if (['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext)) {
          mediaType = 'image';
        }
        
        importedMedia.push({
          id: generateId(),
          name: path.basename(filePath),
          path: filePath,
          type: mediaType,
          size: stats.size,
          createdAt: new Date().toISOString()
        });
      }
      
      return { success: true, media: importedMedia };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Audio handlers
  ipcMain.handle('audio:transcribe', async (event, filePath: string) => {
    try {
      // This would integrate with Whisper API
      // For now, return a mock transcription
      return {
        success: true,
        transcription: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('audio:tts', async (event, text: string, voice: string, options: any) => {
    try {
      // This would integrate with TTS service
      // For now, return a mock file path
      return {
        success: true,
        audioPath: `/tmp/tts_${generateId()}.wav`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Video handlers
  ipcMain.handle('video:export', async (event, projectData: any, options: any) => {
    try {
      const exportPath = path.join(os.homedir(), 'DammajQuran', 'exports', `${projectData.name}_${Date.now()}.mp4`);
      await fs.mkdir(path.dirname(exportPath), { recursive: true });
      
      // Mock export process
      return {
        success: true,
        exportPath,
        message: 'Video export started'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Font handlers
  ipcMain.handle('fonts:get', async () => {
    try {
      // This would read system fonts
      const fonts = [
        'Arial',
        'Times New Roman',
        'Helvetica',
        'Arabic Typesetting',
        'Scheherazade',
        'Amiri',
        'Cairo',
        'Tajawal'
      ];
      
      return { success: true, fonts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // System handlers
  ipcMain.handle('system:info', async () => {
    try {
      const info = {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        homedir: os.homedir()
      };
      
      return { success: true, info };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Settings handlers
  ipcMain.handle('settings:get', async () => {
    try {
      const settingsPath = path.join(os.homedir(), 'DammajQuran', 'settings.json');
      
      try {
        const content = await fs.readFile(settingsPath, 'utf-8');
        return { success: true, settings: JSON.parse(content) };
      } catch {
        // Return default settings if file doesn't exist
        const defaultSettings = {
          theme: 'dark',
          language: 'ar',
          autoSave: true,
          recentProjects: [],
          defaultExportFormat: 'mp4',
          defaultResolution: '1080p',
          enableHardwareAcceleration: true,
          defaultFont: 'Arabic Typesetting',
          audioSampleRate: 44100
        };
        
        return { success: true, settings: defaultSettings };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('settings:set', async (event, settings: any) => {
    try {
      const settingsPath = path.join(os.homedir(), 'DammajQuran', 'settings.json');
      await fs.mkdir(path.dirname(settingsPath), { recursive: true });
      await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Menu action handlers
  ipcMain.on('menu-action', (event, action: string) => {
    // Forward menu actions to renderer
    if (event.sender) {
      event.sender.send('menu-action', action);
    }
  });
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}