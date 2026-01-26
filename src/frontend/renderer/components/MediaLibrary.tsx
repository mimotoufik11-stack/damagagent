import React, { useState, useCallback } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore, useToastStore } from '../../stores/uiStore';
import styles from './MediaLibrary.module.css';

interface MediaItem {
  id: number;
  name: string;
  type: 'video' | 'audio' | 'image';
  thumbnail?: string;
  duration?: number;
  path: string;
}

const MediaLibrary: React.FC = () => {
  const { currentProject } = useProjectStore();
  const { setMediaLoading } = useUIStore();
  const { addToast } = useToastStore();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [filter, setFilter] = useState<'all' | 'video' | 'audio' | 'image'>('all');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setMediaLoading(true, 'جاري استيراد الملفات...');

    try {
      const files = Array.from(e.dataTransfer.files);
      const mediaPromises = files.map(async (file) => {
        const type = getMediaType(file.name);
        const thumbnail = type === 'video' ? await generateThumbnail(file) : undefined;
        
        return {
          id: Date.now() + Math.random(),
          name: file.name,
          type,
          thumbnail,
          duration: type === 'video' || type === 'audio' ? await getMediaDuration(file) : undefined,
          path: file.path,
        };
      });

      const imported = await Promise.all(mediaPromises);
      setMediaItems((prev) => [...prev, ...imported]);
      
      addToast({
        type: 'success',
        title: 'تم استيراد الملفات',
        message: `تم استيراد ${imported.length} ملف(ة)`,
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'خطأ في الاستيراد',
        message: 'حدث خطأ أثناء استيراد الملفات',
      });
    } finally {
      setMediaLoading(false);
    }
  }, [setMediaLoading, addToast]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setMediaLoading(true, 'جاري استيراد الملفات...');
    
    try {
      const files = Array.from(e.target.files);
      const mediaPromises = files.map(async (file) => {
        const type = getMediaType(file.name);
        const thumbnail = type === 'video' ? await generateThumbnail(file) : undefined;
        
        return {
          id: Date.now() + Math.random(),
          name: file.name,
          type,
          thumbnail,
          duration: type === 'video' || type === 'audio' ? await getMediaDuration(file) : undefined,
          path: file.path,
        };
      });

      const imported = await Promise.all(mediaPromises);
      setMediaItems((prev) => [...prev, ...imported]);
      
      addToast({
        type: 'success',
        title: 'تم استيراد الملفات',
        message: `تم استيراد ${imported.length} ملف(ة)`,
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'خطأ في الاستيراد',
        message: 'حدث خطأ أثناء استيراد الملفات',
      });
    } finally {
      setMediaLoading(false);
      e.target.value = '';
    }
  }, [setMediaLoading, addToast]);

  const filteredItems = filter === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.type === filter);

  return (
    <div className={styles.library}>
      <div className={styles.header}>
        <h3>مكتبة الوسائط</h3>
        <div className={styles.actions}>
          <label className={styles.importBtn}>
            <input
              type="file"
              multiple
              accept="video/*,audio/*,image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <span>+</span>
          </label>
        </div>
      </div>
      
      <div className={styles.filters}>
        {['all', 'video', 'audio', 'image'].map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
            onClick={() => setFilter(f as any)}
          >
            {f === 'all' ? 'الكل' : f === 'video' ? 'فيديو' : f === 'audio' ? 'صوت' : 'صورة'}
          </button>
        ))}
      </div>
      
      <div 
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging ? (
          <div className={styles.dropMessage}>
            <span className={styles.dropIcon}>📥</span>
            <p>أفلت الملفات هنا</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📁</span>
            <p>اسحب الملفات هنا</p>
            <p className={styles.hint}>أو اضغط على + للاستيراد</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredItems.map((item) => (
              <div key={item.id} className={styles.mediaItem} draggable>
                <div className={styles.thumbnail}>
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.name} />
                  ) : (
                    <div className={styles.typeIcon}>
                      {item.type === 'video' ? '🎬' : item.type === 'audio' ? '🎵' : '🖼️'}
                    </div>
                  )}
                  <span className={styles.typeBadge}>{item.type === 'video' ? 'فيديو' : item.type === 'audio' ? 'صوت' : 'صورة'}</span>
                </div>
                <div className={styles.info}>
                  <span className={styles.name}>{item.name}</span>
                  {item.duration && (
                    <span className={styles.duration}>{formatDuration(item.duration)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const getMediaType = (filename: string): 'video' | 'audio' | 'image' => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['mp4', 'mov', 'webm', 'avi', 'mkv'].includes(ext || '')) return 'video';
  if (['mp3', 'wav', 'm4a', 'ogg'].includes(ext || '')) return 'audio';
  return 'image';
};

const generateThumbnail = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    video.muted = true;
    
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration / 2);
    };
    
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 90;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg'));
      } else {
        resolve('');
      }
      URL.revokeObjectURL(video.src);
    };
  });
};

const getMediaDuration = async (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const media = document.createElement(file.type.includes('audio') ? 'audio' : 'video');
    media.src = URL.createObjectURL(file);
    
    media.onloadedmetadata = () => {
      resolve(media.duration);
      URL.revokeObjectURL(media.src);
    };
    
    media.onerror = () => resolve(0);
  });
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default MediaLibrary;
