import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../stores/projectStore';
import { useToastStore } from '../../stores/uiStore';
import styles from './NewProjectPage.module.css';

interface ProjectFormData {
  name: string;
  description: string;
  resolution: string;
  fps: number;
}

const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { addProject } = useProjectStore();
  const toastStore = useToastStore();
  
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    resolution: '1920x1080',
    fps: 30,
  });
  const [isCreating, setIsCreating] = useState(false);

  const resolutions = [
    { value: '1280x720', label: '720p HD (1280×720)' },
    { value: '1920x1080', label: '1080p Full HD (1920×1080)' },
    { value: '2560x1440', label: '1440p QHD (2560×1440)' },
    { value: '3840x2160', label: '2160p 4K (3840×2160)' },
  ];

  const fpsOptions = [24, 25, 30, 50, 60];

  const handleChange = (field: keyof ProjectFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toastStore.addToast({
        type: 'warning',
        title: 'تحذير',
        message: 'يرجى إدخال اسم المشروع',
      });
      return;
    }

    setIsCreating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const [width, height] = formData.resolution.split('x').map(Number);
      
      const newProject = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        settings: {
          resolution: { width, height },
          fps: formData.fps,
          format: 'mp4',
        },
        duration: 0,
        is_saved: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      addProject(newProject);
      
      toastStore.addToast({
        type: 'success',
        title: 'تم إنشاء المشروع',
        message: `تم إنشاء مشروع "${formData.name}" بنجاح`,
      });
      
      navigate(`/project/${newProject.id}`);
    } catch (error) {
      toastStore.addToast({
        type: 'error',
        title: 'خطأ',
        message: 'حدث خطأ أثناء إنشاء المشروع',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            ← رجوع
          </button>
          <h1>إنشاء مشروع جديد</h1>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.section}>
            <h2>معلومات المشروع</h2>
            
            <div className={styles.field}>
              <label htmlFor="name">اسم المشروع *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="أدخل اسم المشروع..."
                className={styles.input}
              />
            </div>
            
            <div className={styles.field}>
              <label htmlFor="description">وصف المشروع</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="وصف اختياري للمشروع..."
                rows={3}
                className={styles.textarea}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2>إعدادات الفيديو</h2>
            
            <div className={styles.field}>
              <label>الدقة</label>
              <div className={styles.resolutionGrid}>
                {resolutions.map(res => (
                  <button
                    key={res.value}
                    type="button"
                    className={`${styles.resolutionBtn} ${formData.resolution === res.value ? styles.active : ''}`}
                    onClick={() => handleChange('resolution', res.value)}
                  >
                    <span className={styles.resolutionLabel}>{res.label.split('(')[0]}</span>
                    <span className={styles.resolutionSize}>{res.value}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className={styles.field}>
              <label>عدد الإطارات في الثانية (FPS)</label>
              <div className={styles.fpsButtons}>
                {fpsOptions.map(fps => (
                  <button
                    key={fps}
                    type="button"
                    className={`${styles.fpsBtn} ${formData.fps === fps ? styles.active : ''}`}
                    onClick={() => handleChange('fps', fps)}
                  >
                    {fps}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>ملخص الإعدادات</h2>
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>الاسم:</span>
                <span>{formData.name || 'غير محدد'}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>الدقة:</span>
                <span>
                  {resolutions.find(r => r.value === formData.resolution)?.label || formData.resolution}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>عدد الإطارات:</span>
                <span>{formData.fps} FPS</span>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate('/')}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={styles.createBtn}
              disabled={isCreating || !formData.name.trim()}
            >
              {isCreating ? (
                <>
                  <span className={styles.spinner} />
                  جاري الإنشاء...
                </>
              ) : (
                'إنشاء المشروع'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectPage;
