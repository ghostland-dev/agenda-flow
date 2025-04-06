
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import FocusToggle from './FocusToggle';
import { SidebarProvider } from './ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusMode, setFocusMode] = useState(() => {
    const saved = localStorage.getItem('focus-mode');
    return saved ? JSON.parse(saved) : false;
  });
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Fermer le menu latéral lors d'un changement de page sur mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  // Save focus mode preference
  useEffect(() => {
    localStorage.setItem('focus-mode', JSON.stringify(focusMode));
  }, [focusMode]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="relative min-h-screen flex">
        {/* Sidebar pour ordinateur et mobile */}
        <Sidebar isMobile={isMobile} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <div className="flex-1 flex flex-col">
          <Header 
            toggleSidebar={toggleSidebar} 
            onSearch={setSearchQuery} 
            extraContent={<FocusToggle isFocused={focusMode} onToggle={setFocusMode} />}
          />
          
          <main className="flex-1 overflow-auto bg-background">
            {React.cloneElement(children as React.ReactElement, { searchQuery, focusMode })}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
