
// Update SidebarNavLinks to include the new pages

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, LayoutDashboard, CheckSquare, BarChart2, BookTemplate, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

const SidebarNavLinks: React.FC = () => {
  const { isOpen } = useSidebar();
  
  const links = [
    {
      href: '/',
      label: 'Tableau de bord',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      href: '/tasks',
      label: 'Tâches',
      icon: <CheckSquare className="h-5 w-5" />
    },
    {
      href: '/calendar',
      label: 'Calendrier',
      icon: <Calendar className="h-5 w-5" />
    },
    {
      href: '/focus',
      label: 'Mode Focus',
      icon: <Timer className="h-5 w-5" />
    },
    {
      href: '/templates',
      label: 'Modèles',
      icon: <BookTemplate className="h-5 w-5" />
    },
    {
      href: '/statistics',
      label: 'Statistiques',
      icon: <BarChart2 className="h-5 w-5" />
    },
  ];

  return (
    <nav className="space-y-1">
      {links.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )
          }
          end={link.href === '/'}
        >
          {link.icon}
          <span className={cn(isOpen ? 'opacity-100' : 'opacity-0 md:opacity-100')}>
            {link.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default SidebarNavLinks;
