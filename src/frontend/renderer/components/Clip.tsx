import React, { useRef, useState, useCallback } from 'react';
import { Clip } from '../../stores/editorStore';
import styles from './Clip.module.css';

interface ClipComponentProps {
  clip: Clip;
  pixelsPerSecond: number;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onMove: (time: number, targetTrackId?: string) => void;
}

const ClipComponent: React.FC<ClipComponentProps> = ({
  clip,
  pixelsPerSecond,
  isSelected,
  onSelect,
  onMove,
}) => {
  const clipRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<'left' | 'right' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, time: 0 });

  const clipWidth = clip.duration * pixelsPerSecond;
  const clipLeft = clip.start_time * pixelsPerSecond;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(e);
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      time: clip.start_time,
    });
  }, [clip.start_time, onSelect]);

  const handleResizeStart = useCallback((e: React.MouseEvent, side: 'left' | 'right') => {
    e.stopPropagation();
    setIsResizing(side);
    setDragStart({
      x: e.clientX,
      time: side === 'left' ? clip.start_time : clip.start_time + clip.duration,
    });
  }, [clip.start_time, clip.duration]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && clipRef.current) {
      const deltaX = e.clientX - dragStart.x;
      const deltaTime = deltaX / pixelsPerSecond;
      const newTime = Math.max(0, dragStart.time + deltaTime);
      onMove(newTime);
    } else if (isResizing && clipRef.current) {
      const deltaX = e.clientX - dragStart.x;
      const deltaTime = deltaX / pixelsPerSecond;
      
      if (isResizing === 'left') {
        const newStart = Math.max(0, dragStart.time + deltaTime);
        if (newStart < clip.start_time + clip.duration - 0.1) {
          onMove(newStart);
        }
      } else {
        const newEnd = dragStart.time + deltaTime;
        if (newEnd > clip.start_time + 0.1) {
          onMove(clip.start_time, undefined, newEnd - clip.start_time);
        }
      }
    }
  }, [isDragging, isResizing, dragStart, pixelsPerSecond, clip.start_time, onMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(null);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const trackTypeColors: Record<string, { bg: string; border: string }> = {
    video: { bg: '#3b82f6', border: '#2563eb' },
    audio: { bg: '#10b981', border: '#059669' },
    subtitle: { bg: '#f59e0b', border: '#d97706' },
  };

  const colors = trackTypeColors[clip.track_type] || trackTypeColors.video;

  return (
    <div
      ref={clipRef}
      className={`${styles.clip} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
      style={{
        left: `${clipLeft}px`,
        width: `${clipWidth}px`,
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Resize handles */}
      <div
        className={`${styles.resizeHandle} ${styles.leftHandle}`}
        onMouseDown={(e) => handleResizeStart(e, 'left')}
      />
      <div
        className={`${styles.resizeHandle} ${styles.rightHandle}`}
        onMouseDown={(e) => handleResizeStart(e, 'right')}
      />
      
      {/* Clip content */}
      <div className={styles.content}>
        {clip.thumbnail_path ? (
          <div 
            className={styles.thumbnail}
            style={{ backgroundImage: `url(${clip.thumbnail_path})` }}
          />
        ) : (
          <span className={styles.name}>{clip.name}</span>
        )}
        
        {/* Audio waveform would go here */}
        {clip.track_type === 'audio' && (
          <div className={styles.waveform}>
            <svg viewBox="0 0 100 20" preserveAspectRatio="none">
              <path
                d="M0,10 Q5,0 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T80,10 T90,10 T100,10"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
              />
            </svg>
          </div>
        )}
      </div>
      
      {/* Duration label */}
      <span className={styles.duration}>
        {formatDuration(clip.duration)}
      </span>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className={styles.selectionBorder} />
      )}
    </div>
  );
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default ClipComponent;
