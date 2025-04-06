
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  Filter, 
  Home, 
  List, 
  PanelLeftClose, 
  PanelLeft, 
  PieChart, 
  Settings, 
  Star, 
  Tag,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';

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

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { open, toggleSidebar } = useSidebar();
  
  return (
    <>
      <SidebarComponent>
        <SidebarRail />
        <SidebarHeader>
          <div className={cn(
            "flex items-center px-3 py-6",
            !open ? "justify-center" : "justify-between"
          )}>
            {open && (
              <div>
                <h1 className="text-2xl font-bold text-sidebar-foreground">TaskFlow</h1>
                <p className="text-sm text-sidebar-foreground opacity-70">Gérez vos tâches</p>
              </div>
            )}
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
            >
              {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || 
                (link.path !== '/' && location.pathname.startsWith(link.path));
              
              return (
                <SidebarMenuItem key={link.path}>
                  <SidebarMenuButton
                    isActive={isActive}
                    asChild
                    tooltip={link.title}
                  >
                    <Link to={link.path}>
                      <link.icon className="h-4 w-4" />
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
          <div className="px-3 py-4 text-xs text-sidebar-foreground opacity-70">
            © 2025 TaskFlow
          </div>
        </SidebarFooter>
      </SidebarComponent>
    </>
  );
};

export default Sidebar;
