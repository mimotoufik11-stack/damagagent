# دماج للقرآن الكريم (Dammaj Al-Quran)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18.2+-61dafb.svg)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-27.0+-47848f.svg)](https://electronjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688.svg)](https://fastapi.tiangolo.com/)

## Overview

**دماج للقرآن الكريم** (Dammaj Al-Quran) is a professional video studio application specifically designed for creating high-quality Quran videos with beautiful Arabic typography, advanced audio processing, and AI-powered features. Built with Electron, React, and FastAPI, it provides a comprehensive desktop solution for Islamic content creators.

## 🌟 Key Features

### 🎬 Professional Video Editor
- **Timeline-based editing** with multi-track support
- **Real-time preview** with hardware acceleration
- **Professional transitions** and effects
- **4K/8K video export** support
- **Subtitle integration** with multiple formats

### 🎵 Advanced Audio Processing
- **AI-powered voice synthesis** (Text-to-Speech)
- **Automatic transcription** using OpenAI Whisper
- **Audio normalization** and noise reduction
- **Multi-format audio support** (MP3, WAV, FLAC, OGG)

### 📝 Arabic Typography & RTL Support
- **Beautiful Arabic fonts** with proper diacritics
- **RTL text rendering** with perfect alignment
- **Custom font management** with preview system
- **Islamic calligraphy** integration
- **Multiple Arabic text styles** and layouts

### 🤖 AI Integration
- **Whisper ASR** for automatic audio transcription
- **Text-to-Speech** with natural Arabic voices
- **Automatic subtitle generation**
- **AI-powered video enhancement**
- **Smart content analysis**

### 📊 Project Management
- **Template system** for quick project creation
- **Version control** for projects
- **Cloud synchronization** ready
- **Export presets** for different platforms
- **Batch processing** capabilities

## 🏗️ Architecture

```
dammaj-quran/
├── frontend/           # Electron + React Desktop App
│   ├── src/main/       # Electron Main Process
│   ├── src/renderer/   # React Frontend
│   └── dist/           # Built Application
├── backend/            # FastAPI Backend Server
│   ├── app/            # Application Logic
│   ├── ml_models/      # AI Models & Processing
│   └── tests/          # Backend Tests
├── docs/               # Documentation
├── scripts/            # Setup & Build Scripts
└── docker/             # Docker Configuration
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **Python** 3.9+
- **FFmpeg** 4.0+
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mimotoufik11-stack/-dammaj-quran.git
cd dammaj-quran
```

2. **Setup the application**
```bash
# Make setup script executable
chmod +x scripts/setup.sh

# Run complete setup
./scripts/setup.sh
```

3. **Start the application**
```bash
# Start both frontend and backend
npm run start

# Or start separately
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
```

### Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Documentation

| Document | Description | Language |
|----------|-------------|----------|
| [Installation Guide](docs/INSTALLATION.md) | Complete setup instructions | EN |
| [User Guide](docs/USER_GUIDE.md) | How to use the application | EN |
| [دليل المستخدم](docs/USER_GUIDE_AR.md) | دليل شامل للاستخدام | AR |
| [Developer Guide](docs/DEVELOPER_GUIDE.md) | Development documentation | EN |
| [API Documentation](docs/API_ENDPOINTS.md) | Complete API reference | EN |
| [Architecture](docs/ARCHITECTURE.md) | System architecture | EN |

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev:react      # Start React development server
npm run build:react    # Build React app
npm run test          # Run frontend tests
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### AI Models Setup
```bash
# Download required AI models
python scripts/download-models.py
```

## 🎯 Use Cases

### Content Creators
- Create professional Quran recitation videos
- Generate educational Islamic content
- Produce beautiful Arabic typography videos
- Design Islamic presentations and animations

### Mosques & Islamic Centers
- Weekly Quran study sessions
- Educational webinars
- Community announcements
- Event recordings with subtitles

### Islamic Schools & Universities
- Curriculum-based Quran videos
- Interactive learning materials
- Assessment recordings
- Research presentations

## 🔧 Configuration

### Environment Variables
```bash
# Backend Configuration
DATABASE_URL=postgresql://user:pass@localhost/dammaj_quran
SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-key

# AI Models
WHISPER_MODEL=base
TTS_VOICE=ar-XA-Wavenet-A
```

### Supported Formats

#### Input Formats
- **Video**: MP4, AVI, MOV, MKV, WebM
- **Audio**: MP3, WAV, FLAC, OGG, M4A
- **Images**: PNG, JPG, JPEG, WebP, SVG
- **Text**: TXT, SRT, VTT, ASS

#### Output Formats
- **Video**: MP4 (H.264/H.265), WebM
- **Audio**: MP3, WAV, AAC
- **Subtitles**: SRT, VTT, ASS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write comprehensive tests
- Update documentation
- Ensure Arabic/RTL support
- Test with different Quran recitations

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Quran.com API** for Quran text and translations
- **OpenAI Whisper** for automatic speech recognition
- **FFmpeg** for video processing capabilities
- **Arabic typography** community for font resources
- **Islamic scholars** for content validation

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/mimotoufik11-stack/-dammaj-quran/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mimotoufik11-stack/-dammaj-quran/discussions)
- **Email**: support@dammaj-quran.com

## 🗺️ Roadmap

- [ ] **Mobile App** (React Native)
- [ ] **Web Version** (PWA)
- [ ] **Cloud Integration** (AWS/GCP)
- [ ] **Advanced AI Features**
- [ ] **Collaborative Editing**
- [ ] **Live Streaming Integration**
- [ ] **Plugin System**
- [ ] **Multi-language Support**

---

<div align="center">

**Made with ❤️ for the Ummah**

*In the name of Allah, the Most Gracious, the Most Merciful*

[Website](https://dammaj-quran.com) | [Documentation](docs/) | [API](docs/API_ENDPOINTS.md)

</div>