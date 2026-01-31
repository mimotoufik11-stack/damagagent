import React, { useRef, useEffect, useState } from 'react';

function Timeline({ 
  duration, 
  currentTime, 
  captions, 
  selectedCaption,
  onSeek,
  onSelectCaption 
}) {
  const timelineRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleSeek(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleSeek(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSeek = (e) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const time = percentage * duration;
    
    onSeek(time);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const timeMarkers = [];
  const markerInterval = duration > 60 ? 10 : 5;
  for (let i = 0; i <= duration; i += markerInterval) {
    timeMarkers.push(i);
  }

  return (
    <div className="h-full bg-dark-900 p-4">
      <div className="h-full flex flex-col">
        {/* Time Ruler */}
        <div className="relative h-8 bg-dark-800 rounded-t border-b border-dark-700">
          {timeMarkers.map(time => {
            const position = (time / duration) * 100;
            return (
              <div
                key={time}
                className="absolute top-0 h-full flex flex-col items-center"
                style={{ left: `${position}%` }}
              >
                <div className="w-px h-2 bg-dark-500"></div>
                <span className="text-xs text-dark-500 mt-1">{formatTime(time)}</span>
              </div>
            );
          })}
        </div>

        {/* Timeline Track */}
        <div
          ref={timelineRef}
          className="relative flex-1 bg-dark-800 rounded-b cursor-pointer"
          onMouseDown={handleMouseDown}
        >
          {/* Captions Track */}
          <div className="relative h-full p-2">
            {captions.map(caption => {
              const left = (caption.startTime / duration) * 100;
              const width = ((caption.endTime - caption.startTime) / duration) * 100;
              const isSelected = selectedCaption?.id === caption.id;

              return (
                <div
                  key={caption.id}
                  className={`absolute h-8 rounded cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-primary-500 ring-2 ring-primary-400' 
                      : 'bg-primary-600/70 hover:bg-primary-500/90'
                  }`}
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    top: '8px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCaption(caption);
                  }}
                  title={caption.text}
                >
                  <div className="px-2 py-1 text-xs truncate">
                    {caption.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        </div>

        {/* Time Display */}
        <div className="flex items-center justify-between text-sm text-dark-400 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
