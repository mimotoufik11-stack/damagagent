import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiVideo, FiTrash2, FiEdit, FiPlus, FiClock } from 'react-icons/fi';
import { storageService } from '../services/storageService';

function ProjectManager() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, name

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const loadedProjects = await storageService.getAllProjects();
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleOpenProject = (project) => {
    navigate('/editor', { state: { videoPath: project.videoPath, project } });
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;

    try {
      await storageService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('فشل في حذف المشروع');
    }
  };

  const handleRenameProject = async (project) => {
    const newName = prompt('أدخل الاسم الجديد:', project.name);
    if (!newName || newName === project.name) return;

    try {
      const updatedProject = { ...project, name: newName };
      await storageService.saveProject(updatedProject);
      setProjects(projects.map(p => p.id === project.id ? updatedProject : p));
    } catch (error) {
      console.error('Failed to rename project:', error);
      alert('فشل في إعادة تسمية المشروع');
    }
  };

  const filteredProjects = projects
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
      return a.name.localeCompare(b.name, 'ar');
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {/* Header */}
      <header className="border-b border-dark-700 bg-dark-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="btn-icon" title="العودة للرئيسية">
                <FiHome className="text-xl" />
              </button>
              <h1 className="text-2xl font-bold">مشاريعي</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus />
              <span>مشروع جديد</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="ابحث عن مشروع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field flex-1"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-48"
          >
            <option value="date">ترتيب حسب التاريخ</option>
            <option value="name">ترتيب حسب الاسم</option>
          </select>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <FiVideo className="text-6xl text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">لا توجد مشاريع بعد</h3>
            <p className="text-dark-400 mb-6">ابدأ بإنشاء مشروع جديد لتحرير الفيديو</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              إنشاء مشروع جديد
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="card hover:border-primary-500/50 transition-all duration-300 cursor-pointer group"
                onClick={() => handleOpenProject(project)}
              >
                {/* Thumbnail */}
                <div className="bg-dark-900 rounded-lg mb-4 h-40 flex items-center justify-center relative overflow-hidden">
                  <FiVideo className="text-6xl text-dark-600" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <span className="text-white font-medium">فتح المشروع</span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold truncate">{project.name}</h3>
                  
                  {project.videoMetadata && (
                    <div className="flex items-center gap-3 text-sm text-dark-400">
                      <span>{project.videoMetadata.width}x{project.videoMetadata.height}</span>
                      <span>•</span>
                      <span>{Math.round(project.videoMetadata.duration)}s</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-dark-500">
                    <FiClock className="text-xs" />
                    <span>{formatDate(project.updatedAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameProject(project);
                      }}
                      className="btn-icon text-sm flex items-center gap-1"
                      title="إعادة تسمية"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="btn-icon text-sm flex items-center gap-1 text-red-400 hover:bg-red-500/10"
                      title="حذف"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProjectManager;
