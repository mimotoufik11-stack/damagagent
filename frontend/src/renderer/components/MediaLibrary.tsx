import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Play,
  File,
  Image,
  Music,
  Video,
  Plus,
  FolderPlus
} from 'lucide-react';
import { useProjectStore } from '../store/projectStore';

const MediaLibrary: React.FC = () => {
  const projectStore = useProjectStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'audio' | 'image'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock media files for demonstration
  const mediaFiles = [
    {
      id: '1',
      name: 'بسم الله الرحمن الرحيم',
      type: 'audio',
      duration: '0:05',
      thumbnail: '/api/placeholder/150/150',
      path: '/audio/bismillah.mp3'
    },
    {
      id: '2',
      name: 'سورة الفاتحة',
      type: 'video',
      duration: '2:30',
      thumbnail: '/api/placeholder/150/150',
      path: '/video/fatiha.mp4'
    },
    {
      id: '3',
      name: 'إسلامية - خلفية زرقاء',
      type: 'image',
      duration: null,
      thumbnail: '/api/placeholder/150/150',
      path: '/images/islamic-bg.jpg'
    }
  ];

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleImport = async () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      try {
        const result = await window.electronAPI.importMedia(
          files.map(f => f.path)
        );
        if (result.success) {
          // Add imported media to project
          projectStore.updateProject({
            assets: [...(projectStore.currentProject?.assets || []), ...result.media]
          });
        }
      } catch (error) {
        console.error('Failed to import media:', error);
      }
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-blue-400" />;
      case 'audio':
        return <Music className="w-5 h-5 text-green-400" />;
      case 'image':
        return <Image className="w-5 h-5 text-purple-400" />;
      default:
        return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="h-full bg-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">Media Library</h2>
          <div className="flex items-center space-x-2 space-x-reverse">
            <motion.button
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-2 space-x-reverse mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search media files..."
              className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="image">Images</option>
          </select>
        </div>

        {/* Import Button */}
        <motion.button
          className="w-full flex items-center justify-center space-x-2 space-x-reverse bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleImport}
        >
          <Plus className="w-4 h-4" />
          <span>Import Media</span>
        </motion.button>
      </div>

      {/* Media Grid/List */}
      <div className="flex-1 overflow-auto p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                className="bg-slate-700 rounded-lg overflow-hidden hover:bg-slate-600 transition-colors cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="aspect-square bg-slate-800 relative">
                  {file.thumbnail ? (
                    <img 
                      src={file.thumbnail} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-white font-medium text-sm truncate">{file.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-400 text-xs capitalize">{file.type}</span>
                    {file.duration && (
                      <span className="text-gray-400 text-xs">{file.duration}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                className="flex items-center space-x-3 space-x-reverse bg-slate-700 rounded-lg p-3 hover:bg-slate-600 transition-colors cursor-pointer"
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{file.name}</h4>
                  <div className="flex items-center space-x-2 space-x-reverse text-gray-400 text-sm">
                    <span className="capitalize">{file.type}</span>
                    {file.duration && <span>• {file.duration}</span>}
                  </div>
                </div>
                <Play className="w-4 h-4 text-gray-400" />
              </motion.div>
            ))}
          </div>
        )}

        {filteredFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FolderPlus className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-medium mb-2">No media files found</h3>
            <p className="text-sm text-center mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter'
                : 'Import media files to get started'
              }
            </p>
            <motion.button
              className="flex items-center space-x-2 space-x-reverse bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleImport}
            >
              <Plus className="w-4 h-4" />
              <span>Import Media</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="video/*,audio/*,image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export { MediaLibrary };