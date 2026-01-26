import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PlayCircle, 
  FileText, 
  Settings, 
  Palette,
  Clock,
  Users,
  Star,
  Download,
  BookOpen,
  Video,
  Mic,
  Type
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState([
    {
      id: '1',
      name: 'سورة البقرة - الآيات 1-10',
      thumbnail: '/api/placeholder/300/200',
      duration: '5:30',
      created: '2024-01-15'
    },
    {
      id: '2', 
      name: 'دعاء الصباح',
      thumbnail: '/api/placeholder/300/200',
      duration: '3:45',
      created: '2024-01-12'
    }
  ]);

  const features = [
    {
      icon: Video,
      title: 'Professional Video Editor',
      description: 'Timeline-based editing with multi-track support',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Mic,
      title: 'AI Audio Processing',
      description: 'Whisper transcription and TTS voice synthesis',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Type,
      title: 'Arabic Typography',
      description: 'Beautiful RTL text rendering with Islamic fonts',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Palette,
      title: 'Islamic Themes',
      description: 'Pre-built templates with Islamic aesthetics',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const quickActions = [
    {
      icon: PlayCircle,
      title: 'Continue Project',
      subtitle: 'Open last edited project',
      action: () => navigate('/editor'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: FileText,
      title: 'New Project',
      subtitle: 'Create a new video project',
      action: () => navigate('/new-project'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'Configure your preferences',
      action: () => navigate('/settings'),
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <motion.header 
        className="bg-black/20 backdrop-blur-sm border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-4 space-x-reverse"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  دماج للقرآن الكريم
                </h1>
                <p className="text-gray-400 text-sm">Dammaj Al-Quran</p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <motion.button
                className="flex items-center space-x-2 space-x-reverse bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="py-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="container mx-auto text-center">
          <motion.h2 
            className="text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Professional Quran Video Studio
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Create beautiful Quran videos with advanced AI tools, Arabic typography, 
            and professional video editing features designed specifically for Islamic content.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                className={`flex items-center space-x-3 space-x-reverse ${action.color} px-6 py-3 rounded-xl transition-all shadow-lg`}
                onClick={action.action}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <action.icon className="w-5 h-5" />
                <div className="text-right">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-sm opacity-80">{action.subtitle}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        className="py-16 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
                whileHover={{ scale: 1.02, y: -5 }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <motion.section 
          className="py-16 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold">Recent Projects</h3>
              <motion.button
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                View All Projects →
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <motion.div
                  key={project.id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => navigate('/editor', { state: { projectId: project.id } })}
                >
                  <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white/60" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">{project.name}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span className="flex items-center space-x-1 space-x-reverse">
                        <Clock className="w-4 h-4" />
                        <span>{project.duration}</span>
                      </span>
                      <span>{new Date(project.created).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Stats Section */}
      <motion.section 
        className="py-16 px-6 bg-white/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">1000+</div>
              <div className="text-gray-400">Videos Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-gray-400">Islamic Fonts</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">15</div>
              <div className="text-gray-400">AI Voices</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2024 Dammaj Al-Quran. Made with ❤️ for the Ummah.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            بسم الله الرحمن الرحيم
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export { HomePage };