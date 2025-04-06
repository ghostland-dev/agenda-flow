
import React from 'react';
import WidgetControls from '../dashboard/WidgetControls';
import { useDashboardManager } from '@/contexts/dashboard-manager-context';

const DashboardControls: React.FC = () => {
  const { 
    widgetConfigs, 
    layout, 
    isEditMode, 
    handleAddWidget, 
    toggleLayout, 
    toggleEditMode 
  } = useDashboardManager();

  return (
    <WidgetControls
      widgetConfigs={widgetConfigs}
      layout={layout}
      isEditMode={isEditMode}
      onAddWidget={handleAddWidget}
      onToggleLayout={toggleLayout}
      onToggleEditMode={toggleEditMode}
    />
  );
};

export default DashboardControls;
