# API Documentation

## Electron API

### Dialog APIs

#### `openFileDialog(options)`

Opens a file dialog for selecting files.

**Parameters:**
- `options` (Object): Dialog configuration
  - `title` (String): Dialog title
  - `filters` (Array): File type filters
  - `properties` (Array): Dialog properties

**Returns:** Promise<{canceled: boolean, filePaths: string[]}>

**Example:**
```javascript
const result = await window.electronAPI.openFileDialog({
  title: 'Select Video File',
  filters: [
    { name: 'Videos', extensions: ['mp4', 'avi', 'mkv'] }
  ],
  properties: ['openFile']
});

if (!result.canceled) {
  const videoPath = result.filePaths[0];
}
```

#### `saveFileDialog(options)`

Opens a save file dialog.

**Parameters:**
- `options` (Object): Dialog configuration
  - `title` (String): Dialog title
  - `defaultPath` (String): Default file name
  - `filters` (Array): File type filters

**Returns:** Promise<{canceled: boolean, filePath: string}>

**Example:**
```javascript
const result = await window.electronAPI.saveFileDialog({
  title: 'Save Video',
  defaultPath: 'output.mp4',
  filters: [
    { name: 'MP4 Video', extensions: ['mp4'] }
  ]
});
```

### File System APIs

#### `readFile(filePath, encoding)`

Reads a file from the file system.

**Parameters:**
- `filePath` (String): Path to the file
- `encoding` (String, optional): File encoding (e.g., 'utf8')

**Returns:** Promise<{success: boolean, data: Buffer|String, error?: string}>

**Example:**
```javascript
const result = await window.electronAPI.readFile('/path/to/file.txt', 'utf8');
if (result.success) {
  console.log(result.data);
}
```

#### `writeFile(filePath, data)`

Writes data to a file.

**Parameters:**
- `filePath` (String): Path to the file
- `data` (String|Buffer): Data to write

**Returns:** Promise<{success: boolean, error?: string}>

**Example:**
```javascript
const result = await window.electronAPI.writeFile(
  '/path/to/output.txt',
  'Hello World'
);
```

#### `fileExists(filePath)`

Checks if a file exists.

**Parameters:**
- `filePath` (String): Path to check

**Returns:** Promise<boolean>

### FFmpeg APIs

#### `getFFmpegPath()`

Gets the path to the FFmpeg executable.

**Returns:** Promise<string>

#### `getFFprobePath()`

Gets the path to the FFprobe executable.

**Returns:** Promise<string>

#### `executeFFmpeg(args)`

Executes FFmpeg with the given arguments.

**Parameters:**
- `args` (Array<string>): FFmpeg command arguments

**Returns:** Promise<{success: boolean, stdout: string, stderr: string}>

**Example:**
```javascript
const args = [
  '-i', inputPath,
  '-vf', 'scale=1920:1080',
  '-y', outputPath
];

const result = await window.electronAPI.executeFFmpeg(args);
```

#### `executeFFprobe(filePath)`

Gets video metadata using FFprobe.

**Parameters:**
- `filePath` (String): Path to video file

**Returns:** Promise<{success: boolean, metadata: Object}>

**Example:**
```javascript
const result = await window.electronAPI.executeFFprobe(videoPath);
if (result.success) {
  const { width, height, duration } = result.metadata;
}
```

#### `onFFmpegProgress(callback)`

Listens for FFmpeg progress updates.

**Parameters:**
- `callback` (Function): Function to call with progress data

**Example:**
```javascript
window.electronAPI.onFFmpegProgress((data) => {
  console.log('Progress:', data);
});
```

### Path APIs

#### `joinPath(...paths)`

Joins path segments.

**Parameters:**
- `paths` (String[]): Path segments to join

**Returns:** Promise<string>

#### `getDirname(filePath)`

Gets the directory name of a path.

**Parameters:**
- `filePath` (String): File path

**Returns:** Promise<string>

#### `getBasename(filePath)`

Gets the base name of a file.

**Parameters:**
- `filePath` (String): File path

**Returns:** Promise<string>

### App APIs

#### `getAppPath(name)`

Gets an application path.

