
import React from 'react';
import { DashboardManagerContext } from '@/contexts/dashboard-manager-context';
import { useWidgetConfigs } from '@/hooks/use-widget-configs';
import { useTaskData } from '@/hooks/use-task-data';
import { useDashboardLayout } from '@/hooks/use-dashboard-layout';

interface DashboardManagerProviderProps {
  focusMode?: boolean;
  children: React.ReactNode;
}

export const DashboardManagerProvider: React.FC<DashboardManagerProviderProps> = ({ 
  focusMode = false, 
  children 
}) => {
  // Use our specialized hooks
  const { widgetConfigs, handleRemoveWidget, handleAddWidget, handlePanelResize } = useWidgetConfigs(focusMode);
  const { stats, urgentTasks, todayTasks, overdueTasks, widgetData, handleRefreshWidget } = useTaskData();
  const { 
    isEditMode, 
    layout, 
    maximizedWidgetId, 
    widgetsPerRow,
    handleMaximizeWidget, 
    handleToggleLayout, 
    handleToggleEditMode,
    handleChangeWidgetsPerRow
  } = useDashboardLayout();

  // Combine all values and functions for the context
  const contextValue = {
    widgetConfigs,
    stats,
    urgentTasks,
    todayTasks,
    overdueTasks,
    isEditMode,
    layout,
    widgetsPerRow,
    maximizedWidget: maximizedWidgetId,
    widgetData,
    handleRemoveWidget,
    handleAddWidget,
    handleMaximizeWidget,
    handleRefreshWidget,
    handlePanelResize,
    toggleLayout: handleToggleLayout,
    toggleEditMode: handleToggleEditMode,
    changeWidgetsPerRow: handleChangeWidgetsPerRow
  };

  return (
    <DashboardManagerContext.Provider value={contextValue}>
      {children}
    </DashboardManagerContext.Provider>
  );
};
