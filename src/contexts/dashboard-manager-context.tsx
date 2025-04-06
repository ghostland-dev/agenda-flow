
import { createContext, useContext } from 'react';
import { WidgetConfig } from '@/components/dashboard/widgetUtils';
import { Task } from '@/types/task';

interface DashboardManagerContextProps {
  widgetConfigs: WidgetConfig[];
  stats: any;
  urgentTasks: Task[];
  todayTasks: Task[];
  overdueTasks: Task[];
  isEditMode: boolean;
  layout: 'grid' | 'list';
  maximizedWidget: string | null;
  widgetData: any;
  handleRemoveWidget: (id: string) => void;
  handleAddWidget: (type: string) => void;
  handleMaximizeWidget: (id: string) => void;
  handleRefreshWidget?: (id: string) => void;
  handlePanelResize: (id: string, size: number) => void;
  toggleLayout: () => void;
  toggleEditMode: () => void;
}

export const DashboardManagerContext = createContext<DashboardManagerContextProps | undefined>(undefined);

export const useDashboardManager = () => {
  const context = useContext(DashboardManagerContext);
  if (!context) {
    throw new Error('useDashboardManager must be used within a DashboardManagerProvider');
  }
  return context;
};
