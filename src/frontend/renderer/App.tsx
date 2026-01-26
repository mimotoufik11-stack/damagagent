import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSettingsStore } from './stores/settingsStore';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import NewProjectPage from './pages/NewProjectPage';
import SettingsPage from './pages/SettingsPage';
import FontsPage from './pages/FontsPage';

const App: React.FC = () => {
  const { language, theme } = useSettingsStore();

  return (
    <div 
      className={`app ${theme}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      lang={language}
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="new" element={<NewProjectPage />} />
          <Route path="project/:projectId" element={<EditorPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="fonts" element={<FontsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
