import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiSave, FiDownload, FiSettings } from 'react-icons/fi';
import VideoPlayer from '../components/VideoPlayer';
import VideoUpload from '../components/VideoUpload';
import CaptionEditor from '../components/CaptionEditor';
import ToolsPanel from '../components/ToolsPanel';
import EffectsPanel from '../components/EffectsPanel';
import Timeline from '../components/Timeline';
import ExportDialog from '../components/ExportDialog';
import { videoService } from '../services/videoService';
import { storageService } from '../services/storageService';

function Editor() {
  const location = useLocation();
  const navigate = useNavigate();
  const [videoPath, setVideoPath] = useState(location.state?.videoPath || null);
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [project, setProject] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('tools'); // tools, effects, captions
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoPath) {
      loadVideoMetadata();
    }
  }, [videoPath]);

  const loadVideoMetadata = async () => {
    try {
      const metadata = await videoService.getVideoMetadata(videoPath);
      setVideoMetadata(metadata);
      setDuration(metadata.duration || 0);
    } catch (error) {
      console.error('Failed to load video metadata:', error);
      alert('فشل في تحميل معلومات الفيديو');
    }
  };

  const handleVideoSelect = (path) => {
    setVideoPath(path);
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  const handleSaveProject = async () => {
    try {
      const projectData = {
        id: project?.id || Date.now().toString(),
        name: project?.name || `مشروع ${new Date().toLocaleDateString('ar')}`,
        videoPath,
        videoMetadata,
        captions,
        settings: {
          // Save all project settings
        },
        updatedAt: new Date().toISOString()
      };

      await storageService.saveProject(projectData);
      setProject(projectData);
      alert('تم حفظ المشروع بنجاح');
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('فشل في حفظ المشروع');
    }
  };

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const handleExportConfirm = async (exportSettings) => {
    setShowExportDialog(false);
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Export video with all effects and captions
      const outputPath = await videoService.exportVideo({
        inputPath: videoPath,
        captions,
        exportSettings,
        onProgress: (progress) => {
          setProcessingProgress(progress);
        }
      });

      setIsProcessing(false);
      alert(`تم تصدير الفيديو بنجاح\n${outputPath}`);
    } catch (error) {
      console.error('Export failed:', error);
      setIsProcessing(false);
      alert('فشل في تصدير الفيديو');
    }
  };

  const handleAddCaption = (caption) => {
    setCaptions([...captions, { ...caption, id: Date.now().toString() }]);
  };

  const handleUpdateCaption = (captionId, updates) => {
    setCaptions(captions.map(cap => 
      cap.id === captionId ? { ...cap, ...updates } : cap
    ));
  };

  const handleDeleteCaption = (captionId) => {
    setCaptions(captions.filter(cap => cap.id !== captionId));
    if (selectedCaption?.id === captionId) {
      setSelectedCaption(null);
    }
  };

  if (!videoPath) {
    return (
      <div className="h-screen flex flex-col bg-dark-900">
        <header className="border-b border-dark-700 px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="btn-secondary flex items-center gap-2">
            <FiHome /> العودة للرئيسية
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <VideoUpload onVideoSelect={handleVideoSelect} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-dark-900">
      {/* Top Toolbar */}
      <header className="border-b border-dark-700 px-6 py-3 flex items-center justify-between bg-dark-800">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="btn-icon" title="العودة للرئيسية">
            <FiHome className="text-xl" />
          </button>
          <div className="h-6 w-px bg-dark-700"></div>
          <h2 className="text-lg font-semibold">محرر الفيديو</h2>
          {videoMetadata && (
            <span className="text-sm text-dark-400">
              {videoMetadata.width}x{videoMetadata.height} • {Math.round(videoMetadata.duration)}s
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSaveProject} className="btn-secondary flex items-center gap-2">
            <FiSave /> حفظ المشروع
          </button>
          <button onClick={handleExport} className="btn-primary flex items-center gap-2">
            <FiDownload /> تصدير الفيديو
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools & Effects */}
        <div className="w-80 panel overflow-y-auto">
          <div className="flex border-b border-dark-700">
            <button
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                activeTab === 'tools' 
                  ? 'bg-dark-700 text-primary-400 border-b-2 border-primary-400' 
                  : 'text-dark-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('tools')}
            >
              الأدوات
            </button>
            <button
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                activeTab === 'effects' 
                  ? 'bg-dark-700 text-primary-400 border-b-2 border-primary-400' 
                  : 'text-dark-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('effects')}
            >
              التأثيرات
            </button>
            <button
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                activeTab === 'captions' 
                  ? 'bg-dark-700 text-primary-400 border-b-2 border-primary-400' 
                  : 'text-dark-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('captions')}
            >
              الكابشنات
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'tools' && (
              <ToolsPanel 
                videoPath={videoPath}
                videoMetadata={videoMetadata}
                onApply={() => {}}
              />
            )}
            {activeTab === 'effects' && (
              <EffectsPanel 
                videoPath={videoPath}
                onApply={() => {}}
              />
            )}
            {activeTab === 'captions' && (
              <CaptionEditor
                captions={captions}
                selectedCaption={selectedCaption}
                currentTime={currentTime}
                onAddCaption={handleAddCaption}
                onUpdateCaption={handleUpdateCaption}
                onDeleteCaption={handleDeleteCaption}
                onSelectCaption={setSelectedCaption}
              />
            )}
          </div>
        </div>

        {/* Center - Video Player */}
        <div className="flex-1 flex flex-col bg-dark-950">
          <div className="flex-1 flex items-center justify-center p-6">
            <VideoPlayer
              ref={videoRef}
              videoPath={videoPath}
              captions={captions}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={setDuration}
              onPlayPause={setIsPlaying}
            />
          </div>

          {/* Timeline */}
          <div className="h-48 border-t border-dark-700">
            <Timeline
              duration={duration}
              currentTime={currentTime}
              captions={captions}
              selectedCaption={selectedCaption}
              onSeek={(time) => {
                setCurrentTime(time);
                if (videoRef.current) {
                  videoRef.current.seekTo(time);
                }
              }}
              onSelectCaption={setSelectedCaption}
            />
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      {showExportDialog && (
        <ExportDialog
          videoMetadata={videoMetadata}
          onExport={handleExportConfirm}
          onClose={() => setShowExportDialog(false)}
        />
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="modal-overlay">
          <div className="bg-dark-800 rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">جاري تصدير الفيديو...</h3>
            <div className="progress-bar mb-4">
              <div 
                className="progress-fill" 
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-dark-400">{Math.round(processingProgress)}%</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Editor;
