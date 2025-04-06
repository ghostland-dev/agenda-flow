
import React from 'react';
import WidgetControls from '../dashboard/WidgetControls';
import { useDashboardManager } from '@/contexts/dashboard-manager-context';

const DashboardControls: React.FC = () => {
  const { 
    widgetConfigs, 
    layout, 
    widgetsPerRow,
    isEditMode, 
    handleAddWidget, 
    toggleLayout, 
    toggleEditMode,
    changeWidgetsPerRow
  } = useDashboardManager();

  return (
    <WidgetControls
      widgetConfigs={widgetConfigs}
      layout={layout}
      widgetsPerRow={widgetsPerRow || 3}
      isEditMode={isEditMode}
      onAddWidget={handleAddWidget}
      onToggleLayout={toggleLayout}
      onToggleEditMode={toggleEditMode}
      onChangeWidgetsPerRow={changeWidgetsPerRow}
    />
  );
};

export default DashboardControls;
