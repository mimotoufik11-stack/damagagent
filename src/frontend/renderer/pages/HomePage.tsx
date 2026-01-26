import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import ProjectCard from '../ProjectCard';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, recentProjects, setProjects, setRecentProjects } = useProjectStore();
  const { openModal } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load projects (simulated)
    const loadProjects = async () => {
      setIsLoading(true);
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set demo projects
      const demoProjects = [
        {
          id: 1,
          name: 'تفسير سورة البقرة',
          description: 'مشروع تفسير مبسط لسورة البقرة',
          settings: { resolution: { width: 1920, height: 1080 }, fps: 30, format: 'mp4' },
          duration: 1800,
          thumbnail_path: undefined,
          is_saved: true,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-16T14:30:00Z',
        },
        {
          id: 2,
          name: 'دعاء الصباح',
          description: 'أدعية الصباح النبوية',
          settings: { resolution: { width: 1920, height: 1080 }, fps: 30, format: 'mp4' },
          duration: 600,
          thumbnail_path: undefined,
          is_saved: true,
          created_at: '2024-01-10T08:00:00Z',
          updated_at: '2024-01-10T16:00:00Z',
        },
      ];
      
      setProjects(demoProjects);
      setRecentProjects(demoProjects);
      setIsLoading(false);
    };

    loadProjects();
  }, [setProjects, setRecentProjects]);

  const handleCreateProject = () => {
    navigate('/new');
  };

  const handleOpenProject = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>دماج للقرآن الكريم</h1>
          <p>استوديو مونتاج احترافي متخصص في إنتاج محتوى قرآني</p>
          <div className={styles.heroActions}>
            <button className={styles.primaryBtn} onClick={handleCreateProject}>
              <span className={styles.btnIcon}>+</span>
              إنشاء مشروع جديد
            </button>
            <button className={styles.secondaryBtn}>
              استكشاف المشاريع
            </button>
          </div>
        </div>
        <div className={styles.heroDecoration}>
          <span className={styles.heroIcon}>☪️</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📁</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{projects.length}</span>
            <span className={styles.statLabel}>مشروع</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>⏱️</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {Math.floor(projects.reduce((acc, p) => acc + (p.duration || 0), 0) / 60)}
            </span>
            <span className={styles.statLabel}>دقيقة</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🎬</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>تصدير</span>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>المشاريع الأخيرة</h2>
          <button className={styles.viewAllBtn}>عرض الكل</button>
        </div>
        
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>جاري تحميل المشاريع...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📂</span>
            <h3>لا توجد مشاريع</h3>
            <p>أنشئ مشروعك الأول للبدء</p>
            <button className={styles.primaryBtn} onClick={handleCreateProject}>
              إنشاء مشروع جديد
            </button>
          </div>
        ) : (
          <div className={styles.projectsGrid}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleOpenProject(project.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h2>إجراءات سريعة</h2>
        <div className={styles.actionsGrid}>
          <button className={styles.actionCard} onClick={handleCreateProject}>
            <span className={styles.actionIcon}>📹</span>
            <span className={styles.actionLabel}>مشروع فيديو</span>
          </button>
          <button className={styles.actionCard}>
            <span className={styles.actionIcon}>🎵</span>
            <span className={styles.actionLabel}>مشروع صوتي</span>
          </button>
          <button className={styles.actionCard}>
            <span className={styles.actionIcon}>📝</span>
            <span className={styles.actionLabel}>إنشاء ترجمة</span>
          </button>
          <button className={styles.actionCard}>
            <span className={styles.actionIcon}>🔊</span>
            <span className={styles.actionLabel}>دبلجة صوتية</span>
          </button>
        </div>
      </div>

      {/* Features */}
      <div className={styles.features}>
        <h2>مميزات التطبيق</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🤖</span>
            <h3>ذكاء اصطناعي</h3>
            <p>نسخ صوتي وترجمات تلقائية ودبلجة باستخدام أحدث التقنيات</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>☪️</span>
            <h3>متخصص قرآني</h3>
            <p>أدوات مصممة خصيصاً لإنتاج المحتوى القرآني</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🎨</span>
            <h3>تصميم عربي</h3>
            <p>واجهة عربية كاملة مع دعم RTL</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>💾</span>
            <h3>تصدير متعدد</h3>
            <p>تصدير بجودات ودقات متعددة</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
