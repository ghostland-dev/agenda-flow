
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import TaskService from '@/services/taskService';
import { Task } from '@/types/task';
import { 
  WidgetConfig, 
  getWidgetTitle, 
  getWidgetDescription, 
  getDefaultWidgets 
} from '../dashboard/widgetUtils';

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
  handlePanelResize: (id: string, size: number) => void;
  toggleLayout: () => void;
  toggleEditMode: () => void;
}

const DashboardManagerContext = createContext<DashboardManagerContextProps | undefined>(undefined);

export const useDashboardManager = () => {
  const context = useContext(DashboardManagerContext);
  if (!context) {
    throw new Error('useDashboardManager must be used within a DashboardManagerProvider');
  }
  return context;
};

interface DashboardManagerProviderProps {
  focusMode?: boolean;
  children: React.ReactNode;
}

export const DashboardManagerProvider: React.FC<DashboardManagerProviderProps> = ({ 
  focusMode = false, 
  children 
}) => {
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>(() => {
    try {
      const savedWidgets = localStorage.getItem('dashboard-widgets');
      if (savedWidgets) {
        return JSON.parse(savedWidgets);
      }
    } catch (e) {
      console.error('Failed to parse widgets', e);
    }
    
    // Default widgets
    return getDefaultWidgets(focusMode);
  });
  
  const [stats, setStats] = useState<any>(null);
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'list'>(() => {
    try {
      const savedLayout = localStorage.getItem('dashboard-layout');
      return savedLayout === 'list' ? 'list' : 'grid';
    } catch (error) {
      console.error('Error loading layout:', error);
      return 'grid';
    }
  });
  const [maximizedWidget, setMaximizedWidget] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    const taskStats = TaskService.getTaskStats();
    setStats(taskStats);
    
    const urgent = TaskService.getTasks({
      urgencies: ['immediate'],
      sortBy: 'dueDate',
      sortDirection: 'asc',
    }).slice(0, 5);
    setUrgentTasks(urgent);
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    today.setHours(0, 0, 0, 0);
    
    const todayTasksList = TaskService.getTasks({
      dueAfterDate: today,
      dueBeforeDate: tomorrow,
      sortBy: 'priority',
      sortDirection: 'desc',
    }).slice(0, 5);
    setTodayTasks(todayTasksList);
    
    const overdue = TaskService.getTasks({
      dueBeforeDate: today,
      statuses: ['pending', 'in-progress'],
      sortBy: 'dueDate',
      sortDirection: 'asc',
    }).slice(0, 5);
    setOverdueTasks(overdue);
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgetConfigs));
  }, [widgetConfigs]);

  useEffect(() => {
    localStorage.setItem('dashboard-layout', layout);
  }, [layout]);

  useEffect(() => {
    if (focusMode) {
      setWidgetConfigs(prevWidgets => 
        prevWidgets.map(widget => ({
          ...widget,
          isVisible: ['today-tasks', 'habits', 'urgent-tasks'].includes(widget.type)
        }))
      );
    }
  }, [focusMode]);

  const handleRemoveWidget = (id: string) => {
    setWidgetConfigs(prevWidgets => 
      prevWidgets.map(widget => 
        widget.id === id ? { ...widget, isVisible: false } : widget
      )
    );
    
    toast({
      title: 'Widget supprimé',
      description: 'Le widget a été retiré du tableau de bord',
    });
  };

  const handleAddWidget = (type: string) => {
    const existingWidget = widgetConfigs.find(w => w.type === type && !w.isVisible);
    
    if (existingWidget) {
      setWidgetConfigs(prevWidgets => 
        prevWidgets.map(widget => 
          widget.id === existingWidget.id ? { ...widget, isVisible: true } : widget
        )
      );
    } else {
      const newId = `widget-${Date.now()}`;
      const title = getWidgetTitle(type);
      
      setWidgetConfigs(prevWidgets => [
        ...prevWidgets,
        {
          id: newId,
          title,
          type,
          size: 33,
          isVisible: true,
          description: getWidgetDescription(type)
        }
      ]);
    }
    
    toast({
      title: 'Widget ajouté',
      description: `Le widget ${getWidgetTitle(type)} a été ajouté au tableau de bord`,
    });
  };

  const handleMaximizeWidget = (id: string) => {
    setMaximizedWidget(maximizedWidget === id ? null : id);
  };

  const handlePanelResize = (id: string, size: number) => {
    setWidgetConfigs(prevWidgets => 
      prevWidgets.map(widget => 
        widget.id === id ? { ...widget, size } : widget
      )
    );
  };

  const toggleLayout = () => {
    setLayout(layout === 'grid' ? 'list' : 'grid');
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const widgetData = {
    stats,
    'today-tasksTasks': todayTasks,
    'urgent-tasksTasks': urgentTasks,
    'overdue-tasksTasks': overdueTasks
  };

  const value = {
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
    <DashboardManagerContext.Provider value={value}>
      {children}
    </DashboardManagerContext.Provider>
  );
};
