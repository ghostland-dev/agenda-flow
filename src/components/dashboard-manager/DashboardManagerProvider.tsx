
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
  // Utiliser nos hooks personnalisés pour organiser la logique
  const { widgetConfigs, handleRemoveWidget, handleAddWidget, handlePanelResize } = useWidgetConfigs(focusMode);
  const { stats, urgentTasks, todayTasks, overdueTasks, widgetData } = useTaskData();
  const { isEditMode, layout, maximizedWidget, handleMaximizeWidget, toggleLayout, toggleEditMode } = useDashboardLayout();

  // Combiner toutes les valeurs et fonctions pour le contexte
  const contextValue = {
    widgetConfigs,
    stats,
    urgentTasks,
    todayTasks,
    overdueTasks,
    isEditMode,
    layout,
    maximizedWidget,
    widgetData,
    handleRemoveWidget,
    handleAddWidget,
    handleMaximizeWidget,
    handlePanelResize,
    toggleLayout,
    toggleEditMode
  };

  return (
    <DashboardManagerContext.Provider value={contextValue}>
      {children}
    </DashboardManagerContext.Provider>
  );
};
