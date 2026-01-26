import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward,
  Volume2,
  Settings,
  Download,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid,
  Layers,
  Clock
} from 'lucide-react';

import { VideoPreview } from '../components/VideoPreview';
import { Timeline } from '../components/Timeline';
import { LeftToolbar } from '../components/LeftToolbar';
import { TextPanel } from '../components/TextPanel';
import { AudioPanel } from '../components/AudioPanel';
import { ExportPanel } from '../components/ExportPanel';
import { MediaLibrary } from '../components/MediaLibrary';
import { useProjectStore } from '../store/projectStore';
import { useEditorStore } from '../store/editorStore';
import { useUIStore } from '../store/uiStore';

const EditorPage: React.FC = () => {
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Stores
  const projectStore = useProjectStore();
  const editorStore = useEditorStore();
  const uiStore = useUIStore();

  // Local state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    // Load project if coming from another page
    if (location.state?.projectId) {
      projectStore.loadProject(location.state.projectId);
    } else {
      // Load last project or create new one
      projectStore.loadLastProject();
    }
  }, [location.state, projectStore]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Video play/pause logic here
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    // Video stop logic here
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    // Video seek logic here
  };

  const handleSaveProject = async () => {
    await projectStore.saveProject();
  };

  const handleExport = () => {
    uiStore.setShowExportPanel(true);
  };

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col">
      {/* Top Menu Bar */}
      <motion.header 
        className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center space-x-4 space-x-reverse">
          <motion.button
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
          >
            <Grid className="w-4 h-4" />
          </motion.button>
          
          <div className="h-6 w-px bg-slate-600"></div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <motion.button
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Undo className="w-4 h-4" />
            </motion.button>
            <motion.button
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Redo className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <h1 className="text-lg font-semibold">
            {projectStore.currentProject?.name || 'Untitled Project'}
          </h1>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <motion.button
            className="flex items-center space-x-2 space-x-reverse bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveProject}
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </motion.button>
          
          <motion.button
            className="flex items-center space-x-2 space-x-reverse bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <motion.aside 
          className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col"
          initial={{ x: -300 }}
          animate={{ x: 0 }}
        >
          <LeftToolbar />
        </motion.aside>

        {/* Center Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Preview Area */}
          <motion.div 
            className="flex-1 bg-slate-900 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Video Controls */}
            <div className="bg-slate-800 border-b border-slate-700 px-4 py-3">
              <div className="flex items-center justify-center space-x-4 space-x-reverse">
                <motion.button
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SkipBack className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </motion.button>
                
                <motion.button
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleStop}
                >
                  <Square className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SkipForward className="w-5 h-5" />
                </motion.button>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>

            {/* Video Preview */}
            <div className="flex-1 flex items-center justify-center bg-slate-950">
              <VideoPreview 
                ref={videoRef}
                currentTime={currentTime}
                duration={duration}
                isPlaying={isPlaying}
                onTimeUpdate={setCurrentTime}
                onDurationChange={setDuration}
              />
            </div>

            {/* Timeline */}
            <div className="h-64 bg-slate-800 border-t border-slate-700">
              <Timeline 
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
                zoom={zoom}
                onZoomChange={setZoom}
              />
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <motion.aside 
          className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col"
          initial={{ x: 300 }}
          animate={{ x: 0 }}
        >
          <div className="flex-1 overflow-auto">
            {uiStore.activePanel === 'media' && <MediaLibrary />}
            {uiStore.activePanel === 'text' && <TextPanel />}
            {uiStore.activePanel === 'audio' && <AudioPanel />}
            {uiStore.activePanel === 'export' && <ExportPanel />}
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export { EditorPage };