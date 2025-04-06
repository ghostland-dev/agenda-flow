
import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import TaskService from '@/services/taskService';
import { WidgetConfig, getDefaultWidgetConfigs } from '@/components/dashboard/widgetUtils';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [layout, setLayout] = useState<'grid' | 'list'>(() => {
    try {
      const savedLayout = localStorage.getItem('dashboard-layout');
      // Check if savedLayout exists and is a valid value
      if (savedLayout && (savedLayout === 'grid' || savedLayout === 'list')) {
        return savedLayout as 'grid' | 'list';
      }
      return 'grid'; // Default value if not valid
    } catch (error) {
      console.error('Error loading layout from localStorage:', error);
      return 'grid'; // Default to grid on error
    }
  });
  
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>(() => {
    try {
      const savedConfigs = localStorage.getItem('dashboard-widgets');
      return savedConfigs ? JSON.parse(savedConfigs) : getDefaultWidgetConfigs();
    } catch (error) {
      console.error('Error loading widget configs from localStorage:', error);
      return getDefaultWidgetConfigs(); // Default widgets on error
    }
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [optimizedTasks, setOptimizedTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [maximizedWidgetId, setMaximizedWidgetId] = useState<string | null>(null);

  // Load data for all widgets
  const loadData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Today's tasks
    setTodayTasks(
      TaskService.getTasks({
        dueAfterDate: today,
        dueBeforeDate: tomorrow
      })
    );
    
    // Urgent tasks
    setUrgentTasks(
      TaskService.getTasks({
        urgencies: ['immediate']
      })
    );
    
    // Overdue tasks
    setOverdueTasks(
      TaskService.getTasks({
        dueBeforeDate: today,
        statuses: ['pending', 'in-progress']
      })
    );
    
    // Optimized tasks
    setOptimizedTasks(TaskService.optimizeTasks());
    
    // Statistics
    setStats(TaskService.getTaskStats());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save widget configurations
  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgetConfigs));
  }, [widgetConfigs]);
  
  // Save layout
  useEffect(() => {
    localStorage.setItem('dashboard-layout', layout);
  }, [layout]);
  
  const handleAddWidget = (type: string) => {
    const widgetToAdd = widgetConfigs.find(w => w.type === type && !w.isVisible);
    
    if (widgetToAdd) {
      setWidgetConfigs(prev => 
        prev.map(widget => 
          widget.id === widgetToAdd.id 
            ? { ...widget, isVisible: true } 
            : widget
        )
      );
      
      toast({
        title: "Widget ajouté",
        description: `Le widget "${widgetToAdd.title}" a été ajouté au tableau de bord`,
      });
    }
  };
  
  const handleRemoveWidget = (id: string) => {
    setWidgetConfigs(prev => 
      prev.map(widget => 
        widget.id === id 
          ? { ...widget, isVisible: false } 
          : widget
      )
    );
    
    // If removing the maximized widget, disable maximization
    if (maximizedWidgetId === id) {
      setMaximizedWidgetId(null);
    }
  };
  
  const handleMaximizeWidget = (id: string) => {
    setMaximizedWidgetId(prev => prev === id ? null : id);
    
    if (maximizedWidgetId !== id) {
      toast({
        title: "Widget agrandi",
        description: "Cliquez sur 'Réduire' pour revenir à la vue normale",
      });
    }
  };
  
  const handleRefreshWidget = (id: string) => {
    loadData();
    toast({
      title: "Widget actualisé",
      description: "Les données du widget ont été mises à jour",
    });
  };
  
  const handlePanelResize = (id: string, size: number) => {
    setWidgetConfigs(prev => 
      prev.map(widget => 
        widget.id === id 
          ? { ...widget, size } 
          : widget
      )
    );
  };
  
  const handleSortEnd = (newOrder: WidgetConfig[]) => {
    setWidgetConfigs(newOrder);
  };
  
  const handleToggleLayout = () => {
    setLayout(prev => prev === 'grid' ? 'list' : 'grid');
  };
  
  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
    
    // Disable maximization when entering edit mode
    if (!isEditMode) {
      setMaximizedWidgetId(null);
    }
  };
  
  // Data to pass to widgets
  const widgetData = {
    'today-tasksTasks': todayTasks,
    'urgent-tasksTasks': urgentTasks,
    'overdue-tasksTasks': overdueTasks,
    'task-optimizerTasks': optimizedTasks,
    stats
  };

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
