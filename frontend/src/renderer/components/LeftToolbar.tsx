import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Video, 
  Music, 
  Type, 
  Layers, 
  Scissors, 
  Move, 
  Palette,
  FileText,
  Settings
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';

const LeftToolbar: React.FC = () => {
  const uiStore = useUIStore();
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools = [
    {
      id: 'media',
      icon: FolderOpen,
      label: 'Media Library',
      panel: 'media',
      description: 'Import and manage media files'
    },
    {
      id: 'video',
      icon: Video,
      label: 'Video Tools',
      panel: null,
      description: 'Video editing tools'
    },
    {
      id: 'audio',
      icon: Music,
      label: 'Audio Panel',
      panel: 'audio',
      description: 'Audio editing and effects'
    },
    {
      id: 'text',
      icon: Type,
      label: 'Text Panel',
      panel: 'text',
      description: 'Text editing and fonts'
    },
    {
      id: 'layers',
      icon: Layers,
      label: 'Layers',
      panel: null,
      description: 'Layer management'
    },
    {
      id: 'cut',
      icon: Scissors,
      label: 'Cut Tool',
      panel: null,
      description: 'Cut and split clips'
    },
    {
      id: 'move',
      icon: Move,
      label: 'Move Tool',
      panel: null,
      description: 'Move and position clips'
    },
    {
      id: 'colors',
      icon: Palette,
      label: 'Colors',
      panel: null,
      description: 'Color correction'
    },
    {
      id: 'export',
      icon: FileText,
      label: 'Export',
      panel: 'export',
      description: 'Export settings'
    }
  ];

  const handleToolClick = (tool: any) => {
    if (tool.panel) {
      uiStore.setActivePanel(tool.panel);
    }
    setActiveTool(tool.id);
  };

  return (
    <div className="h-full bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-white font-semibold text-lg">Tools</h2>
        <p className="text-gray-400 text-sm">Select tools and panels</p>
      </div>

      {/* Tools Grid */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool) => (
            <motion.button
              key={tool.id}
              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                activeTool === tool.id || uiStore.activePanel === tool.panel
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToolClick(tool)}
            >
              <tool.icon className="w-6 h-6 mb-2" />
              <span className="text-xs text-center leading-tight">
                {tool.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-gray-400 text-sm font-medium mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <motion.button
              className="w-full flex items-center space-x-3 space-x-reverse p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.electronAPI.newProject()}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>New Project</span>
            </motion.button>
            
            <motion.button
              className="w-full flex items-center space-x-3 space-x-reverse p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => uiStore.setShowImportDialog(true)}
            >
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Import Media</span>
            </motion.button>
          </div>
        </div>

        {/* AI Tools Section */}
        <div className="mt-8">
          <h3 className="text-gray-400 text-sm font-medium mb-3">AI Tools</h3>
          <div className="space-y-2">
            <motion.button
              className="w-full flex items-center space-x-3 space-x-reverse p-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg text-purple-400 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {/* Handle auto transcribe */}}
            >
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
              <span>Auto Transcribe</span>
            </motion.button>
            
            <motion.button
              className="w-full flex items-center space-x-3 space-x-reverse p-2 bg-orange-600/20 hover:bg-orange-600/30 rounded-lg text-orange-400 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {/* Handle TTS generation */}}
            >
              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
              <span>Generate TTS</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-700">
        <motion.button
          className="w-full flex items-center space-x-2 space-x-reverse p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-300 text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/settings'}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </motion.button>
      </div>
    </div>
  );
};

export { LeftToolbar };