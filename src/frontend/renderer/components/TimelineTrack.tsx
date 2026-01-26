import React from 'react';
import { Track } from '../../stores/editorStore';
import styles from './TimelineTrack.module.css';

interface TimelineTrackProps {
  track: Track;
  pixelsPerSecond: number;
  snapEnabled: boolean;
  children?: React.ReactNode;
}

const TimelineTrack: React.FC<TimelineTrackProps> = ({
  track,
  pixelsPerSecond,
  snapEnabled,
  children,
}) => {
  const trackTypeColors = {
    video: 'rgba(59, 130, 246, 0.2)',
    audio: 'rgba(16, 185, 129, 0.2)',
    subtitle: 'rgba(245, 158, 11, 0.2)',
  };

  const trackTypeBorders = {
    video: '#3b82f6',
    audio: '#10b981',
    subtitle: '#f59e0b',
  };

  return (
    <div 
      className={`${styles.track} ${track.is_locked ? styles.locked : ''} ${track.is_hidden ? styles.hidden : ''}`}
      style={{
        height: `${track.height}px`,
        backgroundColor: track.is_hidden ? 'transparent' : trackTypeColors[track.type],
        borderColor: trackTypeBorders[track.type],
      }}
    >
      {children}
    </div>
  );
};

export default TimelineTrack;
