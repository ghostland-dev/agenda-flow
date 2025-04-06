
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

interface SidebarLogoProps {
  title: string;
  subtitle?: string;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ 
  title, 
  subtitle 
}) => {
  const { open, toggleSidebar } = useSidebar();
  
  return (
    <div className={cn(
      "flex items-center px-3 py-6",
      !open ? "justify-center" : "justify-between"
    )}>
      {open && (
        <div>
          <h1 className="text-2xl font-bold text-sidebar-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-sidebar-foreground opacity-70">{subtitle}</p>
          )}
        </div>
      )}
      <button 
        onClick={toggleSidebar}
        className="p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
      >
        {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
  );
};

export default SidebarLogo;
