#!/bin/bash

# Dammaj Al-Quran Setup Script
# Complete setup for development environment

set -e

echo "🕌 Setting up دماج للقرآن الكريم (Dammaj Al-Quran)"
echo "==============================================="

# Check if running on correct OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    OS="windows"
else
    echo "❌ Unsupported operating system: $OSTYPE"
    exit 1
fi

echo "✅ Detected OS: $OS"

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version)"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+ from https://python.org/"
    exit 1
fi

PYTHON_VERSION=$(python3 -c "import sys; print('.'.join(map(str, sys.version_info[:2])))")
echo "✅ Python $PYTHON_VERSION"

# Check FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  FFmpeg is not installed. Installing..."
    if [[ "$OS" == "linux" ]]; then
        sudo apt update && sudo apt install -y ffmpeg
    elif [[ "$OS" == "macos" ]]; then
        brew install ffmpeg
    else
        echo "❌ Please install FFmpeg manually from https://ffmpeg.org/"
        exit 1
    fi
fi

echo "✅ FFmpeg $(ffmpeg -version | head -n1)"

# Check Git
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git from https://git-scm.com/"
    exit 1
fi

echo "✅ Git $(git --version)"

# Create directories
echo "📁 Creating directories..."
mkdir -p uploads exports models logs temp
mkdir -p ~/.dammaj-quran/{projects,exports,cache}

# Frontend setup
echo "🎨 Setting up frontend..."
cd frontend

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file from template"
fi

# Build frontend
echo "🔨 Building frontend..."
npm run build

cd ..

# Backend setup
echo "⚙️  Setting up backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📦 Installing backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file from template"
fi

# Initialize database
echo "🗄️  Initializing database..."
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
python3 -c "
from app.database.db import init_db
import asyncio
asyncio.run(init_db())
print('✅ Database initialized')
" || echo "⚠️  Database initialization skipped (this is normal for first run)"

# Download AI models
echo "🤖 Downloading AI models..."
python3 scripts/download-models.py || echo "⚠️  AI models download skipped (will be downloaded on first use)"

cd ..

# Create scripts
echo "📜 Creating convenience scripts..."

# Create start script
cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting دماج للقرآن الكريم..."

# Start backend in background
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
cd ../frontend
npm run dev:electron &
FRONTEND_PID=$!

echo "✅ Application started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Trap Ctrl+C and kill all background processes
trap 'kill $BACKEND_PID $FRONTEND_PID; exit' INT

# Wait for processes
wait
EOF

chmod +x start.sh

# Create development script
cat > dev.sh << 'EOF'
#!/bin/bash
echo "🔧 Starting development servers..."

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Stopping development servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup EXIT

# Start backend
cd backend
source venv/bin/activate
echo "Starting backend server..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend
sleep 3

# Start frontend
cd ../frontend
echo "Starting frontend development server..."
npm run dev:react &
FRONTEND_PID=$!

echo "✅ Development servers started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""

# Wait for processes
wait
EOF

chmod +x dev.sh

# Create build script
cat > build.sh << 'EOF'
#!/bin/bash
echo "🔨 Building application for production..."

# Build frontend
echo "🎨 Building frontend..."
cd frontend
npm run build

# Build Electron app
echo "⚛️  Building Electron application..."
npm run build:electron

echo "✅ Build completed!"
echo "📦 Electron app is ready in frontend/release/"
EOF

chmod +x build.sh

# Set up Git hooks (if .git exists)
if [ -d ".git" ]; then
    echo "🔗 Setting up Git hooks..."
    
    # Pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Run linting and tests before committing

echo "🔍 Running pre-commit checks..."

# Frontend linting
cd frontend
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Frontend linting failed"
    exit 1
fi

# Backend tests
cd ../backend
source venv/bin/activate
python -m pytest tests/ --quiet
if [ $? -ne 0 ]; then
    echo "❌ Backend tests failed"
    exit 1
fi

echo "✅ Pre-commit checks passed"
EOF

    chmod +x .git/hooks/pre-commit
fi

# Final setup message
echo ""
echo "🎉 Setup completed successfully!"
echo "================================"
echo ""
echo "📋 What's next:"
echo "1. Edit .env files in frontend/ and backend/ directories"
echo "2. Configure your database and API keys"
echo "3. Run './start.sh' to start the application"
echo "4. Or run './dev.sh' for development mode"
echo ""
echo "🔧 Quick commands:"
echo "  ./start.sh      - Start the application"
echo "  ./dev.sh        - Start development servers"
echo "  ./build.sh      - Build for production"
echo "  cd frontend     - Frontend directory"
echo "  cd backend      - Backend directory"
echo ""
echo "📚 Documentation:"
echo "  - Installation Guide: docs/INSTALLATION.md"
echo "  - User Guide: docs/USER_GUIDE.md"
echo "  - Developer Guide: docs/DEVELOPER_GUIDE.md"
echo ""
echo "🆘 Need help?"
echo "  - GitHub Issues: https://github.com/mimotoufik11-stack/-dammaj-quran/issues"
echo "  - Email: support@dammaj-quran.com"
echo ""
echo "بارك الله فيكم!"
echo "Made with ❤️ for the Ummah"