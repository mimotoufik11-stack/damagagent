import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import styles from './VideoPreview.module.css';

interface VideoPreviewProps {
  src?: string;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  src,
  onTimeUpdate,
  onEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const { currentTime: storeTime, setCurrentTime: setStoreTime } = useEditorStore();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = storeTime;
    }
  }, [storeTime]);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      setStoreTime(time);
      onTimeUpdate?.(time);
    }
  }, [setStoreTime, onTimeUpdate]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      setStoreTime(time);
    }
  }, [setStoreTime]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = useCallback(() => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const skip = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  }, []);

  const skipBack = () => skip(-5);
  const skipForward = () => skip(5);

  return (
    <div 
      className={styles.container}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(true)}
    >
      <div className={styles.videoWrapper}>
        {src ? (
          <video
            ref={videoRef}
            className={styles.video}
            src={src}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              setIsPlaying(false);
              onEnded?.();
            }}
            onClick={togglePlay}
          />
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>🎬</div>
            <p>لا يوجد فيديو</p>
            <p className={styles.hint}>اسحب ملف فيديو هنا أو اختر من المكتبة</p>
          </div>
        )}
        
        {/* Subtitle overlay would go here */}
      </div>
      
      {/* Controls */}
      <div className={`${styles.controls} ${showControls || !isPlaying ? styles.visible : ''}`}>
        {/* Progress bar */}
        <div className={styles.progressContainer}>
          <input
            type="range"
            className={styles.progressBar}
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
          />
          <div 
            className={styles.progressFilled}
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        
        <div className={styles.controlButtons}>
          <div className={styles.leftControls}>
            <button onClick={skipBack} title="رجوع 5 ثواني">
              ⏪
            </button>
            
            <button onClick={togglePlay} className={styles.playBtn}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <button onClick={skipForward} title="تقدم 5 ثواني">
              ⏩
            </button>
            
            <div className={styles.volumeControl}>
              <button onClick={toggleMute}>
                {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </button>
              <input
                type="range"
                className={styles.volumeSlider}
                min={0}
                max={1}
                step={0.1}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
              />
            </div>
            
            <span className={styles.time}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className={styles.rightControls}>
            <select 
              className={styles.speedSelect}
              value={playbackRate}
              onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
            >
              <option value="0.25">0.25x</option>
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
            
            <button onClick={toggleFullscreen}>
              {isFullscreen ? '⊖' : '⛶'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
