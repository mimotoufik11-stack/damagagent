# Changelog

All notable changes to Quran Video Editor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-31

### Added
- Initial release of Quran Video Editor
- Complete video editing interface with React 18
- FFmpeg integration for video processing
- Caption editor with Arabic font support
- Timeline component with drag and drop
- Video upload and preview functionality
- Export dialog with multiple format support
- Project management system
- Tools panel with 30+ editing features:
  - Trim and crop video
  - Resolution adjustment (480p to 4K)
  - Aspect ratio conversion
  - FPS adjustment
  - Volume control
  - Audio merging
  - Watermark addition
  - Text overlays
- Effects panel with visual effects:
  - Brightness adjustment
  - Contrast control
  - Saturation modification
  - Blur effects
- Whisper integration for automatic caption extraction
- Full RTL (Right-to-Left) support for Arabic
- Dark theme UI with Tailwind CSS
- Electron desktop application framework
- Cross-platform support (Windows, macOS, Linux)

### Features
- **Video Editing:**
  - Load and preview videos in real-time
  - Cut, trim, and merge video clips
  - Crop and resize videos
  - Change resolution and aspect ratio
  - Adjust frame rate

- **Captions:**
  - Manual caption addition
  - Automatic speech-to-text with Whisper
  - Full styling control (fonts, colors, sizes)
  - Timeline-based caption editing
  - SRT file export

- **Audio:**
  - Volume adjustment
  - Audio track merging
  - Noise reduction
  - Audio extraction

- **Effects:**
  - Color correction
  - Visual filters
  - Transitions
  - Text and shape overlays
  - Watermark support

- **Export:**
  - Multiple format support (MP4, AVI, MKV, MOV, WebM)
  - Quality presets (Low, Medium, High, Best)
  - Codec selection (H.264, H.265, VP9, MPEG-4)
  - Resolution options
  - FPS control

- **Project Management:**
  - Save and load projects
  - Project list view
  - Project metadata
  - Quick access to recent projects

### Technical Details
- Built with Electron 28+
- React 18 for UI
- Vite for fast development and building
- FFmpeg for video processing
- Tailwind CSS for styling
- React Router for navigation
- LocalStorage for project persistence

### Known Issues
- Preview may be slow on 4K videos
- Whisper requires internet connection
- Some codecs may take longer to export

### Documentation
- Comprehensive README in Arabic and English
- Installation guide
- Contributing guidelines
- LICENSE file

## [Unreleased]

### Planned Features
- Advanced audio effects
- Animated transitions
- Multi-layer support
- Template library
- Real-time effect preview
- GPU acceleration
- Cloud export (YouTube, Vimeo)
- Multi-user collaboration
- Plugin system
- Advanced timeline features
- Keyframe animation
- Motion tracking
- Chroma key (green screen)
- 360-degree video support

---

For detailed information about each version, see the [releases page](https://github.com/your-repo/quran-video-editor/releases).
