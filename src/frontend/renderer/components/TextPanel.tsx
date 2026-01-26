import React, { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import styles from './TextPanel.module.css';

const TextPanel: React.FC = () => {
  const { clips, selectedClipIds, updateClip } = useEditorStore();
  const selectedClip = clips.find(c => selectedClipIds.includes(c.id));
  
  const [subtitleText, setSubtitleText] = useState('');
  const [fontName, setFontName] = useState('Amiri');
  const [fontSize, setFontSize] = useState(48);
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [position, setPosition] = useState('bottom');

  const fonts = [
    'Amiri',
    'Scheherazade',
    'Arial',
    'Tahoma',
    'Traditional Arabic',
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>النص والترجمات</h3>
      </div>
      
      <div className={styles.content}>
        <div className={styles.section}>
          <h4>إضافة نص</h4>
          <textarea
            className={styles.textarea}
            placeholder="أدخل النص هنا..."
            value={subtitleText}
            onChange={(e) => setSubtitleText(e.target.value)}
            rows={3}
          />
          <button className={styles.addBtn}>
            ➕ إضافة إلى الجدول الزمني
          </button>
        </div>
        
        <div className={styles.section}>
          <h4>نمط النص</h4>
          
          <div className={styles.field}>
            <label>الخط</label>
            <select 
              value={fontName}
              onChange={(e) => setFontName(e.target.value)}
              className={styles.select}
            >
              {fonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.field}>
            <label>حجم الخط: {fontSize}px</label>
            <input
              type="range"
              min="12"
              max="120"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className={styles.slider}
            />
          </div>
          
          <div className={styles.field}>
            <label>لون النص</label>
            <div className={styles.colorRow}>
              <input
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className={styles.colorInput}
              />
              <span className={styles.colorValue}>{fontColor}</span>
            </div>
          </div>
          
          <div className={styles.field}>
            <label>لون الخلفية</label>
            <div className={styles.colorRow}>
              <input
                type="color"
                value={backgroundColor || '#000000'}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className={styles.colorInput}
              />
              <span className={styles.colorValue}>{backgroundColor || 'بدون'}</span>
            </div>
          </div>
          
          <div className={styles.field}>
            <label>لون الحدود</label>
            <div className={styles.colorRow}>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className={styles.colorInput}
              />
              <span className={styles.colorValue}>{strokeColor}</span>
            </div>
          </div>
          
          <div className={styles.field}>
            <label>عرض الحدود: {strokeWidth}px</label>
            <input
              type="range"
              min="0"
              max="10"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              className={styles.slider}
            />
          </div>
          
          <div className={styles.field}>
            <label>الموقع</label>
            <div className={styles.positionBtns}>
              {['top', 'center', 'bottom'].map(pos => (
                <button
                  key={pos}
                  className={`${styles.posBtn} ${position === pos ? styles.active : ''}`}
                  onClick={() => setPosition(pos)}
                >
                  {pos === 'top' ? '⬆️ علوي' : pos === 'center' ? '⬜ وسط' : '⬇️ سفلي'}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles.section}>
          <h4>معاينة</h4>
          <div 
            className={styles.preview}
            style={{
              fontFamily: fontName,
              fontSize: `${fontSize}px`,
              color: fontColor,
              backgroundColor: backgroundColor || 'transparent',
              WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
            }}
          >
            {subtitleText || 'النص المعاينة'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextPanel;
