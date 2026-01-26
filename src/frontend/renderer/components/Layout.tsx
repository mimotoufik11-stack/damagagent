import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSettingsStore } from '../../stores/settingsStore';
import { useUIStore } from '../../stores/uiStore';
import TitleBar from '../TitleBar';
import Sidebar from '../Sidebar';
import RightPanel from '../RightPanel';
import ToastContainer from '../ToastContainer';
import Modal from '../Modal';
import LoadingOverlay from '../LoadingOverlay';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useSettingsStore();
  const { leftPanelCollapsed, rightPanelCollapsed } = useUIStore();

  const isEditor = location.pathname.includes('/project/');

  return (
    <div className={`${styles.layout} ${theme}`}>
      {isEditor && <TitleBar />}
      
      <div className={styles.container}>
        {isEditor && !leftPanelCollapsed && (
          <aside className={styles.leftPanel}>
            <Sidebar />
          </aside>
        )}
        
        <main className={styles.main}>
          <Outlet />
        </main>
        
        {isEditor && !rightPanelCollapsed && (
          <aside className={styles.rightPanel}>
            <RightPanel />
          </aside>
        )}
      </div>
      
      <ToastContainer />
      <Modal />
      <LoadingOverlay />
    </div>
  );
};

export default Layout;
