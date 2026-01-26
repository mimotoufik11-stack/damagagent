import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import PropertiesPanel from './PropertiesPanel';
import TextPanel from './TextPanel';
import AudioPanel from './AudioPanel';
import ExportPanel from './ExportPanel';
import styles from './RightPanel.module.css';

const tabs = [
  { id: 'properties', label: 'الخصائص', icon: '⚙️' },
  { id: 'text', label: 'النص', icon: '📝' },
  { id: 'audio', label: 'الصوت', icon: '🔊' },
  { id: 'export', label: 'تصدير', icon: '💾' },
];

const RightPanel: React.FC = () => {
  const { activeRightTab, setActiveRightTab } = useUIStore();

  const renderContent = () => {
    switch (activeRightTab) {
      case 'properties':
        return <PropertiesPanel />;
      case 'text':
        return <TextPanel />;
      case 'audio':
        return <AudioPanel />;
      case 'export':
        return <ExportPanel />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.rightPanel}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeRightTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveRightTab(tab.id)}
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

export default RightPanel;
