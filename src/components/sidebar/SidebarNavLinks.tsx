
import React from 'react';
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  Filter, 
  Home, 
  List, 
  PieChart, 
  Settings, 
  Star, 
  Tag 
} from 'lucide-react';
import SidebarLink from './SidebarLink';
import { SidebarMenu } from '@/components/ui/sidebar';

// Navigation links configuration
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

const SidebarNavLinks: React.FC = () => {
  return (
    <SidebarMenu>
      {navLinks.map((link) => (
        <SidebarLink 
          key={link.path} 
          title={link.title} 
          path={link.path} 
          icon={link.icon} 
        />
      ))}
    </SidebarMenu>
  );
};

export default SidebarNavLinks;
