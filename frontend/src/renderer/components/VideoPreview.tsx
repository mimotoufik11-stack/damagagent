import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VideoPreviewProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
}

const VideoPreview = forwardRef<HTMLVideoElement, VideoPreviewProps>(
  ({ currentTime, duration, isPlaying, onTimeUpdate, onDurationChange }, ref) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(ref, () => localVideoRef.current!, []);

    useEffect(() => {
      if (localVideoRef.current) {
        if (isPlaying) {
          localVideoRef.current.play();
        } else {
          localVideoRef.current.pause();
        }
      }
    }, [isPlaying]);

    useEffect(() => {
      if (localVideoRef.current) {
        localVideoRef.current.currentTime = currentTime;
      }
    }, [currentTime]);

    const handleTimeUpdate = () => {
      if (localVideoRef.current) {
        onTimeUpdate(localVideoRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (localVideoRef.current) {
        onDurationChange(localVideoRef.current.duration);
      }
    };

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div 
          className="relative bg-black rounded-lg overflow-hidden shadow-2xl"
          style={{ 
            width: '90%', 
            height: '80%',
            maxWidth: '1200px',
            aspectRatio: '16/9'
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Video Element */}
          <video
            ref={localVideoRef}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            poster="/api/placeholder/1920/1080"
          >
            <source src="/api/placeholder/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Islamic Pattern Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-t from-black/30 via-transparent to-black/20"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          </div>

          {/* Play Button Overlay */}
          {!isPlaying && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-8 h-8 text-slate-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </motion.div>
            </motion.div>
          )}

          {/* Time Display */}
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="text-white text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>

          {/* Resolution Display */}
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="text-white text-sm font-mono">
              1920x1080 @ 30fps
            </div>
          </div>

          {/* Safe Area Guides */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border border-white/20 border-dashed"></div>
            <div className="absolute top-[5%] left-[5%] right-[5%] bottom-[5%] border border-red-400/50 border-dashed"></div>
          </div>
        </motion.div>

        {/* Project Information */}
        <motion.div 
          className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-sm"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-white font-semibold mb-2">Current Project</h3>
          <p className="text-gray-300 text-sm">سورة الفاتحة</p>
          <p className="text-gray-400 text-xs mt-1">1920x1080 • H.264 • Stereo</p>
        </motion.div>

        {/* Zoom Controls */}
        <div className="absolute top-4 left-4 flex items-center space-x-2 space-x-reverse">
          <motion.button
            className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-white text-sm">50%</span>
          </motion.button>
          <motion.button
            className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-white text-sm">75%</span>
          </motion.button>
          <motion.button
            className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-white text-sm">100%</span>
          </motion.button>
          <motion.button
            className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-white text-sm">150%</span>
          </motion.button>
        </div>
      </div>
    );
  }
);

VideoPreview.displayName = 'VideoPreview';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export { VideoPreview };