import React, { useMemo } from 'react';
import styles from './TimelineRuler.module.css';

interface TimelineRulerProps {
  duration: number;
  zoom: number;
  pixelsPerSecond: number;
  currentTime: number;
}

const TimelineRuler: React.FC<TimelineRulerProps> = ({
  duration,
  zoom,
  pixelsPerSecond,
  currentTime,
}) => {
  const markers = useMemo(() => {
    const result: { time: number; label: string; isMajor: boolean }[] = [];
    
    // Calculate marker interval based on zoom
    let interval: number;
    let subInterval: number;
    
    if (zoom > 2) {
      interval = 1; // 1 second
      subInterval = 0.1; // 0.1 second
    } else if (zoom > 1) {
      interval = 5; // 5 seconds
      subInterval = 1; // 1 second
    } else {
      interval = 10; // 10 seconds
      subInterval = 2; // 2 seconds
    }
    
    // Generate markers
    for (let time = 0; time <= duration; time += subInterval) {
      const isMajor = Math.abs(time % interval) < 0.01;
      const label = isMajor ? formatTime(time) : '';
      
      result.push({
        time,
        label,
        isMajor,
      });
    }
    
    return result;
  }, [duration, zoom]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.ruler} style={{ width: duration * pixelsPerSecond }}>
      {markers.map((marker, index) => (
        <div
          key={index}
          className={`${styles.marker} ${marker.isMajor ? styles.major : styles.minor}`}
          style={{ left: marker.time * pixelsPerSecond }}
        >
          {marker.isMajor && (
            <span className={styles.label}>{marker.label}</span>
          )}
        </div>
      ))}
      
      {/* Current time indicator in ruler */}
      <div 
        className={styles.currentIndicator}
        style={{ left: currentTime * pixelsPerSecond }}
      />
    </div>
  );
};

export default TimelineRuler;
