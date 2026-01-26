# Installation Guide - دماج للقرآن الكريم

This guide will help you install and set up the Dammaj Al-Quran application on your system.

## 📋 System Requirements

### Minimum Requirements
- **Operating System**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **RAM**: 8GB
- **Storage**: 5GB free space
- **Graphics**: DirectX 11 compatible GPU
- **Internet**: Required for AI features and updates

### Recommended Requirements
- **Operating System**: Windows 11, macOS 12+, or Linux (Ubuntu 20.04+)
- **RAM**: 16GB or more
- **Storage**: 20GB+ SSD
- **Graphics**: Dedicated GPU with 4GB+ VRAM
- **Internet**: Broadband connection for cloud features

## 🛠️ Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   ```bash
   # Download from: https://nodejs.org/
   # Verify installation:
   node --version
   npm --version
   ```

2. **Python** (3.9 or higher)
   ```bash
   # Ubuntu/Debian:
   sudo apt update
   sudo apt install python3 python3-pip python3-venv
   
   # macOS:
   brew install python3
   
   # Windows: Download from https://python.org/
   
   # Verify installation:
   python3 --version
   pip3 --version
   ```

3. **FFmpeg** (4.0 or higher)
   ```bash
   # Ubuntu/Debian:
   sudo apt install ffmpeg
   
   # macOS:
   brew install ffmpeg
   
   # Windows: Download from https://ffmpeg.org/
   ```

4. **Git**
   ```bash
   # Ubuntu/Debian:
   sudo apt install git
   
   # macOS:
   brew install git
   
   # Windows: Download from https://git-scm.com/
   ```

### Optional Software

1. **PostgreSQL** (for production database)
2. **Redis** (for caching)
3. **Docker & Docker Compose** (for containerized deployment)

## 🚀 Installation Methods

### Method 1: Quick Setup (Recommended for Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/mimotoufik11-stack/-dammaj-quran.git
   cd dammaj-quran
   ```

2. **Run the setup script**
   ```bash
   # Make executable
   chmod +x scripts/setup.sh
   
   # Run setup
   ./scripts/setup.sh
   ```

3. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run start
   ```

### Method 2: Manual Installation

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env file with your settings
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create Python virtual environment**
   ```bash
   python3 -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env file with your settings
   ```

5. **Initialize database**
   ```bash
   # Run database migrations
   alembic upgrade head
   ```

6. **Download AI models**
   ```bash
   python scripts/download-models.py
   ```

7. **Start the backend server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Method 3: Docker Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mimotoufik11-stack/-dammaj-quran.git
   cd dammaj-quran
   ```

2. **Start with Docker Compose**
   ```bash
   # Development
   docker-compose up --build
   
   # Production
   docker-compose -f docker-compose.prod.yml up -d
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Backend Configuration
DATABASE_URL=postgresql://user:password@localhost/dammaj_quran
SECRET_KEY=your-secret-key-change-in-production
OPENAI_API_KEY=your-openai-api-key

# AI Models
WHISPER_MODEL=base
TTS_VOICE=ar-XA-Wavenet-A

# File Storage
UPLOAD_DIR=uploads
EXPORT_DIR=exports
MODELS_DIR=models

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=true
```

### Database Setup

#### Option 1: SQLite (Development)
```bash
# No additional setup required
DATABASE_URL=sqlite:///./dammaj_quran.db
```

#### Option 2: PostgreSQL (Production)
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres createdb dammaj_quran
sudo -u postgres createuser --interactive dammaj_user

# Set password and permissions
sudo -u postgres psql -c "ALTER USER dammaj_user PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE dammaj_quran TO dammaj_user;"
```

### AI Models Setup

The application uses several AI models that need to be downloaded:

1. **OpenAI Whisper** (Automatic Speech Recognition)
   - Automatically downloaded on first use
   - Model size: ~150MB (base model)

2. **Text-to-Speech Models**
   - Downloaded automatically when first used
   - Total size: ~500MB

3. **FFmpeg Models**
   - System FFmpeg installation required
   - Ensure FFmpeg is in system PATH

## 🧪 Testing Installation

### Frontend Testing
```bash
cd frontend
npm run dev:react
# Visit http://localhost:3000
```

### Backend Testing
```bash
cd backend
python -m pytest tests/
# Should show all tests passing
```

### End-to-End Testing
1. Start both frontend and backend
2. Open http://localhost:3000
3. Create a new project
4. Import a media file
5. Verify basic functionality

## 🔧 Troubleshooting

### Common Issues

#### Node.js Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install
```

#### Python Issues
```bash
# Update pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt --force-reinstall
```

#### Database Issues
```bash
# Reset database
rm -f dammaj_quran.db
python scripts/init-db.py
```

#### FFmpeg Issues
```bash
# Verify FFmpeg installation
ffmpeg -version

# Check if FFmpeg is in PATH
which ffmpeg
```

#### Permission Issues (Linux/macOS)
```bash
# Fix permissions
chmod +x scripts/setup.sh
sudo chown -R $USER:$USER ~/.dammaj-quran
```

### Getting Help

1. **Check the logs**
   ```bash
   # Frontend logs
   cd frontend && npm run dev
   
   # Backend logs
   cd backend && uvicorn app.main:app --reload
   ```

2. **Reset application**
   ```bash
   # Remove all data and start fresh
   rm -rf ~/.dammaj-quran
   ./scripts/setup.sh
   ```

3. **Report issues**
   - GitHub Issues: [https://github.com/mimotoufik11-stack/-dammaj-quran/issues](https://github.com/mimotoufik11-stack/-dammaj-quran/issues)
   - Email: support@dammaj-quran.com

## 🔄 Updates

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Update dependencies
cd frontend && npm install
cd backend && pip install -r requirements.txt

# Restart application
npm run start
```

### Database Migrations

```bash
cd backend
alembic upgrade head
```

## 📦 Distribution

### Building for Production

1. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Package Electron app**
   ```bash
   cd frontend
   npm run build:electron
   ```

3. **Deploy backend**
   ```bash
   cd backend
   # Deploy using your preferred method
   ```

## ✅ Verification Checklist

- [ ] Node.js installed and working
- [ ] Python installed and working  
- [ ] FFmpeg installed and working
- [ ] Git installed and working
- [ ] Frontend builds without errors
- [ ] Backend starts without errors
- [ ] Database connection working
- [ ] AI models downloaded
- [ ] Application accessible at http://localhost:3000

## 🎯 Next Steps

After successful installation:

1. Read the [User Guide](USER_GUIDE.md) to learn how to use the application
2. Explore the [Developer Guide](DEVELOPER_GUIDE.md) if you plan to contribute
3. Check the [API Documentation](API_ENDPOINTS.md) for integration details

---

**بسم الله الرحمن الرحيم**

*If you encounter any issues during installation, please don't hesitate to seek help from the community or contact our support team.*