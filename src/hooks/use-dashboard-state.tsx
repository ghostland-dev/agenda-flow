
import { useTaskData } from './use-task-data';
import { useWidgetConfigs } from './use-widget-configs';
import { useDashboardLayout } from './use-dashboard-layout';
import { WidgetConfig } from '@/components/dashboard/widgetUtils';
import { Task } from '@/types/task';

export interface DashboardStateResult {
  layout: 'grid' | 'list';
  widgetConfigs: WidgetConfig[];
  isEditMode: boolean;
  todayTasks: Task[];
  urgentTasks: Task[];
  overdueTasks: Task[];
  optimizedTasks: Task[];
  stats: any;
  widgetData: any;
  maximizedWidgetId: string | null;
  handleAddWidget: (type: string) => void;
  handleRemoveWidget: (id: string) => void;
  handleMaximizeWidget: (id: string) => void;
  handleRefreshWidget: (id: string) => void;
  handlePanelResize: (id: string, size: number) => void;
  handleSortEnd: (newOrder: WidgetConfig[]) => void;
  handleToggleLayout: () => void;
  handleToggleEditMode: () => void;
}

export function useDashboardState(focusMode = false): DashboardStateResult {
  // Import our specialized hooks
  const { 
    widgetConfigs, 
    handleAddWidget, 
    handleRemoveWidget, 
    handlePanelResize, 
    handleSortEnd 
  } = useWidgetConfigs(focusMode);
  
  const { 
    todayTasks, 
    urgentTasks, 
    overdueTasks, 
    optimizedTasks, 
    stats, 
    widgetData, 
    handleRefreshWidget 
  } = useTaskData();
  
  const { 
    layout, 
    isEditMode, 
    maximizedWidgetId, 
    handleMaximizeWidget, 
    handleToggleLayout, 
    handleToggleEditMode 
  } = useDashboardLayout();

  // Combine all the hooks into one result
  return {
    layout,
    widgetConfigs,
    isEditMode,
    todayTasks,
    urgentTasks,
    overdueTasks,
    optimizedTasks,
    stats,
    widgetData,
    maximizedWidgetId,
    handleAddWidget,
    handleRemoveWidget,
    handleMaximizeWidget,
    handleRefreshWidget,
    handlePanelResize,
    handleSortEnd,
    handleToggleLayout,
    handleToggleEditMode
  };
}