**Parameters:**
- `name` (String): Path name ('home', 'userData', 'temp', etc.)

**Returns:** Promise<string>

#### `getAppVersion()`

Gets the application version.

**Returns:** Promise<string>

## Service APIs

### FFmpegService

#### `initialize()`

Initializes the FFmpeg service.

**Returns:** Promise<void>

#### `getVideoMetadata(videoPath)`

Gets video metadata.

**Parameters:**
- `videoPath` (String): Path to video file

**Returns:** Promise<Object>
```javascript
{
  duration: number,
  size: number,
  bitrate: number,
  width: number,
  height: number,
  fps: number,
  videoCodec: string,
  audioCodec: string,
  hasAudio: boolean
}
```

#### `trimVideo(inputPath, outputPath, startTime, endTime, onProgress)`

Trims a video.

**Parameters:**
- `inputPath` (String): Input video path
- `outputPath` (String): Output video path
- `startTime` (Number): Start time in seconds
- `endTime` (Number): End time in seconds
- `onProgress` (Function, optional): Progress callback

**Returns:** Promise<Object>

### VideoService

#### `exportVideo(options)`

Exports a video with captions and effects.

**Parameters:**
- `options` (Object):
  - `inputPath` (String): Input video path
  - `captions` (Array): Array of caption objects
  - `exportSettings` (Object): Export configuration
  - `onProgress` (Function): Progress callback

**Returns:** Promise<string> - Output path

### WhisperService

#### `extractCaptions(videoPath, options)`

Extracts captions from video audio.

**Parameters:**
- `videoPath` (String): Path to video
- `options` (Object, optional): Extraction options

**Returns:** Promise<Array> - Array of caption objects

### StorageService

#### `saveProject(project)`

Saves a project to local storage.

**Parameters:**
- `project` (Object): Project data

**Returns:** Promise<boolean>

#### `getAllProjects()`

Gets all saved projects.

**Returns:** Promise<Array>

#### `getProject(projectId)`

Gets a specific project.

**Parameters:**
- `projectId` (String): Project ID

**Returns:** Promise<Object|null>

#### `deleteProject(projectId)`

Deletes a project.

**Parameters:**
- `projectId` (String): Project ID

**Returns:** Promise<boolean>

## Data Types

### Caption Object

```typescript
{
  id: string,
  text: string,
  startTime: number,
  endTime: number,
  fontSize: number,
  color: string,
  backgroundColor: string,
  fontFamily?: string,
  bold: boolean,
  italic: boolean,
  shadow: boolean,
  position?: string
}
```

### Export Settings

```typescript
{
  outputPath: string,
  format: 'mp4' | 'avi' | 'mkv' | 'mov' | 'webm',
  resolution: string, // e.g., '1920x1080'
  quality: 'low' | 'medium' | 'high' | 'best',
  codec: 'h264' | 'h265' | 'vp9' | 'mpeg4',
  fps: number
}
```

### Video Metadata

```typescript
{
  duration: number,
  size: number,
  bitrate: number,
  width: number,
  height: number,
  fps: number,
  videoCodec: string,
  audioCodec: string,
  hasAudio: boolean
}
```

## Error Handling

All API methods return Promises. Handle errors using try-catch:

```javascript
try {
  const result = await window.electronAPI.executeFFmpeg(args);
  if (!result.success) {
    console.error('FFmpeg failed:', result.error);
  }
} catch (error) {
  console.error('Error:', error);
}
```

## Events

### FFmpeg Progress

Listen for FFmpeg progress updates:

```javascript
window.electronAPI.onFFmpegProgress((progress) => {
  console.log('Progress:', progress);
});

// Clean up listener
window.electronAPI.removeFFmpegProgressListener();
```

## Constants

See `src/utils/constants.js` for available constants:

- `VIDEO_FORMATS`
- `RESOLUTIONS`
- `ASPECT_RATIOS`
- `CODECS`
- `QUALITY_PRESETS`
- `FRAME_RATES`
- `CAPTION_POSITIONS`
- `ARABIC_FONTS`

---

**Version:** 1.0.0  
**Last Updated:** 2024-01-31
