import React, { useEffect } from 'react';
import { useModalStore } from '../../stores/uiStore';
import styles from './Modal.module.css';

const Modal: React.FC = () => {
  const { type, isOpen, data, closeModal } = useModalStore();

  if (!isOpen || type === 'none') return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'newProject':
        return (
          <div className={styles.modalContent}>
            <h2>مشروع جديد</h2>
            <p>سيتم إضافة نموذج إنشاء مشروع جديد</p>
          </div>
        );
      case 'export':
        return (
          <div className={styles.modalContent}>
            <h2>تصدير الفيديو</h2>
            <p>سيتم إضافة نافذة التصدير</p>
          </div>
        );
      case 'about':
        return (
          <div className={styles.modalContent}>
            <h2>عن التطبيق</h2>
            <div className={styles.aboutContent}>
              <span className={styles.logo}>☪️</span>
              <h3>دماج للقرآن الكريم</h3>
              <p>الإصدار 1.0.0</p>
              <p className={styles.description}>
                استوديو مونتاج احترافي متخصص في إنتاج محتوى قرآني
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.modalContent}>
            <h2>{type}</h2>
            <p>محتوى النافذة</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={closeModal}>
          ×
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default Modal;
