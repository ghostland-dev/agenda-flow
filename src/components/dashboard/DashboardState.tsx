
import React, { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import TaskService from '@/services/taskService';
import { WidgetConfig, getDefaultWidgetConfigs } from './widgetUtils';
import { useToast } from '@/hooks/use-toast';

export interface DashboardStateProps {
  focusMode?: boolean;
  children: (props: DashboardStateData) => React.ReactNode;
}

export interface DashboardStateData {
  layout: 'grid' | 'list';
  widgetConfigs: WidgetConfig[];
  isEditMode: boolean;
  todayTasks: Task[];
  urgentTasks: Task[];
  overdueTasks: Task[];
  optimizedTasks: Task[];
  stats: any;
  widgetData: any;
  handleAddWidget: (type: string) => void;
  handleRemoveWidget: (id: string) => void;
  handleMaximizeWidget: (id: string) => void;
  handleRefreshWidget: (id: string) => void;
  handlePanelResize: (id: string, size: number) => void;
  handleSortEnd: (newOrder: WidgetConfig[]) => void;
  handleToggleLayout: () => void;
  handleToggleEditMode: () => void;
}

const DashboardState: React.FC<DashboardStateProps> = ({ focusMode = false, children }) => {
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

  // Charger les données pour tous les widgets
  const loadData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Aujourd'hui
    setTodayTasks(
      TaskService.getTasks({
        dueAfterDate: today,
        dueBeforeDate: tomorrow
      })
    );
    
    // Urgentes
    setUrgentTasks(
      TaskService.getTasks({
        urgencies: ['immediate']
      })
    );
    
    // En retard
    setOverdueTasks(
      TaskService.getTasks({
        dueBeforeDate: today,
        statuses: ['pending', 'in-progress']
      })
    );
    
    // Tâches optimisées
    setOptimizedTasks(TaskService.optimizeTasks());
    
    // Statistiques
    setStats(TaskService.getTaskStats());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sauvegarder les configurations des widgets
  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgetConfigs));
  }, [widgetConfigs]);
  
  // Sauvegarder la disposition
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
  };
  
  const handleMaximizeWidget = (id: string) => {
    // Implémenter la maximisation si nécessaire
    console.log('Maximize widget', id);
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
  };
  
  // Données à passer aux widgets
  const widgetData = {
    'today-tasksTasks': todayTasks,
    'urgent-tasksTasks': urgentTasks,
    'overdue-tasksTasks': overdueTasks,
    stats,
    'task-optimizerTasks': optimizedTasks
  };

  return children({
    layout,
    widgetConfigs,
    isEditMode,
    todayTasks,
    urgentTasks,
    overdueTasks,
    optimizedTasks,
    stats,
    widgetData,
    handleAddWidget,
    handleRemoveWidget,
    handleMaximizeWidget,
    handleRefreshWidget,
    handlePanelResize,
    handleSortEnd,
    handleToggleLayout,
    handleToggleEditMode
  });
};

export default DashboardState;
