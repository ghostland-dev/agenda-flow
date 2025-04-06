
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, CheckSquare, Clock, Filter, Home, List, PanelLeftClose, PanelLeft, PieChart, Settings, Star, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useSidebar } from './ui/sidebar';

const navLinks = [
  { title: 'Tableau de bord', path: '/', icon: Home },
  { title: 'Toutes les tâches', path: '/tasks', icon: List },
  { title: 'Urgentes', path: '/tasks/urgent', icon: Clock },
  { title: 'Importantes', path: '/tasks/important', icon: Star },
  { title: 'Aujourd\'hui', path: '/tasks/today', icon: Calendar },
  { title: 'Cette semaine', path: '/tasks/week', icon: CheckSquare },
  { title: 'Catégories', path: '/categories', icon: Tag },
  { title: 'Statistiques', path: '/stats', icon: PieChart },
  { title: 'Filtres', path: '/filters', icon: Filter },
  { title: 'Paramètres', path: '/settings', icon: Settings },
];

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, setIsOpen }) => {
  const location = useLocation();
  const { open, setOpen, toggleSidebar } = useSidebar();
  
  const closeSidebar = () => {
    if (isMobile && setIsOpen) {
      setIsOpen(false);
    }
  };
  
  const isCollapsed = !open;
  
  return (
    <>
      {/* Sidebar pour ordinateur */}
      <aside className={cn(
        "h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isMobile ? "hidden" : "block",
        isCollapsed ? "w-16" : "w-60"
      )}>
        <div className="flex flex-col h-full">
          <div className={cn(
            "flex items-center px-3 py-6",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {!isCollapsed && (
              <div>
                <h1 className="text-2xl font-bold text-sidebar-foreground">TaskFlow</h1>
                <p className="text-sm text-sidebar-foreground opacity-70">Gérez vos tâches</p>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
            </Button>
          </div>
          
          <nav className="space-y-1 flex-1 px-3 py-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || 
                (link.path !== '/' && location.pathname.startsWith(link.path));
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeSidebar}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    isCollapsed ? "justify-center" : "gap-3"
                  )}
                  title={isCollapsed ? link.title : undefined}
                >
                  <link.icon className="h-4 w-4" />
                  {!isCollapsed && <span>{link.title}</span>}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-auto px-4 py-2">
            <div className="border-t border-sidebar-border pt-4">
              {!isCollapsed && (
                <p className="text-xs text-sidebar-foreground opacity-70">© 2025 TaskFlow</p>
              )}
            </div>
          </div>
        </div>
      </aside>
      
      {/* Sidebar pour mobile */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-40 transition-transform transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen?.(false)}></div>
          <div className="relative z-50 h-full w-60 bg-sidebar">
            <div className="p-4 flex justify-between items-center border-b border-sidebar-border">
              <div>
                <h1 className="text-2xl font-bold text-sidebar-foreground">TaskFlow</h1>
                <p className="text-xs text-sidebar-foreground opacity-70">Gérez vos tâches</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen?.(false)}
                className="text-sidebar-foreground"
              >
                <PanelLeftClose size={20} />
              </Button>
            </div>
            
            <nav className="space-y-1 p-3">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || 
                  (link.path !== '/' && location.pathname.startsWith(link.path));
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeSidebar}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.title}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="absolute bottom-0 w-full px-4 py-2 border-t border-sidebar-border">
              <p className="text-xs text-sidebar-foreground opacity-70">© 2025 TaskFlow</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
