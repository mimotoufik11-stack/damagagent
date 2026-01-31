import React, { useState } from 'react';
import { FiX, FiDownload } from 'react-icons/fi';

function ExportDialog({ videoMetadata, onExport, onClose }) {
  const [settings, setSettings] = useState({
    format: 'mp4',
    resolution: videoMetadata?.width && videoMetadata?.height 
      ? `${videoMetadata.width}x${videoMetadata.height}` 
      : '1920x1080',
    quality: 'high',
    codec: 'h264',
    fps: 30,
    bitrate: 'auto'
  });

  const formats = [
    { value: 'mp4', label: 'MP4 (موصى به)' },
    { value: 'avi', label: 'AVI' },
    { value: 'mkv', label: 'MKV' },
    { value: 'mov', label: 'MOV' },
    { value: 'webm', label: 'WebM' }
  ];

  const resolutions = [
    { value: '3840x2160', label: '4K (3840x2160)' },
    { value: '2560x1440', label: '2K (2560x1440)' },
    { value: '1920x1080', label: 'Full HD (1920x1080)' },
    { value: '1280x720', label: 'HD (1280x720)' },
    { value: '854x480', label: 'SD (854x480)' }
  ];

  const qualities = [
    { value: 'low', label: 'منخفضة (ملف صغير)' },
    { value: 'medium', label: 'متوسطة' },
    { value: 'high', label: 'عالية (موصى به)' },
    { value: 'best', label: 'أفضل جودة (ملف كبير)' }
  ];

  const codecs = [
    { value: 'h264', label: 'H.264 (موصى به)' },
    { value: 'h265', label: 'H.265 (HEVC)' },
    { value: 'vp9', label: 'VP9' },
    { value: 'mpeg4', label: 'MPEG-4' }
  ];

  const handleExport = async () => {
    const result = await window.electronAPI.saveFileDialog({
      title: 'حفظ الفيديو',
      defaultPath: `video-${Date.now()}.${settings.format}`,
      filters: [
        { name: 'ملف الفيديو', extensions: [settings.format] }
      ]
    });

    if (!result.canceled && result.filePath) {
      onExport({
        ...settings,
        outputPath: result.filePath
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">تصدير الفيديو</h2>
            <button onClick={onClose} className="btn-icon">
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">صيغة الملف</label>
              <select
                value={settings.format}
                onChange={(e) => setSettings({ ...settings, format: e.target.value })}
                className="input-field w-full"
              >
                {formats.map(format => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الدقة</label>
              <select
                value={settings.resolution}
                onChange={(e) => setSettings({ ...settings, resolution: e.target.value })}
                className="input-field w-full"
              >
                {resolutions.map(res => (
                  <option key={res.value} value={res.value}>
                    {res.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الجودة</label>
              <select
                value={settings.quality}
                onChange={(e) => setSettings({ ...settings, quality: e.target.value })}
                className="input-field w-full"
              >
                {qualities.map(quality => (
                  <option key={quality.value} value={quality.value}>
                    {quality.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الترميز</label>
              <select
                value={settings.codec}
                onChange={(e) => setSettings({ ...settings, codec: e.target.value })}
                className="input-field w-full"
              >
                {codecs.map(codec => (
                  <option key={codec.value} value={codec.value}>
                    {codec.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">معدل الإطارات (FPS)</label>
              <select
                value={settings.fps}
                onChange={(e) => setSettings({ ...settings, fps: parseInt(e.target.value) })}
                className="input-field w-full"
              >
                <option value={24}>24 FPS</option>
                <option value={30}>30 FPS</option>
                <option value={60}>60 FPS</option>
              </select>
            </div>

            <div className="card bg-primary-500/10 border-primary-500/30">
              <p className="text-sm text-primary-300">
                💡 <strong>نصيحة:</strong> للحصول على أفضل جودة مع حجم معقول، استخدم صيغة MP4 مع
                ترميز H.264 وجودة عالية.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button onClick={handleExport} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <FiDownload />
              تصدير الفيديو
            </button>
            <button onClick={onClose} className="btn-secondary">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportDialog;
