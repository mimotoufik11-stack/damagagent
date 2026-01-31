import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiSkipBack, FiSkipForward } from 'react-icons/fi';

const VideoPlayer = forwardRef(({ 
  videoPath, 
  captions = [], 
  currentTime, 
  isPlaying,
  onTimeUpdate, 
  onDurationChange,
  onPlayPause 
}, ref) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentCaption, setCurrentCaption] = useState(null);

  useImperativeHandle(ref, () => ({
    seekTo: (time) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
    play: () => {
      videoRef.current?.play();
    },
    pause: () => {
      videoRef.current?.pause();
    }
  }));

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      onTimeUpdate(video.currentTime);
      updateCurrentCaption(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      onDurationChange(video.duration);
    };

    const handlePlay = () => {
      onPlayPause(true);
    };

    const handlePause = () => {
      onPlayPause(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoPath]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const updateCurrentCaption = (time) => {
    const caption = captions.find(
      cap => time >= cap.startTime && time <= cap.endTime
    );
    setCurrentCaption(caption);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSkipBack = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
    }
  };

  const handleSkipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 5
      );
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={`file://${videoPath}`}
        className="w-full h-full object-contain"
        onClick={handlePlayPause}
      />

      {/* Caption Overlay */}
      {currentCaption && (
        <div className="caption-overlay">
          <div
            className="caption-text quran-text"
            style={{
              color: currentCaption.color || '#ffffff',
              fontSize: `${currentCaption.fontSize || 24}px`,
              backgroundColor: currentCaption.backgroundColor || 'rgba(0, 0, 0, 0.5)',
              fontWeight: currentCaption.bold ? 'bold' : 'normal',
              fontStyle: currentCaption.italic ? 'italic' : 'normal',
              textShadow: currentCaption.shadow ? '2px 2px 4px rgba(0, 0, 0, 0.8)' : 'none'
            }}
          >
            {currentCaption.text}
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 video-controls p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-4">
          <button onClick={handlePlayPause} className="btn-icon text-white">
            {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
          </button>

          <button onClick={handleSkipBack} className="btn-icon text-white">
            <FiSkipBack size={20} />
          </button>

          <button onClick={handleSkipForward} className="btn-icon text-white">
            <FiSkipForward size={20} />
          </button>

          <span className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(videoRef.current?.duration)}
          </span>

          <div className="flex-1"></div>

          <div className="flex items-center gap-2">
            <button onClick={handleToggleMute} className="btn-icon text-white">
              {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24"
            />
          </div>

          <button onClick={handleFullscreen} className="btn-icon text-white">
            <FiMaximize size={20} />
          </button>
        </div>
      </div>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
