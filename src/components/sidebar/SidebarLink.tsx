
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

interface SidebarLinkProps {
  title: string;
  path: string;
  icon: LucideIcon;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ title, path, icon: Icon }) => {
  const location = useLocation();
  const isActive = location.pathname === path || 
    (path !== '/' && location.pathname.startsWith(path));
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        asChild
        tooltip={title}
      >
        <Link to={path}>
          <Icon className="h-4 w-4" />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarLink;
