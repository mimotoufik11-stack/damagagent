import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FontsPage.module.css';

interface Font {
  id: number;
  name: string;
  displayName: string;
  category: string;
  isDefault: boolean;
  isDownloaded: boolean;
}

const FontsPage: React.FC = () => {
  const navigate = useNavigate();
  const [fonts] = useState<Font[]>([
    { id: 1, name: 'Amiri', displayName: 'أميري', category: 'quran', isDefault: true, isDownloaded: true },
    { id: 2, name: 'Scheherazade', displayName: 'شهرزاد', category: 'quran', isDefault: false, isDownloaded: true },
    { id: 3, name: 'Naskh', displayName: 'نسخ', category: 'quran', isDefault: false, isDownloaded: true },
    { id: 4, name: 'Kufi', displayName: 'كوفي', category: 'quran', isDefault: false, isDownloaded: true },
    { id: 5, name: 'Arial', displayName: 'arial', category: 'english', isDefault: false, isDownloaded: true },
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            ← رجوع
          </button>
          <h1>إدارة الخطوط</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h2>الخطوط المثبتة</h2>
            <div className={styles.fontsGrid}>
              {fonts.map(font => (
                <div key={font.id} className={styles.fontCard}>
                  <div className={styles.fontPreview} style={{ fontFamily: font.name }}>
                    بِسْمِ اللَّهِ
                  </div>
                  <div className={styles.fontInfo}>
                    <span className={styles.fontName}>{font.displayName}</span>
                    <span className={styles.fontCategory}>{font.category}</span>
                  </div>
                  {font.isDefault && <span className={styles.defaultBadge}>افتراضي</span>}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2>تحميل خطوط جديدة</h2>
            <div className={styles.downloadArea}>
              <div className={styles.downloadIcon}>📥</div>
              <p>اسحب ملفات الخطوط هنا أو</p>
              <button className={styles.uploadBtn}>اختر ملف</button>
              <span className={styles.supported}>الملفات المدعومة: .ttf, .otf, .woff, .woff2</span>
            </div>
          </div>

          <div className={styles.section}>
            <h2>خطوط مقترحة للقرآن</h2>
            <div className={styles.suggestedFonts}>
              {['Amiri Quran', 'Scheherazade New', 'MeQuran', 'QCF'].map((font, index) => (
                <div key={index} className={styles.suggestedFont}>
                  <span className={styles.fontName}>{font}</span>
                  <button className={styles.downloadBtn}>تحميل</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontsPage;
