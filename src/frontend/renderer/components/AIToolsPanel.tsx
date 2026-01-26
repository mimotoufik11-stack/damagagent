import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore, useToastStore } from '../../stores/uiStore';
import styles from './AIToolsPanel.module.css';

const AIToolsPanel: React.FC = () => {
  const { currentProject } = useProjectStore();
  const { addToast } = useToastStore();
  
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);

  const handleTranscribe = async () => {
    if (!currentProject) return;
    
    setIsTranscribing(true);
    setTranscriptionProgress(0);
    setActiveTool('transcribe');
    
    try {
      // Simulate transcription process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setTranscriptionProgress(i);
      }
      
      setTranscription('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\n\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\n\nالرَّحْمَنِ الرَّحِيمِ\n\nمَالِكِ يَوْمِ الدِّينِ\n\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ');
      
      addToast({
        type: 'success',
        title: 'اكتمل النسخ',
        message: 'تم نسخ الصوت إلى نص بنجاح',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'خطأ في النسخ',
        message: 'حدث خطأ أثناء نسخ الصوت',
      });
    } finally {
      setIsTranscribing(false);
      setActiveTool(null);
    }
  };

  const handleGenerateSubtitles = async () => {
    if (!transcription) {
      addToast({
        type: 'warning',
        title: 'تحذير',
        message: 'يرجى النسخ أولاً',
      });
      return;
    }
    
    addToast({
      type: 'success',
        title: 'تم إنشاء الترجمات',
        message: 'تم إنشاء الترجمات التلقائية',
      });
  };

  const handleGenerateDubbing = async () => {
    addToast({
      type: 'success',
      title: 'جاري إنشاء الدبلجة',
      message: 'سيتم إشعارك عند اكتمال العملية',
    });
  };

  const tools = [
    {
      id: 'transcribe',
      icon: '🎤',
      title: 'نسخ صوتي',
      description: 'تحويل الصوت إلى نص',
      color: '#3b82f6',
    },
    {
      id: 'subtitles',
      icon: '📝',
      title: 'إنشاء ترجمات',
      description: 'ترجمات تلقائية',
      color: '#10b981',
    },
    {
      id: 'dubbing',
      icon: '🔊',
      title: 'دبلجة',
      description: 'إنتاج صوتي',
      color: '#f59e0b',
    },
    {
      id: 'noise',
      icon: '🔇',
      title: 'إزالة الضوضاء',
      description: 'تنظيف الصوت',
      color: '#8b5cf6',
    },
    {
      id: 'verse',
      icon: '☪️',
      title: 'تعرف على الآيات',
      description: 'تعرف على القرآن',
      color: '#059669',
    },
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>أدوات الذكاء الاصطناعي</h3>
      </div>
      
      <div className={styles.tools}>
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`${styles.tool} ${activeTool === tool.id ? styles.active : ''}`}
            onClick={() => setActiveTool(tool.id)}
            style={{ '--tool-color': tool.color } as React.CSSProperties}
          >
            <span className={styles.toolIcon}>{tool.icon}</span>
            <div className={styles.toolInfo}>
              <span className={styles.toolTitle}>{tool.title}</span>
              <span className={styles.toolDesc}>{tool.description}</span>
            </div>
          </button>
        ))}
      </div>
      
      {activeTool === 'transcribe' && (
        <div className={styles.toolPanel}>
          <h4>نسخ صوتي</h4>
          
          {isTranscribing ? (
            <div className={styles.progress}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${transcriptionProgress}%` }}
                />
              </div>
              <span className={styles.progressText}>
                جاري النسخ... {transcriptionProgress}%
              </span>
            </div>
          ) : (
            <>
              <p className={styles.description}>
                تحويل الصوت إلى نص باستخدام تقنية Whisper
              </p>
              
              <button 
                className={styles.actionBtn}
                onClick={handleTranscribe}
                disabled={!currentProject}
              >
                🎤 بدء النسخ
              </button>
              
              {transcription && (
                <div className={styles.result}>
                  <h5>النتيجة:</h5>
                  <div className={styles.textOutput}>
                    {transcription}
                  </div>
                  <button 
                    className={styles.actionBtn}
                    onClick={handleGenerateSubtitles}
                  >
                    📝 إنشاء ترجمات
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {activeTool === 'dubbing' && (
        <div className={styles.toolPanel}>
          <h4>دبلجة صوتية</h4>
          <p className={styles.description}>
            إنشاء dubbing بصوت طبيعي باستخدام Coqui TTS
          </p>
          <textarea 
            className={styles.textInput}
            placeholder="أدخل النص للتحويل إلى صوت..."
            rows={4}
          />
          <button 
            className={styles.actionBtn}
            onClick={handleGenerateDubbing}
          >
            🔊 إنشاء الصوت
          </button>
        </div>
      )}
      
      {activeTool === 'noise' && (
        <div className={styles.toolPanel}>
          <h4>إزالة الضوضاء</h4>
          <p className={styles.description}>
            تنظيف الصوت من الضوضاء الخلفية
          </p>
          <div className={styles.sliderControl}>
            <label>شدة الإزالة: 50%</label>
            <input type="range" min="0" max="100" defaultValue="50" />
          </div>
          <button className={styles.actionBtn}>
            🔇 إزالة الضوضاء
          </button>
        </div>
      )}
    </div>
  );
};

export default AIToolsPanel;
