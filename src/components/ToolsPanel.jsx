import React, { useState } from 'react';
import { 
  FiScissors, FiCrop, FiLayers, FiMonitor, FiSettings, 
  FiZap, FiVolume2, FiMusic, FiImage, FiType 
} from 'react-icons/fi';

function ToolsPanel({ videoPath, videoMetadata, onApply }) {
  const [activeTool, setActiveTool] = useState(null);
  const [toolSettings, setToolSettings] = useState({});

  const tools = [
    {
      id: 'trim',
      name: 'قص الفيديو',
      icon: <FiScissors />,
      category: 'basic',
      settings: {
        startTime: 0,
        endTime: videoMetadata?.duration || 0
      }
    },
    {
      id: 'crop',
      name: 'اقتصاص',
      icon: <FiCrop />,
      category: 'basic',
      settings: {
        x: 0,
        y: 0,
        width: videoMetadata?.width || 1920,
        height: videoMetadata?.height || 1080
      }
    },
    {
      id: 'resolution',
      name: 'تغيير الدقة',
      icon: <FiMonitor />,
      category: 'quality',
      settings: {
        width: 1920,
        height: 1080,
        preset: '1080p'
      }
    },
    {
      id: 'fps',
      name: 'معدل الإطارات',
      icon: <FiZap />,
      category: 'quality',
      settings: {
        fps: 30
      }
    },
    {
      id: 'aspectRatio',
      name: 'النسبة العريضة',
      icon: <FiMonitor />,
      category: 'quality',
      settings: {
        ratio: '16:9'
      }
    },
    {
      id: 'volume',
      name: 'مستوى الصوت',
      icon: <FiVolume2 />,
      category: 'audio',
      settings: {
        volume: 100
      }
    },
    {
      id: 'audioMerge',
      name: 'دمج صوت',
      icon: <FiMusic />,
      category: 'audio',
      settings: {
        audioFile: null,
        volume: 50
      }
    },
    {
      id: 'watermark',
      name: 'إضافة شعار',
      icon: <FiImage />,
      category: 'overlay',
      settings: {
        imageFile: null,
        position: 'bottom-right',
        opacity: 80,
        size: 100
      }
    },
    {
      id: 'text',
      name: 'إضافة نص',
      icon: <FiType />,
      category: 'overlay',
      settings: {
        text: '',
        position: 'center',
        fontSize: 24,
        color: '#ffffff'
      }
    }
  ];

  const resolutionPresets = [
    { label: '480p (SD)', value: '480p', width: 854, height: 480 },
    { label: '720p (HD)', value: '720p', width: 1280, height: 720 },
    { label: '1080p (Full HD)', value: '1080p', width: 1920, height: 1080 },
    { label: '1440p (2K)', value: '1440p', width: 2560, height: 1440 },
    { label: '2160p (4K)', value: '4k', width: 3840, height: 2160 }
  ];

  const aspectRatios = [
    { label: '16:9 (افتراضي)', value: '16:9' },
    { label: '4:3 (قديم)', value: '4:3' },
    { label: '1:1 (مربع)', value: '1:1' },
    { label: '9:16 (عمودي)', value: '9:16' },
    { label: '21:9 (سينمائي)', value: '21:9' }
  ];

  const handleToolClick = (tool) => {
    setActiveTool(tool.id);
    setToolSettings(tool.settings);
  };

  const handleApply = () => {
    if (!activeTool) return;
    
    onApply({
      tool: activeTool,
      settings: toolSettings
    });

    alert('تم تطبيق الأداة بنجاح');
    setActiveTool(null);
  };

  const renderToolSettings = () => {
    if (!activeTool) return null;

    const tool = tools.find(t => t.id === activeTool);

    switch (activeTool) {
      case 'trim':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">وقت البداية (ثانية)</label>
              <input
                type="number"
                value={toolSettings.startTime}
                onChange={(e) => setToolSettings({ ...toolSettings, startTime: parseFloat(e.target.value) })}
                className="input-field w-full"
                min="0"
                max={videoMetadata?.duration || 0}
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">وقت النهاية (ثانية)</label>
              <input
                type="number"
                value={toolSettings.endTime}
                onChange={(e) => setToolSettings({ ...toolSettings, endTime: parseFloat(e.target.value) })}
                className="input-field w-full"
                min="0"
                max={videoMetadata?.duration || 0}
                step="0.1"
              />
            </div>
          </div>
        );

      case 'crop':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">X</label>
                <input
                  type="number"
                  value={toolSettings.x}
                  onChange={(e) => setToolSettings({ ...toolSettings, x: parseInt(e.target.value) })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Y</label>
                <input
                  type="number"
                  value={toolSettings.y}
                  onChange={(e) => setToolSettings({ ...toolSettings, y: parseInt(e.target.value) })}
                  className="input-field w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">العرض</label>
                <input
                  type="number"
                  value={toolSettings.width}
                  onChange={(e) => setToolSettings({ ...toolSettings, width: parseInt(e.target.value) })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">الارتفاع</label>
                <input
                  type="number"
                  value={toolSettings.height}
                  onChange={(e) => setToolSettings({ ...toolSettings, height: parseInt(e.target.value) })}
                  className="input-field w-full"
                />
              </div>
            </div>
          </div>
        );

      case 'resolution':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">اختر الدقة</label>
              <select
                value={toolSettings.preset}
                onChange={(e) => {
                  const preset = resolutionPresets.find(p => p.value === e.target.value);
                  setToolSettings({
                    ...toolSettings,
                    preset: preset.value,
                    width: preset.width,
                    height: preset.height
                  });
                }}
                className="input-field w-full"
              >
                {resolutionPresets.map(preset => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">العرض</label>
                <input
                  type="number"
                  value={toolSettings.width}
                  onChange={(e) => setToolSettings({ ...toolSettings, width: parseInt(e.target.value) })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">الارتفاع</label>
                <input
                  type="number"
                  value={toolSettings.height}
                  onChange={(e) => setToolSettings({ ...toolSettings, height: parseInt(e.target.value) })}
                  className="input-field w-full"
                />
              </div>
            </div>
          </div>
        );

      case 'fps':
        return (
          <div>
            <label className="block text-sm mb-1">معدل الإطارات (FPS)</label>
            <select
              value={toolSettings.fps}
              onChange={(e) => setToolSettings({ ...toolSettings, fps: parseInt(e.target.value) })}
              className="input-field w-full"
            >
              <option value={24}>24 FPS (سينمائي)</option>
              <option value={30}>30 FPS (قياسي)</option>
              <option value={60}>60 FPS (سلس)</option>
              <option value={120}>120 FPS (بطيء جداً)</option>
            </select>
          </div>
        );

      case 'aspectRatio':
        return (
          <div>
            <label className="block text-sm mb-1">النسبة العريضة</label>
            <select
              value={toolSettings.ratio}
              onChange={(e) => setToolSettings({ ...toolSettings, ratio: e.target.value })}
              className="input-field w-full"
            >
              {aspectRatios.map(ratio => (
                <option key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'volume':
        return (
          <div>
            <label className="block text-sm mb-1">مستوى الصوت (%)</label>
            <input
              type="range"
              min="0"
              max="200"
              value={toolSettings.volume}
              onChange={(e) => setToolSettings({ ...toolSettings, volume: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-center text-sm text-dark-400 mt-1">
              {toolSettings.volume}%
            </div>
          </div>
        );

      case 'watermark':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">موضع الشعار</label>
              <select
                value={toolSettings.position}
                onChange={(e) => setToolSettings({ ...toolSettings, position: e.target.value })}
                className="input-field w-full"
              >
                <option value="top-left">أعلى اليسار</option>
                <option value="top-right">أعلى اليمين</option>
                <option value="bottom-left">أسفل اليسار</option>
                <option value="bottom-right">أسفل اليمين</option>
                <option value="center">المنتصف</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">الشفافية (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={toolSettings.opacity}
                onChange={(e) => setToolSettings({ ...toolSettings, opacity: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="text-center text-sm text-dark-400 mt-1">
                {toolSettings.opacity}%
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">الحجم (%)</label>
              <input
                type="range"
                min="10"
                max="200"
                value={toolSettings.size}
                onChange={(e) => setToolSettings({ ...toolSettings, size: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="text-center text-sm text-dark-400 mt-1">
                {toolSettings.size}%
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-dark-400 py-4">
            <p>لا توجد إعدادات لهذه الأداة</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {activeTool ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {tools.find(t => t.id === activeTool)?.name}
            </h3>
            <button
              onClick={() => setActiveTool(null)}
              className="text-sm text-dark-400 hover:text-white"
            >
              إلغاء
            </button>
          </div>

          <div className="card">
            {renderToolSettings()}
          </div>

          <button onClick={handleApply} className="btn-primary w-full">
            تطبيق
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-dark-400 mb-3">أدوات التحرير</h3>
          
          <div className="space-y-1">
            <p className="text-xs text-dark-500 px-2 py-1">أدوات أساسية</p>
            {tools.filter(t => t.category === 'basic').map(tool => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-700 transition-colors text-right"
              >
                <span className="text-primary-400">{tool.icon}</span>
                <span>{tool.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-dark-500 px-2 py-1">الجودة والدقة</p>
            {tools.filter(t => t.category === 'quality').map(tool => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-700 transition-colors text-right"
              >
                <span className="text-primary-400">{tool.icon}</span>
                <span>{tool.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-dark-500 px-2 py-1">الصوت</p>
            {tools.filter(t => t.category === 'audio').map(tool => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-700 transition-colors text-right"
              >
                <span className="text-primary-400">{tool.icon}</span>
                <span>{tool.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-dark-500 px-2 py-1">العناصر المضافة</p>
            {tools.filter(t => t.category === 'overlay').map(tool => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-700 transition-colors text-right"
              >
                <span className="text-primary-400">{tool.icon}</span>
                <span>{tool.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolsPanel;
