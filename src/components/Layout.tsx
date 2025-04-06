
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Fermer le menu latéral lors d'un changement de page sur mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="relative min-h-screen flex">
      {/* Sidebar pour ordinateur */}
      <div className={`hidden md:block`}>
        <Sidebar />
      </div>
      
      {/* Sidebar pour mobile */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-40 transition-transform transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative z-50 h-full w-60">
            <Sidebar isMobile={true} setIsSidebarOpen={setIsSidebarOpen} />
          </div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={toggleSidebar} onSearch={setSearchQuery} />
        
        <main className="flex-1 overflow-auto bg-background">
          {React.cloneElement(children as React.ReactElement, { searchQuery })}
        </main>
      </div>
    </div>
  );
};

export default Layout;
