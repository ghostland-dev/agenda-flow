
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import FocusToggle from './FocusToggle';
import { SidebarProvider, useSidebar } from './ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [focusMode, setFocusMode] = useState(() => {
    const saved = localStorage.getItem('focus-mode');
    return saved ? JSON.parse(saved) : false;
  });
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Save focus mode preference
  useEffect(() => {
    localStorage.setItem('focus-mode', JSON.stringify(focusMode));
  }, [focusMode]);
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="relative min-h-screen flex w-full">
        {/* Sidebar is now controlled through the SidebarProvider */}
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header 
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
