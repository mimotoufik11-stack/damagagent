# FFmpeg Binaries

This directory should contain FFmpeg binaries for the application to work properly.

## Required Files:

For Windows:
- `ffmpeg.exe` - Main FFmpeg executable
- `ffprobe.exe` - FFprobe executable for metadata extraction

## Download FFmpeg:

### Windows:
1. Visit: https://www.gyan.dev/ffmpeg/builds/
2. Download: `ffmpeg-release-essentials.zip`
3. Extract `ffmpeg.exe` and `ffprobe.exe` to this directory

### Alternative (ffmpeg-static):
The application can also use the `ffmpeg-static` npm package which includes binaries.

## Important Notes:

1. These binaries are NOT included in the repository due to their large size
2. Download them before building the application
3. The `.gitignore` file excludes these binaries from version control
4. For distribution, these will be packaged with the application using electron-builder

## File Structure:
```
public/ffmpeg/
├── ffmpeg.exe      (Windows binary)
├── ffprobe.exe     (Windows binary)
└── README.md       (This file)
```

## Licensing:
FFmpeg is licensed under LGPL 2.1 or later. Make sure to comply with the license terms when distributing your application.

Website: https://ffmpeg.org/
License: https://ffmpeg.org/legal.html
