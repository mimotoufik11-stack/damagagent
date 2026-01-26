import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useEditorStore, Track, Clip } from '../../stores/editorStore';
import TimelineTrack from './TimelineTrack';
import ClipComponent from './Clip';
import TimelineRuler from './TimelineRuler';
import styles from './Timeline.module.css';

const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const {
    tracks,
    clips,
    currentTime,
    duration,
    zoom,
    scrollPosition,
    selectedClipIds,
    snapEnabled,
    playbackRate,
    isPlaying,
    setCurrentTime,
    setZoom,
    setScrollPosition,
    selectClip,
    selectClips,
    deselectClip,
    clearSelection,
    moveClip,
    setIsPlaying,
  } = useEditorStore();

  const pixelsPerSecond = 50 * zoom;
  const timelineWidth = duration * pixelsPerSecond;

  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains(styles.ruler)) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = e.clientX - rect.left + scrollPosition;
      const time = Math.max(0, x / pixelsPerSecond);
      
      setCurrentTime(time);
      clearSelection();
    }
  }, [pixelsPerSecond, scrollPosition, setCurrentTime, clearSelection]);

  const handleZoom = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(zoom + delta);
    }
  }, [zoom, setZoom]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        setIsPlaying(!isPlaying);
        break;
      case 'ArrowLeft':
        setCurrentTime(Math.max(0, currentTime - 1));
        break;
      case 'ArrowRight':
        setCurrentTime(currentTime + 1);
        break;
      case 'Home':
        setCurrentTime(0);
        break;
      case 'End':
        setCurrentTime(duration);
        break;
      case 'Delete':
      case 'Backspace':
        selectedClipIds.forEach(id => {
          useEditorStore.getState().deleteClip(id);
        });
        clearSelection();
        break;
      case 'a':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          selectClips(clips.map(c => c.id));
        }
        break;
      case 'Escape':
        clearSelection();
        break;
    }
  }, [currentTime, duration, isPlaying, selectedClipIds, clips, setCurrentTime, setIsPlaying, selectClips, clearSelection]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getClipsForTrack = (trackId: string): Clip[] => {
    return clips
      .filter(clip => clip.track_id === trackId)
      .sort((a, b) => a.start_time - b.start_time);
  };

  const handleClipMove = useCallback((clipId: number, startTime: number, targetTrackId?: string) => {
    if (snapEnabled) {
      startTime = Math.round(startTime / 0.1) * 0.1;
    }
    moveClip(clipId, startTime, targetTrackId);
  }, [snapEnabled, moveClip]);

  return (
    <div 
      ref={containerRef}
      className={styles.timeline}
      onWheel={handleZoom}
      onClick={handleTimelineClick}
    >
      {/* Timeline header */}
      <div className={styles.header}>
        <div className={styles.trackLabels}>
          {tracks.map(track => (
            <div key={track.id} className={styles.trackLabel}>
              <span className={styles.trackName}>{track.name}</span>
              <div className={styles.trackControls}>
                <button 
                  className={`${styles.trackBtn} ${track.is_muted ? styles.active : ''}`}
                  title="كتم"
                >
                  {track.is_muted ? '🔇' : '🔊'}
                </button>
                <button 
                  className={`${styles.trackBtn} ${track.is_hidden ? styles.active : ''}`}
                  title="إخفاء"
                >
                  👁️
                </button>
                <button 
                  className={`${styles.trackBtn} ${track.is_locked ? styles.active : ''}`}
                  title="قفل"
                >
                  🔒
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Timeline content */}
      <div 
        className={styles.content}
        style={{ width: timelineWidth + 'px' }}
      >
        {/* Time ruler */}
        <div className={styles.rulerContainer}>
          <TimelineRuler 
            duration={duration}
            zoom={zoom}
            pixelsPerSecond={pixelsPerSecond}
            currentTime={currentTime}
          />
        </div>
        
        {/* Tracks */}
        <div className={styles.tracks}>
          {tracks.map(track => (
            <TimelineTrack
              key={track.id}
              track={track}
              pixelsPerSecond={pixelsPerSecond}
              snapEnabled={snapEnabled}
            >
              {getClipsForTrack(track.id).map(clip => (
                <ClipComponent
                  key={clip.id}
                  clip={clip}
                  pixelsPerSecond={pixelsPerSecond}
                  isSelected={selectedClipIds.includes(clip.id)}
                  onSelect={(e) => {
                    e.stopPropagation();
                    if (e.shiftKey) {
                      selectClip(clip.id);
                    } else {
                      selectClips([clip.id]);
                    }
                  }}
                  onMove={(time, targetTrackId) => handleClipMove(clip.id, time, targetTrackId)}
                />
              ))}
            </TimelineTrack>
          ))}
        </div>
        
        {/* Playhead */}
        <div 
          className={styles.playhead}
          style={{ left: currentTime * pixelsPerSecond + 'px' }}
        >
          <div className={styles.playheadHead} />
          <div className={styles.playheadLine} />
        </div>
      </div>
      
      {/* Zoom controls */}
      <div className={styles.zoomControls}>
        <button onClick={() => setZoom(zoom - 0.2)}>−</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(zoom + 0.2)}>+</button>
      </div>
    </div>
  );
};

export default Timeline;
