
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, CheckSquare, Clock, Filter, Home, List, PieChart, Settings, Star, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const Sidebar = ({ isMobile, setIsSidebarOpen }: { isMobile?: boolean; setIsSidebarOpen?: (open: boolean) => void }) => {
  const location = useLocation();
  
  const closeSidebar = () => {
    if (isMobile && setIsSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };
  
  return (
    <aside className={cn(
      "h-full bg-sidebar border-r border-sidebar-border px-3 py-6 flex flex-col",
      isMobile ? "w-full" : "w-60 min-w-60"
    )}>
      <div className="px-4 py-2 mb-6">
        <h1 className="text-2xl font-bold text-sidebar-foreground">TaskFlow</h1>
        <p className="text-sm text-sidebar-foreground opacity-70">Gérez vos tâches efficacement</p>
      </div>
      
      <nav className="space-y-1 flex-1">
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
      
      <div className="mt-auto px-4 py-2">
        <div className="border-t border-sidebar-border pt-4">
          <p className="text-xs text-sidebar-foreground opacity-70">© 2025 TaskFlow</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
