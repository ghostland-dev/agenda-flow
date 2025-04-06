
import React from 'react';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail
} from '@/components/ui/sidebar';

// Import our new components
import SidebarLogo from './sidebar/SidebarLogo';
import SidebarNavLinks from './sidebar/SidebarNavLinks';
import SidebarFooterContent from './sidebar/SidebarFooterContent';

const Sidebar: React.FC = () => {
  return (
    <SidebarComponent>
      <SidebarRail />
      <SidebarHeader>
        <SidebarLogo title="TaskFlow" subtitle="Gérez vos tâches" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarNavLinks />
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarFooterContent />
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
