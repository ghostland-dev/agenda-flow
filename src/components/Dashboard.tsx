
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
    const savedLayout = localStorage.getItem('dashboard-layout');
    return savedLayout ? JSON.parse(savedLayout) : 'grid';
  });
  
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>(() => {
    const savedConfigs = localStorage.getItem('dashboard-widgets');
    return savedConfigs ? JSON.parse(savedConfigs) : getDefaultWidgetConfigs();
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
        completed: false
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
    localStorage.setItem('dashboard-layout', JSON.stringify(layout));
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
    'today-tasks': todayTasks,
    'urgent-tasks': urgentTasks,
    'overdue-tasks': overdueTasks,
    stats,
    'task-optimizer': optimizedTasks
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
