# Ayah - آيات (Quranic Video Caption Editor)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Android](https://img.shields.io/badge/platform-Android-green.svg)
![Java](https://img.shields.io/badge/language-Java-orange.svg)

A modern Android application for creating beautiful Quranic video captions with automatic speech recognition and AI-powered Quran verse matching.

## Features

### 🎯 Core Functionality
- **Automatic Speech Recognition**: Convert audio to text using Android's SpeechRecognizer
- **AI-Powered Quran Matching**: Intelligent matching of recognized text with Quran verses
- **Timeline Editor**: Precise editing tools for caption timing and positioning
- **Style Customization**: Rich text styling with Arabic fonts, colors, and animations
- **Export Options**: Multiple export formats including SRT, JSON, and video with burned-in captions

### 🛠️ Editing Tools
- **Trim**: Adjust caption start and end times with precision controls
- **Move**: Drag segments to reposition on timeline
- **Split**: Divide segments at current playback position
- **Merge**: Combine adjacent segments
- **Delete**: Remove unwanted segments
- **Style**: Customize fonts, colors, opacity, and positioning
- **Position**: Fine-tune vertical position and horizontal alignment
- **Manual Add**: Search and add specific Quran verses

### 🎨 Design System
- **Islamic Aesthetics**: Beautiful dark theme with gold accents
- **RTL Support**: Full Arabic language support with RTL text direction
- **Material Design 3**: Modern UI components and interactions
- **Custom Timeline**: Visual timeline with drag-and-drop editing

### 📱 Technical Features
- **Offline Processing**: All processing done locally, no internet required
- **WorkManager Integration**: Background processing for long operations
- **Room Database**: Local storage for projects and segments
- **Media3 ExoPlayer**: Modern video playback with caption overlay
- **Arabic Normalization**: Advanced text processing for Arabic content

## Project Structure

```
ayah-caption-editor/
├── app/
│   ├── src/main/
│   │   ├── java/com/myteam/ayah/
│   │   │   ├── ui/                    # User interface components
│   │   │   │   ├── activity/          # Main activity classes
│   │   │   │   ├── adapter/          # RecyclerView adapters
│   │   │   │   ├── fragment/          # Bottom sheets and dialogs
│   │   │   │   └── widget/           # Custom views
│   │   │   ├── data/                 # Data layer
│   │   │   │   ├── db/              # Room database entities and DAOs
│   │   │   │   └── repository/       # Repository pattern implementation
│   │   │   ├── domain/               # Business logic
│   │   │   │   ├── model/           # Domain models
│   │   │   │   └── usecase/         # Use case implementations
│   │   │   ├── worker/              # Background workers
│   │   │   ├── util/               # Utility classes
│   │   │   └── service/            # Service classes
│   │   ├── res/                    # Android resources
│   │   │   ├── drawable/          # Icons and drawable resources
│   │   │   ├── layout/            # XML layout files
│   │   │   ├── values/            # Strings, colors, dimensions
│   │   │   ├── values-ar/         # Arabic translations
│   │   │   └── assets/quran/      # Quran dataset files
│   │   └── test/                  # Unit tests
└── gradle/                        # Gradle wrapper files
```

## Technology Stack

- **Language**: Java 17
- **Target SDK**: 34 (Android 14)
- **Min SDK**: 28 (Android 9.0)
- **Architecture**: MVVM with Repository Pattern
- **Database**: Room Persistence Library
- **Background Processing**: WorkManager
- **Video Playback**: Media3 ExoPlayer
- **UI Framework**: AndroidX with Material Design 3
- **JSON Processing**: Gson
- **Testing**: JUnit

## Getting Started

### Prerequisites
- Android Studio Arctic Fox or later
- JDK 17 or later
- Android SDK 34
- Gradle 8.2

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/ayah-caption-editor.git
cd ayah-caption-editor
```

2. Open the project in Android Studio

3. Sync the project with Gradle files

4. Build and run the application

### Building

Debug build:
```bash
./gradlew assembleDebug
```

Release build:
```bash
./gradlew assembleRelease
```

Run tests:
```bash
./gradlew test
```

## Usage

### Creating a New Project
1. Launch the app and tap "إنشاء فيديو قرآني"
2. Select your video file using the file picker
3. Choose the aspect ratio (optional)
4. Tap "استيراد" to start processing

### Processing Workflow
1. **Audio Extraction**: Extract audio from video
2. **Speech-to-Text**: Convert speech to Arabic text
3. **Quran Matching**: Match text with Quran verses
4. **Timeline Creation**: Generate editable caption segments

### Editing Captions
1. Select a segment from the timeline
2. Use the bottom toolbar tools:
   - Trim: Adjust timing with sliders
   - Move: Drag segment to new position
   - Style: Customize appearance
   - Position: Adjust text positioning
3. Preview changes in real-time

### Exporting
1. Tap the export button in the editor
2. Choose export quality and dimensions
3. Select export format:
   - **Fallback (SRT + JSON)**: Compatible with most video players
   - **Burn-in (FFmpeg)**: Text embedded in video (if available)

## Architecture

### MVVM Pattern
- **Model**: Room entities and domain models
- **View**: Activities, fragments, and custom views
- **ViewModel**: Manages UI state and business logic

### Repository Pattern
- Abstracts data sources (Room database, file system)
- Provides consistent API to the rest of the app
- Handles caching and offline functionality

### Use Cases
- Encapsulate business logic operations
- Separate concerns between UI and data layers
- Enable easier testing and maintenance

## Arabic Text Processing

The app includes sophisticated Arabic text normalization:

- **Tashkeel Removal**: Removes diacritical marks
- **Character Normalization**: Standardizes different letter forms
- **Tokenization**: Breaks text into searchable tokens
- **Similarity Matching**: Uses Jaccard similarity for verse matching

## Database Schema

### Projects Table
- Stores video project metadata
- Tracks processing status and file paths
- Manages project lifecycle

### Segments Table  
- Stores individual caption segments
- Includes timing, styling, and positioning data
- Links to Quran verse references

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Style
- Follow Android naming conventions
- Use meaningful variable and method names
- Add JavaDoc comments for public APIs
- Keep methods focused and concise

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Quran Text**: Public domain Quran translations and text processing
- **Arabic Fonts**: Cairo and Amiri font families for beautiful Arabic rendering
- **Android Development Community**: For excellent libraries and tools
- **Material Design Team**: For design system guidelines and components

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

## Roadmap

- [ ] **FFmpeg Integration**: Native video processing capabilities
- [ ] **Cloud Sync**: Backup projects to cloud storage
- [ ] **Templates**: Pre-designed caption styles
- [ ] **Batch Processing**: Process multiple videos simultaneously
- [ ] **Sharing**: Direct social media integration
- [ ] **Analytics**: Track viewing engagement and completion rates

---

**Made with ❤️ for the Muslim community**

* إن شاء الله (InshaAllah) - God willing*