import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore, Theme, Language } from '../../stores/settingsStore';
import { useToastStore } from '../../stores/uiStore';
import styles from './SettingsPage.module.css';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, setLanguage, setTheme, setAutoSaveInterval, setDefaultFPS, setDefaultResolution, resetSettings } = useSettingsStore();
  const toastStore = useToastStore();
  
  const [localSettings, setLocalSettings] = useState(settings);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setLocalSettings(prev => ({ ...prev, language: lang }));
    toastStore.addToast({
      type: 'success',
      title: 'تم الحفظ',
      message: 'تم تغيير اللغة',
    });
  };

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
    setLocalSettings(prev => ({ ...prev, theme }));
  };

  const handleAutoSaveChange = (interval: number) => {
    setAutoSaveInterval(interval);
    setLocalSettings(prev => ({ ...prev, autoSaveInterval: interval }));
  };

  const handleFPSChange = (fps: number) => {
    setDefaultFPS(fps);
    setLocalSettings(prev => ({ ...prev, defaultFPS: fps }));
  };

  const handleReset = () => {
    resetSettings();
    toastStore.addToast({
      type: 'success',
      title: 'تم إعادة التعيين',
      message: 'تم إعادة تعيين الإعدادات الافتراضية',
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            ← رجوع
          </button>
          <h1>الإعدادات</h1>
        </div>

        <div className={styles.sections}>
          {/* General Settings */}
          <div className={styles.section}>
            <h2>عام</h2>
            
            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>اللغة</span>
                <span className={styles.settingDesc}>اختر لغة الواجهة</span>
              </div>
              <div className={styles.settingControl}>
                <button
                  className={`${styles.langBtn} ${localSettings.language === 'ar' ? styles.active : ''}`}
                  onClick={() => handleLanguageChange('ar')}
                >
                  🇸🇦 العربية
                </button>
                <button
                  className={`${styles.langBtn} ${localSettings.language === 'en' ? styles.active : ''}`}
                  onClick={() => handleLanguageChange('en')}
                >
                  🇺🇸 English
                </button>
              </div>
            </div>
            
            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>المظهر</span>
                <span className={styles.settingDesc}>اختر المظهر المناسب</span>
              </div>
              <div className={styles.settingControl}>
                <button
                  className={`${styles.themeBtn} ${localSettings.theme === 'dark' ? styles.active : ''}`}
                  onClick={() => handleThemeChange('dark')}
                >
                  🌙 داكن
                </button>
                <button
                  className={`${styles.themeBtn} ${localSettings.theme === 'light' ? styles.active : ''}`}
                  onClick={() => handleThemeChange('light')}
                >
                  ☀️ فاتح
                </button>
              </div>
            </div>
          </div>

          {/* Editor Settings */}
          <div className={styles.section}>
            <h2>المحرر</h2>
            
            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>الحفظ التلقائي</span>
                <span className={styles.settingDesc}>الحفظ كل {localSettings.autoSaveInterval} ثانية</span>
              </div>
              <div className={styles.settingControl}>
                <select
                  value={localSettings.autoSaveInterval}
                  onChange={(e) => handleAutoSaveChange(parseInt(e.target.value))}
                  className={styles.select}
                >
                  <option value={15}>15 ثانية</option>
                  <option value={30}>30 ثانية</option>
                  <option value={60}>دقيقة</option>
                  <option value={120}>دقيقتان</option>
                  <option value={0}>معطل</option>
                </select>
              </div>
            </div>
            
            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>FPS الافتراضي</span>
                <span className={styles.settingDesc}>عدد الإطارات في الثانية للمشاريع الجديدة</span>
              </div>
              <div className={styles.settingControl}>
                <select
                  value={localSettings.defaultFPS}
                  onChange={(e) => handleFPSChange(parseInt(e.target.value))}
                  className={styles.select}
                >
                  <option value={24}>24 FPS</option>
                  <option value={30}>30 FPS</option>
                  <option value={60}>60 FPS</option>
                </select>
              </div>
            </div>
            
            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>الدقة الافتراضية</span>
                <span className={styles.settingDesc}>دقة الشاشة للمشاريع الجديدة</span>
              </div>
              <div className={styles.settingControl}>
                <select
                  value={localSettings.defaultResolution}
                  onChange={(e) => setDefaultResolution(e.target.value)}
                  className={styles.select}
                >
                  <option value="1280x720">1280×720 (720p)</option>
                  <option value="1920x1080">1920×1080 (1080p)</option>
                  <option value="3840x2160">3840×2160 (4K)</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className={styles.section}>
            <h2>الذكاء الاصطناعي</h2>
            
            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>نموذج النسخ</span>
                <span className={styles.settingDesc}>Whisper نموذج النسخ الصوتي</span>
              </div>
              <div className={styles.settingControl}>
                <select className={styles.select}>
                  <option value="tiny">Tiny - الأسرع</option>
                  <option value="base">Base - متوازن</option>
                  <option value="small">Small - جيد</option>
                  <option value="medium">Medium - أفضل</option>
                  <option value="large">Large - الأفضل</option>
                </select>
              </div>
            </div>
            
            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>صوت الدبلجة</span>
                <span className={styles.settingDesc}>صوت TTS للـ dubbing</span>
              </div>
              <div className={styles.settingControl}>
                <select className={styles.select}>
                  <option value="arabic">صوت عربي افتراضي</option>
                  <option value="male1">صوت رجل 1</option>
                  <option value="female1">صوت امرأة 1</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.section}>
            <h2>إجراءات</h2>
            
            <button className={styles.resetBtn} onClick={handleReset}>
              🔄 إعادة تعيين الإعدادات الافتراضية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
