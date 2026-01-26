import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../stores/settingsStore';
import { useProjectStore } from '../../stores/projectStore';
import styles from './TitleBar.module.css';

const TitleBar: React.FC = () => {
  const navigate = useNavigate();
  const { currentProject } = useProjectStore();
  const { settings } = useSettingsStore();

  const handleMinimize = () => {
    window.electronAPI?.window.minimize?.();
  };

  const handleMaximize = () => {
    window.electronAPI?.window.maximize?.();
  };

  const handleClose = () => {
    window.electronAPI?.window.close?.();
  };

  return (
    <div className={styles.titleBar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>☪</span>
          <span className={styles.logoText}>دماج للقرآن الكريم</span>
        </div>
        {currentProject && (
          <div className={styles.projectName}>
            <span className={styles.separator}>|</span>
            <span>{currentProject.name}</span>
          </div>
        )}
      </div>
      
      <div className={styles.center}>
        {/* Menu bar placeholder */}
        <div className={styles.menuBar}>
          <button onClick={() => navigate('/')}>الرئيسية</button>
          <button onClick={() => navigate('/new')}>مشروع جديد</button>
          <button onClick={() => navigate('/fonts')}>الخطوط</button>
          <button onClick={() => navigate('/settings')}>الإعدادات</button>
        </div>
      </div>
      
      <div className={styles.right}>
        <div className={styles.windowControls}>
          <button 
            className={`${styles.controlBtn} ${styles.minimize}`}
            onClick={handleMinimize}
            title="تصغير"
          >
            <span>─</span>
          </button>
          <button 
            className={`${styles.controlBtn} ${styles.maximize}`}
            onClick={handleMaximize}
            title="تكبير"
          >
            <span>□</span>
          </button>
          <button 
            className={`${styles.controlBtn} ${styles.close}`}
            onClick={handleClose}
            title="إغلاق"
          >
            <span>✕</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
