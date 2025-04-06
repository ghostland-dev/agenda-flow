import React, { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import TaskService from '@/services/taskService';
import DashboardLayout from './dashboard/DashboardLayout';
import WidgetControls from './dashboard/WidgetControls';
import { WidgetConfig, getDefaultWidgetConfigs } from './dashboard/widgetUtils';
import { ReactSortable } from 'react-sortablejs';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC<{ focusMode?: boolean }> = ({ focusMode = false }) => {
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
  useEffect(() => {
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
        statuses: ['pending', 'in-progress'] // Fix: use statuses filter instead of completed
      })
    );
    
    // Tâches optimisées
    setOptimizedTasks(TaskService.optimizeTasks());
    
    // Statistiques
    setStats(TaskService.getTaskStats());
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
  
  return (
    <div className="container py-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">
            {focusMode 
              ? "Vue concentrée sur vos tâches essentielles" 
              : "Bienvenue sur votre tableau de bord personnalisé"}
          </p>
        </div>
        
        {!focusMode && (
          <WidgetControls 
            widgetConfigs={widgetConfigs}
            layout={layout}
            isEditMode={isEditMode}
            onAddWidget={handleAddWidget}
            onToggleLayout={handleToggleLayout}
            onToggleEditMode={handleToggleEditMode}
          />
        )}
      </div>
      
      {isEditMode ? (
        <ReactSortable 
          list={widgetConfigs.filter(w => w.isVisible)} 
          setList={handleSortEnd as any}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          handle=".drag-handle"
        >
          {widgetConfigs
            .filter(widget => widget.isVisible)
            .map(widget => (
              <div key={widget.id} className="widget-item" data-id={widget.id}>
                <DashboardLayout
                  layout="grid"
                  widgetConfigs={[widget]}
                  isEditMode={isEditMode}
                  widgetData={widgetData}
                  onRemoveWidget={handleRemoveWidget}
                  onMaximizeWidget={handleMaximizeWidget}
                  onPanelResize={handlePanelResize}
                />
              </div>
            ))}
        </ReactSortable>
      ) : (
        <DashboardLayout
          layout={layout}
          widgetConfigs={widgetConfigs.filter(w => w.isVisible)}
          isEditMode={isEditMode}
          widgetData={widgetData}
          onRemoveWidget={handleRemoveWidget}
          onMaximizeWidget={handleMaximizeWidget}
          onPanelResize={handlePanelResize}
        />
      )}
    </div>
  );
};

export default Dashboard;
