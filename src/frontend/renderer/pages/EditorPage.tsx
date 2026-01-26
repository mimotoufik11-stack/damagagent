import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';
import VideoPreview from '../../components/VideoPreview';
import Timeline from '../../components/Timeline';
import styles from './EditorPage.module.css';

const EditorPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { currentProject, setCurrentProject, projects } = useProjectStore();
  const { setDuration, resetTimeline } = useEditorStore();

  useEffect(() => {
    if (projectId) {
      const project = projects.find(p => p.id === parseInt(projectId));
      if (project) {
        setCurrentProject(project);
        setDuration(project.duration || 300);
      } else {
        navigate('/');
      }
    }
    
    return () => {
      setCurrentProject(null);
      resetTimeline();
    };
  }, [projectId, projects, setCurrentProject, setDuration, navigate, resetTimeline]);

  if (!currentProject) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>جاري تحميل المشروع...</p>
      </div>
    );
  }

  return (
    <div className={styles.editor}>
      {/* Main content area */}
      <div className={styles.mainContent}>
        {/* Preview section */}
        <div className={styles.previewSection}>
          <VideoPreview />
        </div>
        
        {/* Timeline section */}
        <div className={styles.timelineSection}>
          <Timeline />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
