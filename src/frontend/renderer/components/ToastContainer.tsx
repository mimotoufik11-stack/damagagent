import React from 'react';
import { useToastStore } from '../../stores/uiStore';
import styles from './ToastContainer.module.css';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          onClick={() => removeToast(toast.id)}
        >
          <span className={styles.icon}>{getIcon(toast.type)}</span>
          <div className={styles.content}>
            <span className={styles.title}>{toast.title}</span>
            {toast.message && (
              <span className={styles.message}>{toast.message}</span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={(e) => {
            e.stopPropagation();
            removeToast(toast.id);
          }}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
