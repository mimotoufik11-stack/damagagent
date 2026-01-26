import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { EditorPage } from './pages/EditorPage';
import { NewProjectPage } from './pages/NewProjectPage';
import { SettingsPage } from './pages/SettingsPage';
import { FontsPage } from './pages/FontsPage';
import { GlobalProvider } from './context/GlobalContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './styles/globals.css';
import './styles/islamic-theme.css';
import './styles/glassmorphism.css';
import './styles/rtl.css';
import './styles/animations.css';
import './styles/timeline.css';
import './styles/variables.css';

const App: React.FC = () => {
  useKeyboardShortcuts();

  return (
    <GlobalProvider>
      <Router>
        <div className="app" dir="rtl">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/new-project" element={<NewProjectPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/fonts" element={<FontsPage />} />
          </Routes>
        </div>
      </Router>
    </GlobalProvider>
  );
};

export default App;