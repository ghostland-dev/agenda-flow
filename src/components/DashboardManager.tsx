import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import TaskService from '@/services/taskService';
import { Task } from '@/types/task';
import DashboardWidget from './dashboard/DashboardWidget';
import WidgetContent from './dashboard/WidgetContent';
import WidgetControls from './dashboard/WidgetControls';
import DashboardLayout from './dashboard/DashboardLayout';
import { 
  WidgetConfig, 
  getWidgetTitle, 
  getWidgetDescription, 
  getDefaultWidgets 
} from './dashboard/widgetUtils';

interface DashboardManagerProps {
  focusMode?: boolean;
  searchQuery?: string;
}

const DashboardManager: React.FC<DashboardManagerProps> = ({ focusMode = false, searchQuery }) => {
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
      return (savedLayout === 'list' ? 'list' : 'grid') as 'grid' | 'list';
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

  if (!stats) {
    return <div className="p-8 text-center">Chargement des données...</div>;
  }

  if (maximizedWidget) {
    const widget = widgetConfigs.find(w => w.id === maximizedWidget && w.isVisible);
    if (widget) {
      return (
        <div className="p-4">
          <DashboardWidget
            id={widget.id}
            title={widget.title}
            description={widget.description}
            onRemove={handleRemoveWidget}
            onMaximize={handleMaximizeWidget}
            isMaximized={true}
            className="h-[calc(100vh-160px)]"
          >
            <WidgetContent
              type={widget.type}
              data={{
                tasks: 
                  widget.type === 'today-tasks' ? todayTasks :
                  widget.type === 'urgent-tasks' ? urgentTasks :
                  widget.type === 'overdue-tasks' ? overdueTasks : 
                  undefined,
                stats
              }}
            />
          </DashboardWidget>
        </div>
      );
    }
  }

  const widgetData = {
    stats,
    'today-tasksTasks': todayTasks,
    'urgent-tasksTasks': urgentTasks,
    'overdue-tasksTasks': overdueTasks
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Tableau de bord</h1>
        <WidgetControls
          widgetConfigs={widgetConfigs}
          layout={layout}
          isEditMode={isEditMode}
          onAddWidget={handleAddWidget}
          onToggleLayout={toggleLayout}
          onToggleEditMode={toggleEditMode}
        />
      </div>
      
      <DashboardLayout
        layout={layout}
        widgetConfigs={widgetConfigs}
        isEditMode={isEditMode}
        widgetData={widgetData}
        onRemoveWidget={handleRemoveWidget}
        onMaximizeWidget={handleMaximizeWidget}
        onPanelResize={handlePanelResize}
      />
    </div>
  );
};

export default DashboardManager;
