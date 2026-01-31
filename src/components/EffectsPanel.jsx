import React, { useState } from 'react';
import { FiSun, FiDroplet, FiFilter, FiZap } from 'react-icons/fi';

function EffectsPanel({ videoPath, onApply }) {
  const [activeEffect, setActiveEffect] = useState(null);
  const [effectSettings, setEffectSettings] = useState({});

  const effects = [
    {
      id: 'brightness',
      name: 'السطوع',
      icon: <FiSun />,
      settings: { brightness: 0 }
    },
    {
      id: 'contrast',
      name: 'التباين',
      icon: <FiDroplet />,
      settings: { contrast: 1 }
    },
    {
      id: 'saturation',
      name: 'التشبع',
      icon: <FiFilter />,
      settings: { saturation: 1 }
    },
    {
      id: 'blur',
      name: 'الضبابية',
      icon: <FiZap />,
      settings: { blur: 0 }
    }
  ];

  const handleEffectClick = (effect) => {
    setActiveEffect(effect.id);
    setEffectSettings(effect.settings);
  };

  const handleApply = () => {
    onApply({ effect: activeEffect, settings: effectSettings });
    alert('تم تطبيق التأثير بنجاح');
    setActiveEffect(null);
  };

  const renderEffectSettings = () => {
    if (!activeEffect) return null;

    switch (activeEffect) {
      case 'brightness':
        return (
          <div>
            <label className="block text-sm mb-1">السطوع</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={effectSettings.brightness}
              onChange={(e) => setEffectSettings({ ...effectSettings, brightness: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-center text-sm text-dark-400 mt-1">
              {effectSettings.brightness}
            </div>
          </div>
        );

      case 'contrast':
        return (
          <div>
            <label className="block text-sm mb-1">التباين</label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={effectSettings.contrast}
              onChange={(e) => setEffectSettings({ ...effectSettings, contrast: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="text-center text-sm text-dark-400 mt-1">
              {effectSettings.contrast.toFixed(1)}
            </div>
          </div>
        );

      case 'saturation':
        return (
          <div>
            <label className="block text-sm mb-1">التشبع</label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={effectSettings.saturation}
              onChange={(e) => setEffectSettings({ ...effectSettings, saturation: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="text-center text-sm text-dark-400 mt-1">
              {effectSettings.saturation.toFixed(1)}
            </div>
          </div>
        );

      case 'blur':
        return (
          <div>
            <label className="block text-sm mb-1">الضبابية</label>
            <input
              type="range"
              min="0"
              max="20"
              value={effectSettings.blur}
              onChange={(e) => setEffectSettings({ ...effectSettings, blur: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-center text-sm text-dark-400 mt-1">
              {effectSettings.blur}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {activeEffect ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {effects.find(e => e.id === activeEffect)?.name}
            </h3>
            <button
              onClick={() => setActiveEffect(null)}
              className="text-sm text-dark-400 hover:text-white"
            >
              إلغاء
            </button>
          </div>

          <div className="card">
            {renderEffectSettings()}
          </div>

          <button onClick={handleApply} className="btn-primary w-full">
            تطبيق التأثير
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-dark-400 mb-3">التأثيرات البصرية</h3>
          {effects.map(effect => (
            <button
              key={effect.id}
              onClick={() => handleEffectClick(effect)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-700 transition-colors text-right"
            >
              <span className="text-primary-400">{effect.icon}</span>
              <span>{effect.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default EffectsPanel;
