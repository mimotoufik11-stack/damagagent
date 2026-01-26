import React from 'react';
import { useProjectStore, Project } from '../../stores/projectStore';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:00`;
    }
    return `${minutes}:00`;
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.thumbnail}>
        {project.thumbnail_path ? (
          <img src={project.thumbnail_path} alt={project.name} />
        ) : (
          <div className={styles.placeholder}>
            <span>🎬</span>
          </div>
        )}
        <div className={styles.duration}>{formatDuration(project.duration)}</div>
      </div>
      
      <div className={styles.info}>
        <h3 className={styles.name}>{project.name}</h3>
        {project.description && (
          <p className={styles.description}>{project.description}</p>
        )}
        <div className={styles.meta}>
          <span className={styles.resolution}>
            {project.settings.resolution.width}×{project.settings.resolution.height}
          </span>
          <span className={styles.fps}>{project.settings.fps} FPS</span>
        </div>
        <div className={styles.footer}>
          <span className={styles.date}>{formatDate(project.updated_at)}</span>
          {project.is_saved && (
            <span className={styles.saved}>✓ محفوظ</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
