import React, { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import styles from './PropertiesPanel.module.css';

const PropertiesPanel: React.FC = () => {
  const { clips, selectedClipIds, updateClip } = useEditorStore();
  const selectedClip = clips.find(c => selectedClipIds.includes(c.id));
  
  const [localValues, setLocalValues] = useState({
    name: selectedClip?.name || '',
    volume: selectedClip?.volume || 1,
    opacity: selectedClip?.opacity || 1,
    speed: selectedClip?.speed || 1,
  });

  const handleChange = (key: string, value: number | string) => {
    setLocalValues(prev => ({ ...prev, [key]: value }));
    
    if (selectedClip) {
      updateClip(selectedClip.id, { [key]: value });
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>الخصائص</h3>
      </div>
      
      {!selectedClip ? (
        <div className={styles.empty}>
          <p>اختر عنصراً من الجدول الزمني</p>
          <p className={styles.hint}>سيظهر هنا خصائص العنصر المحدد</p>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.section}>
            <h4>معلومات أساسية</h4>
            
            <div className={styles.field}>
              <label>الاسم</label>
              <input
                type="text"
                value={localValues.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
          
          <div className={styles.section}>
            <h4>تحويل</h4>
            
            <div className={styles.field}>
              <label>الموقع X</label>
              <input
                type="number"
                value="0"
                readOnly
                className={styles.input}
              />
            </div>
            
            <div className={styles.field}>
              <label>الموقع Y</label>
              <input
                type="number"
                value="0"
                readOnly
                className={styles.input}
              />
            </div>
            
            <div className={styles.field}>
              <label>العرض</label>
              <input
                type="number"
                value="100"
                readOnly
                className={styles.input}
              />
            </div>
            
            <div className={styles.field}>
              <label>الارتفاع</label>
              <input
                type="number"
                value="100"
                readOnly
                className={styles.input}
              />
            </div>
          </div>
          
          <div className={styles.section}>
            <h4>صوتي</h4>
            
            <div className={styles.field}>
              <label>الصوت: {Math.round(localValues.volume * 100)}%</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={localValues.volume}
                onChange={(e) => handleChange('volume', parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>
          
          {selectedClip.track_type === 'video' && (
            <div className={styles.section}>
              <h4>مرئي</h4>
              
              <div className={styles.field}>
                <label>العتامة: {Math.round(localValues.opacity * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={localValues.opacity}
                  onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.field}>
                <label>السرعة: {localValues.speed}x</label>
                <input
                  type="range"
                  min="0.25"
                  max="4"
                  step="0.25"
                  value={localValues.speed}
                  onChange={(e) => handleChange('speed', parseFloat(e.target.value))}
                  className={styles.slider}
                />
              </div>
            </div>
          )}
          
          <div className={styles.section}>
            <h4>معلومات</h4>
            
            <div className={styles.infoRow}>
              <span>المدة:</span>
              <span>{selectedClip.duration.toFixed(2)}s</span>
            </div>
            
            <div className={styles.infoRow}>
              <span>البداية:</span>
              <span>{selectedClip.start_time.toFixed(2)}s</span>
            </div>
            
            <div className={styles.infoRow}>
              <span>النهاية:</span>
              <span>{(selectedClip.start_time + selectedClip.duration).toFixed(2)}s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesPanel;
