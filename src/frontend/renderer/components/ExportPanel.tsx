import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useToastStore } from '../../stores/uiStore';
import styles from './ExportPanel.module.css';

const ExportPanel: React.FC = () => {
  const { currentProject } = useProjectStore();
  const { addToast } = useToastStore();
  
  const [format, setFormat] = useState('mp4');
  const [resolution, setResolution] = useState('1920x1080');
  const [fps, setFps] = useState(30);
  const [quality, setQuality] = useState('high');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const resolutions = [
    { value: '1280x720', label: '720p (HD)' },
    { value: '1920x1080', label: '1080p (Full HD)' },
    { value: '3840x2160', label: '4K (Ultra HD)' },
  ];

  const qualities = [
    { value: 'low', label: 'منخفض', description: 'حجم صغير' },
    { value: 'medium', label: 'متوسط', description: 'جودة متوازنة' },
    { value: 'high', label: 'عالي', description: 'جودة عالية' },
    { value: 'ultra', label: 'فائق', description: 'أفضل جودة' },
  ];

  const handleExport = async () => {
    if (!currentProject) {
      addToast({
        type: 'warning',
        title: 'تحذير',
        message: 'لا يوجد مشروع مفتوح',
      });
      return;
    }
    
    setIsExporting(true);
    setProgress(0);
    
    try {
      // Simulate export process
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }
      
      addToast({
        type: 'success',
        title: 'اكتمل التصدير',
        message: `تم تصدير الفيديو بنجاح`,
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'خطأ في التصدير',
        message: 'حدث خطأ أثناء تصدير الفيديو',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>تصدير الفيديو</h3>
      </div>
      
      <div className={styles.content}>
        <div className={styles.section}>
          <h4>الصيغة</h4>
          <div className={styles.formatGrid}>
            {['mp4', 'webm', 'mov'].map(f => (
              <button
                key={f}
                className={`${styles.formatBtn} ${format === f ? styles.active : ''}`}
                onClick={() => setFormat(f)}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.section}>
          <h4>الدقة</h4>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className={styles.select}
          >
            {resolutions.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.section}>
          <h4>عدد الإطارات</h4>
          <div className={styles.fpsBtns}>
            {[24, 30, 60].map(f => (
              <button
                key={f}
                className={`${styles.fpsBtn} ${fps === f ? styles.active : ''}`}
                onClick={() => setFps(f)}
              >
                {f} FPS
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.section}>
          <h4>الجودة</h4>
          <div className={styles.qualityGrid}>
            {qualities.map(q => (
              <button
                key={q.value}
                className={`${styles.qualityBtn} ${quality === q.value ? styles.active : ''}`}
                onClick={() => setQuality(q.value)}
              >
                <span className={styles.qualityLabel}>{q.label}</span>
                <span className={styles.qualityDesc}>{q.description}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.summary}>
          <h4>ملخص الإعدادات</h4>
          <div className={styles.summaryRow}>
            <span>الصيغة:</span>
            <span>{format.toUpperCase()}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>الدقة:</span>
            <span>{resolution}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>عدد الإطارات:</span>
            <span>{fps} FPS</span>
          </div>
          <div className={styles.summaryRow}>
            <span>الجودة:</span>
            <span>{qualities.find(q => q.value === quality)?.label}</span>
          </div>
        </div>
        
        {isExporting ? (
          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={styles.progressText}>
              جاري التصدير... {progress}%
            </span>
          </div>
        ) : (
          <button 
            className={styles.exportBtn}
            onClick={handleExport}
            disabled={!currentProject}
          >
            💾 تصدير الفيديو
          </button>
        )}
      </div>
    </div>
  );
};

export default ExportPanel;
