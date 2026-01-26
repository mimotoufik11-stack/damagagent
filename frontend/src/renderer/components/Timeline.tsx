import React from 'react';
import { motion } from 'framer-motion';
import { useTimeline } from '../hooks/useTimeline';

interface TimelineProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  currentTime,
  duration,
  onSeek,
  zoom,
  onZoomChange
}) => {
  const { tracks, addTrack, removeTrack, clips } = useTimeline();

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / rect.width) * duration;
    onSeek(Math.max(0, Math.min(duration, time)));
  };

  const timelineWidth = 2000 * zoom;
  const timelinePadding = 100;

  return (
    <div className="h-full flex flex-col bg-slate-800">
      {/* Timeline Header */}
      <div className="bg-slate-700 border-b border-slate-600 px-4 py-2">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Timeline</h3>
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-gray-400 text-sm">Zoom:</span>
            <motion.button
              className="px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-white text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onZoomChange(Math.max(0.1, zoom - 0.1))}
            >
              -
            </motion.button>
            <span className="text-white text-sm min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <motion.button
              className="px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-white text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onZoomChange(Math.min(5, zoom + 0.1))}
            >
              +
            </motion.button>
          </div>
        </div>
      </div>

      {/* Time Ruler */}
      <div className="bg-slate-700 border-b border-slate-600 relative">
        <div 
          className="h-8 relative cursor-pointer"
          onClick={handleTimelineClick}
          style={{ width: `${timelineWidth}px` }}
        >
          {Array.from({ length: Math.ceil(duration / 10) + 1 }, (_, i) => {
            const time = i * 10;
            const position = (time / duration) * 100;
            
            return (
              <motion.div
                key={i}
                className="absolute top-0 h-full flex flex-col justify-end"
                style={{ left: `${position}%` }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="w-px h-3 bg-gray-400"></div>
                <span className="text-xs text-gray-400 mt-1 transform -translate-x-1/2">
                  {formatTime(time)}
                </span>
              </motion.div>
            );
          })}
          
          {/* Playhead */}
          <motion.div
            className="absolute top-0 h-full w-0.5 bg-red-500 z-20 pointer-events-none"
            style={{ left: `${(currentTime / duration) * 100}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </motion.div>
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-full">
          {tracks.map((track, trackIndex) => (
            <motion.div
              key={track.id}
              className="border-b border-slate-600 bg-slate-750"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: trackIndex * 0.1 }}
            >
              {/* Track Header */}
              <div className="flex items-center px-4 py-2 bg-slate-700 border-b border-slate-600">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className={`w-3 h-3 rounded-full ${
                    track.type === 'video' ? 'bg-blue-500' :
                    track.type === 'audio' ? 'bg-green-500' :
                    track.type === 'text' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`}></div>
                  <span className="text-white font-medium">{track.name}</span>
                </div>
                <div className="flex-1"></div>
                <motion.button
                  className="text-gray-400 hover:text-white p-1"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeTrack(track.id)}
                >
                  ×
                </motion.button>
              </div>

              {/* Track Content */}
              <div 
                className="h-16 relative"
                style={{ width: `${timelineWidth}px` }}
              >
                {track.clips.map((clip) => (
                  <motion.div
                    key={clip.id}
                    className={`absolute top-1 bottom-1 rounded cursor-pointer ${
                      track.type === 'video' ? 'bg-blue-500/80 border-blue-400' :
                      track.type === 'audio' ? 'bg-green-500/80 border-green-400' :
                      track.type === 'text' ? 'bg-yellow-500/80 border-yellow-400' :
                      'bg-purple-500/80 border-purple-400'
                    } border hover:opacity-100`}
                    style={{
                      left: `${(clip.startTime / duration) * 100}%`,
                      width: `${((clip.endTime - clip.startTime) / duration) * 100}%`
                    }}
                    whileHover={{ scaleY: 1.1, zIndex: 10 }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="h-full flex items-center px-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-xs font-medium truncate">
                          {clip.name}
                        </div>
                        <div className="text-gray-200 text-xs">
                          {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-white/50 rounded-full ml-1"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Add Track Button */}
          <motion.div
            className="p-4 border-b border-slate-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: tracks.length * 0.1 + 0.2 }}
          >
            <div className="flex space-x-2 space-x-reverse">
              <motion.button
                className="flex items-center space-x-2 space-x-reverse px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addTrack('video')}
              >
                <span>+ Video Track</span>
              </motion.button>
              <motion.button
                className="flex items-center space-x-2 space-x-reverse px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addTrack('audio')}
              >
                <span>+ Audio Track</span>
              </motion.button>
              <motion.button
                className="flex items-center space-x-2 space-x-reverse px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white text-sm transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addTrack('text')}
              >
                <span>+ Text Track</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export { Timeline };