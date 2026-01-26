import React, { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import styles from './AudioPanel.module.css';

const AudioPanel: React.FC = () => {
  const { tracks, clips, updateTrack, updateClip } = useEditorStore();
  const audioTracks = tracks.filter(t => t.type === 'audio');
  
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);
  const [pan, setPan] = useState(0);
  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);

  const handleVolumeChange = (trackId: string, value: number) => {
    updateTrack(trackId, { is_muted: value === 0 });
    const trackClips = clips.filter(c => c.track_id === trackId);
    trackClips.forEach(clip => updateClip(clip.id, { volume: value }));
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>الصوت</h3>
      </div>
      
      <div className={styles.content}>
        <div className={styles.mixer}>
          <h4>مزيج الصوت</h4>
          
          {audioTracks.map(track => (
            <div 
              key={track.id} 
              className={`${styles.trackRow} ${selectedTrack === track.id ? styles.selected : ''}`}
              onClick={() => setSelectedTrack(track.id)}
            >
              <div className={styles.trackInfo}>
                <span className={styles.trackName}>{track.name}</span>
                <span className={styles.trackStatus}>
                  {track.is_muted ? '🔇' : '🔊'}
                </span>
              </div>
              
              <div className={styles.fader}>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  defaultValue="1"
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                  className={styles.faderInput}
                />
                <div className={styles.faderLabels}>
                  <span>0</span>
                  <span>1</span>
                  <span>2</span>
                </div>
              </div>
              
              <div className={styles.trackMeter}>
                <div className={styles.meterBar} style={{ height: '60%' }} />
                <div className={styles.meterBar} style={{ height: '55%' }} />
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.effects}>
          <h4>تأثيرات الصوت</h4>
          
          <div className={styles.effectList}>
            <div className={styles.effectItem}>
              <span>📈 معادلة الترددات</span>
              <button className={styles.effectBtn}>+</button>
            </div>
            
            <div className={styles.effectItem}>
              <span>🔊 ضغط الصوت</span>
              <button className={styles.effectBtn}>+</button>
            </div>
            
            <div className={styles.effectItem}>
              <span>🌊 صدى</span>
              <button className={styles.effectBtn}>+</button>
            </div>
            
            <div className={styles.effectItem}>
              <span>🎚️ تأخير</span>
              <button className={styles.effectBtn}>+</button>
            </div>
          </div>
        </div>
        
        {selectedTrack && (
          <div className={styles.trackDetails}>
            <h4>تفاصيل المسار</h4>
            
            <div className={styles.detailField}>
              <label>التوازن</label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={pan}
                onChange={(e) => setPan(parseFloat(e.target.value))}
                className={styles.slider}
              />
              <span>{pan < 0 ? `L${Math.abs(pan * 100).toFixed(0)}` : pan > 0 ? `R${(pan * 100).toFixed(0)}` : 'C'}</span>
            </div>
            
            <div className={styles.detailField}>
              <label>تلاشي داخلي: {fadeIn}s</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={fadeIn}
                onChange={(e) => setFadeIn(parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>
            
            <div className={styles.detailField}>
              <label>تلاشي خارجي: {fadeOut}s</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={fadeOut}
                onChange={(e) => setFadeOut(parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPanel;
