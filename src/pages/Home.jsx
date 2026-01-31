import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiVideo, FiUpload, FiFolder, FiPlay, FiBookOpen } from 'react-icons/fi';

function Home() {
  const navigate = useNavigate();
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
      navigate('/editor', { state: { videoPath: result.filePaths[0] } });
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
      navigate('/editor', { state: { videoPath: videoFile.path } });
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

  const features = [
    {
      icon: <FiVideo className="text-3xl" />,
      title: 'تحرير احترافي',
      description: 'أدوات متقدمة لتحرير الفيديو بسهولة ودقة عالية'
    },
    {
      icon: <FiBookOpen className="text-3xl" />,
      title: 'استخراج النصوص',
      description: 'تحويل الصوت إلى نص تلقائياً باستخدام تقنية Whisper'
    },
    {
      icon: <FiPlay className="text-3xl" />,
      title: 'كابشنات احترافية',
      description: 'إضافة وتخصيص الكابشنات بتصاميم متعددة'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-dark-700 bg-dark-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <FiVideo className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold">محرر فيديو القرآن الكريم</h1>
                <p className="text-sm text-dark-400">Quran Video Editor</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2 btn-secondary"
            >
              <FiFolder />
              <span>مشاريعي</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              حرر فيديوهات القرآن الكريم باحترافية
            </h2>
            <p className="text-lg text-dark-300">
              أدوات متقدمة لإضافة الكابشنات والتحرير الاحترافي مع دعم كامل للغة العربية
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`drop-zone mb-12 rounded-2xl p-12 text-center transition-all duration-300 ${
              isDragging ? 'active border-primary-500 bg-primary-500/10' : 'border-dark-700 bg-dark-800/50'
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

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center text-primary-500">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-semibold">{feature.title}</h4>
                  <p className="text-dark-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tools Preview */}
          <div className="mt-12 card">
            <h3 className="text-xl font-semibold mb-4">أدوات التحرير المتوفرة</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {[
                'قطع ودمج الفيديو',
                'تغيير الدقة والحجم',
                'ضبط الصوت',
                'تصحيح الألوان',
                'إضافة الكابشنات',
                'تأثيرات بصرية',
                'إضافة الشعارات',
                'استخراج النصوص',
                'معالجة الصوت',
                'تأثيرات انتقالية',
                'ضبط السرعة',
                'تصدير متعدد الصيغ'
              ].map((tool, index) => (
                <div
                  key={index}
                  className="bg-dark-900 px-3 py-2 rounded-lg border border-dark-700 hover:border-primary-500/50 transition-colors"
                >
                  <span className="text-primary-400">✓</span> {tool}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-700 bg-dark-900/50 backdrop-blur-sm py-4">
        <div className="container mx-auto px-6 text-center text-dark-400 text-sm">
          <p>© 2024 محرر فيديو القرآن الكريم - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
