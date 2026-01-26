import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Download, 
  Settings, 
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Monitor,
  Smartphone,
  MonitorSpeaker
} from 'lucide-react';

const ExportPanel: React.FC = () => {
  const [exportSettings, setExportSettings] = useState({
    format: 'mp4',
    quality: 'high',
    resolution: '1920x1080',
    fps: 30,
    bitrate: 5000,
    audioBitrate: 128,
    preset: 'medium'
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const formatOptions = [
    { value: 'mp4', label: 'MP4 (H.264)', description: 'Best for web and general use' },
    { value: 'webm', label: 'WebM (VP9)', description: 'Smaller file size, web optimized' },
    { value: 'mov', label: 'MOV (ProRes)', description: 'Professional quality' },
    { value: 'avi', label: 'AVI', description: 'Maximum compatibility' }
  ];

  const qualityOptions = [
    { value: 'low', label: 'Low', description: 'Smaller file size' },
    { value: 'medium', label: 'Medium', description: 'Balanced quality and size' },
    { value: 'high', label: 'High', description: 'Better quality' },
    { value: 'ultra', label: 'Ultra', description: 'Maximum quality' }
  ];

  const resolutionOptions = [
    { value: '3840x2160', label: '4K (3840x2160)', icon: Monitor },
    { value: '1920x1080', label: 'Full HD (1920x1080)', icon: Monitor },
    { value: '1280x720', label: 'HD (1280x720)', icon: MonitorSpeaker },
    { value: '1080x1920', label: 'Vertical HD (1080x1920)', icon: Smartphone }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const result = await window.electronAPI.exportVideo({}, exportSettings);
      if (result.success) {
        // Mock progress simulation
        const interval = setInterval(() => {
          setExportProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              setIsExporting(false);
              return 100;
            }
            return prev + Math.random() * 10;
          });
        }, 500);
      }
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  const handleSettingChange = (key: string, value: string | number) => {
    setExportSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="h-full bg-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-white font-semibold text-lg">Export Video</h2>
        <p className="text-gray-400 text-sm">Configure export settings</p>
      </div>

      {/* Export Settings */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Format Selection */}
        <div>
          <label className="block text-white font-medium mb-3">Format</label>
          <div className="space-y-2">
            {formatOptions.map((option) => (
              <motion.div
                key={option.value}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  exportSettings.format === option.value
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                }`}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleSettingChange('format', option.value)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{option.label}</div>
                    <div className="text-gray-400 text-sm">{option.description}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    exportSettings.format === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quality Selection */}
        <div>
          <label className="block text-white font-medium mb-3">Quality</label>
          <div className="space-y-2">
            {qualityOptions.map((option) => (
              <motion.div
                key={option.value}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  exportSettings.quality === option.value
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                }`}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleSettingChange('quality', option.value)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{option.label}</div>
                    <div className="text-gray-400 text-sm">{option.description}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    exportSettings.quality === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resolution Selection */}
        <div>
          <label className="block text-white font-medium mb-3">Resolution</label>
          <div className="grid grid-cols-2 gap-2">
            {resolutionOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={option.value}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    exportSettings.resolution === option.value
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSettingChange('resolution', option.value)}
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <IconComponent className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{option.label}</div>
                    </div>
                    <div className={`w-3 h-3 rounded-full border ${
                      exportSettings.resolution === option.value
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-400'
                    }`}></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Advanced Settings */}
        <div>
          <label className="block text-white font-medium mb-3">Advanced Settings</label>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Frame Rate (FPS)</label>
              <select
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={exportSettings.fps}
                onChange={(e) => handleSettingChange('fps', parseInt(e.target.value))}
              >
                <option value={24}>24 FPS</option>
                <option value={25}>25 FPS</option>
                <option value={30}>30 FPS</option>
                <option value={60}>60 FPS</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Video Bitrate (kbps)</label>
              <select
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={exportSettings.bitrate}
                onChange={(e) => handleSettingChange('bitrate', parseInt(e.target.value))}
              >
                <option value={1000}>1000 (Low)</option>
                <option value={2500}>2500 (Medium)</option>
                <option value={5000}>5000 (High)</option>
                <option value={8000}>8000 (Ultra)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Audio Bitrate (kbps)</label>
              <select
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={exportSettings.audioBitrate}
                onChange={(e) => handleSettingChange('audioBitrate', parseInt(e.target.value))}
              >
                <option value={64}>64</option>
                <option value={96}>96</option>
                <option value={128}>128</option>
                <option value={192}>192</option>
                <option value={320}>320</option>
              </select>
            </div>
          </div>
        </div>

        {/* Export Progress */}
        {isExporting && (
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Exporting...</span>
              <span className="text-gray-400">{Math.round(exportProgress)}%</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${exportProgress}%` }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Export Button */}
      <div className="p-4 border-t border-slate-700">
        <motion.button
          className={`w-full flex items-center justify-center space-x-2 space-x-reverse py-3 rounded-lg font-medium transition-all ${
            isExporting
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
          whileHover={!isExporting ? { scale: 1.02 } : {}}
          whileTap={!isExporting ? { scale: 0.98 } : {}}
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Start Export</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export { ExportPanel };