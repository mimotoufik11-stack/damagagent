import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

function VideoUpload({ onVideoSelect }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async () => {
    if (!window.electronAPI) {
      alert('هذا التطبيق يعمل فقط في بيئة Electron');
      return;
    }

    const result = await window.electronAPI.openFileDialog({
      title: 'اختر ملف فيديو',
      filters: [
        { name: 'ملفات الفيديو', extensions: ['mp4', 'avi', 'mkv', 'mov', 'webm', 'flv', 'wmv'] },
        { name: 'جميع الملفات', extensions: ['*'] }
      ],
      properties: ['openFile']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      onVideoSelect(result.filePaths[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => 
      file.type.startsWith('video/') || 
      ['.mp4', '.avi', '.mkv', '.mov', '.webm'].some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (videoFile) {
      onVideoSelect(videoFile.path);
    } else {
      alert('يرجى رفع ملف فيديو صالح');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div
      className={`drop-zone rounded-2xl p-12 text-center max-w-2xl w-full transition-all duration-300 ${
        isDragging ? 'active' : ''
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <FiUpload className="text-6xl text-primary-500 mx-auto mb-4" />
      <h3 className="text-2xl font-semibold mb-2">اسحب ملف الفيديو هنا</h3>
      <p className="text-dark-400 mb-6">أو انقر لاختيار ملف من جهازك</p>
      <button onClick={handleFileSelect} className="btn-primary text-lg px-8 py-3">
        اختر ملف فيديو
      </button>
      <p className="text-sm text-dark-500 mt-4">
        الصيغ المدعومة: MP4, AVI, MKV, MOV, WebM
      </p>
    </div>
  );
}

export default VideoUpload;
