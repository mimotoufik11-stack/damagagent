import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../stores/uiStore';
import MediaLibrary from './MediaLibrary';
import AIToolsPanel from './AIToolsPanel';
import styles from './Sidebar.module.css';

const tabs = [
  { id: 'media', label: 'المكتبة', icon: '📁' },
  { id: 'effects', label: 'التأثيرات', icon: '✨' },
  { id: 'ai', label: 'أدوات AI', icon: '🤖' },
  { id: 'transitions', label: 'الانتقالات', icon: '🔀' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { activeLeftTab, setActiveLeftTab } = useUIStore();

  const renderContent = () => {
    switch (activeLeftTab) {
      case 'media':
        return <MediaLibrary />;
      case 'ai':
        return <AIToolsPanel />;
      case 'effects':
        return (
          <div className={styles.tabContent}>
            <h3>التأثيرات</h3>
            <p className={styles.placeholder}>قائمة التأثيرات قادمة...</p>
          </div>
        );
      case 'transitions':
        return (
          <div className={styles.tabContent}>
            <h3>الانتقالات</h3>
            <p className={styles.placeholder}>قائمة الانتقالات قادمة...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeLeftTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveLeftTab(tab.id)}
            title={tab.label}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Sidebar;
