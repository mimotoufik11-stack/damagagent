import React from 'react';
import { useLoadingStore } from '../../stores/uiStore';
import styles from './LoadingOverlay.module.css';

const LoadingOverlay: React.FC = () => {
  const { global, project, media, export: exportLoading, ai, messages } = useLoadingStore();

  const isLoading = global || project || media || exportLoading || ai;
  const message = messages.global || messages.project || messages.media || messages.export || messages.ai || 'جاري المعالجة...';

  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.spinner} />
        <p className={styles.message}>{message}</p>
        {(global || project) && (
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '30%' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
