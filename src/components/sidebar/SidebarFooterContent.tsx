
import React from 'react';

const SidebarFooterContent: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="px-3 py-4 text-xs text-sidebar-foreground opacity-70">
      © {currentYear} TaskFlow
    </div>
  );
};

export default SidebarFooterContent;
