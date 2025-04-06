
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import DashboardWidget from './DashboardWidget';
import HabitTracker from './HabitTracker';
import TaskService from '@/services/taskService';
import { TaskCard } from './TaskCard';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Plus, Settings, LayoutGrid, LayoutList } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Task } from '@/types/task';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';

interface WidgetConfig {
  id: string;
  title: string;
  description?: string;
  type: string;
  size: number;
  isVisible: boolean;
}

interface DashboardManagerProps {
  focusMode?: boolean;
}

const DashboardManager: React.FC<DashboardManagerProps> = ({ focusMode = false }) => {
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>(() => {
    const savedWidgets = localStorage.getItem('dashboard-widgets');
    if (savedWidgets) {
      try {
        return JSON.parse(savedWidgets);
      } catch (e) {
        console.error('Failed to parse widgets', e);
      }
    }
    
    // Default widgets
    return [
      { id: 'today', title: "Tâches d'Aujourd'hui", description: "À faire aujourd'hui", type: 'today-tasks', size: 33, isVisible: true },
      { id: 'habits', title: "Habitudes Quotidiennes", description: "Vos habitudes à maintenir", type: 'habits', size: 33, isVisible: true },
      { id: 'urgent', title: "Tâches Urgentes", description: "Nécessitent une attention immédiate", type: 'urgent-tasks', size: 33, isVisible: true },
      { id: 'overdue', title: "Tâches en Retard", description: "Échéance dépassée", type: 'overdue-tasks', size: 33, isVisible: !focusMode },
      { id: 'priority', title: "Tâches par Priorité", description: "Distribution des priorités", type: 'priority-chart', size: 50, isVisible: !focusMode },
      { id: 'category', title: "Tâches par Catégorie", description: "Distribution des catégories", type: 'category-chart', size: 50, isVisible: !focusMode },
    ];
  });
  
  const [stats, setStats] = useState<any>(null);
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'list'>(() => {
    const savedLayout = localStorage.getItem('dashboard-layout');
    return (savedLayout === 'list' ? 'list' : 'grid') as 'grid' | 'list';
  });
  const [maximizedWidget, setMaximizedWidget] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Charger les données
  useEffect(() => {
    const taskStats = TaskService.getTaskStats();
    setStats(taskStats);
    
    // Charger les tâches urgentes
    const urgent = TaskService.getTasks({
      urgencies: ['immediate'],
      sortBy: 'dueDate',
      sortDirection: 'asc',
    }).slice(0, 5);
    setUrgentTasks(urgent);
    
    // Charger les tâches du jour
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
    
    // Charger les tâches en retard
    const overdue = TaskService.getTasks({
      dueBeforeDate: today,
      statuses: ['pending', 'in-progress'],
      sortBy: 'dueDate',
      sortDirection: 'asc',
    }).slice(0, 5);
    setOverdueTasks(overdue);
  }, []);

  // Sauvegarder la configuration des widgets
  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgetConfigs));
  }, [widgetConfigs]);

  // Sauvegarder la disposition
  useEffect(() => {
    localStorage.setItem('dashboard-layout', layout);
  }, [layout]);

  // Mettre à jour la visibilité des widgets en fonction du mode focus
  useEffect(() => {
    if (focusMode) {
      // En mode focus, on garde uniquement les widgets essentiels
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
    // Vérifier si le widget existe déjà et est masqué
    const existingWidget = widgetConfigs.find(w => w.type === type && !w.isVisible);
    
    if (existingWidget) {
      setWidgetConfigs(prevWidgets => 
        prevWidgets.map(widget => 
          widget.id === existingWidget.id ? { ...widget, isVisible: true } : widget
        )
      );
    } else {
      // Créer un nouveau widget
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

  const getWidgetTitle = (type: string): string => {
    switch (type) {
      case 'today-tasks': return "Tâches d'Aujourd'hui";
      case 'urgent-tasks': return "Tâches Urgentes";
      case 'overdue-tasks': return "Tâches en Retard";
      case 'habits': return "Habitudes Quotidiennes";
      case 'priority-chart': return "Tâches par Priorité";
      case 'category-chart': return "Tâches par Catégorie";
      default: return "Widget";
    }
  };

  const getWidgetDescription = (type: string): string => {
    switch (type) {
      case 'today-tasks': return "À faire aujourd'hui";
      case 'urgent-tasks': return "Nécessitent une attention immédiate";
      case 'overdue-tasks': return "Échéance dépassée";
      case 'habits': return "Vos habitudes à maintenir";
      case 'priority-chart': return "Distribution des priorités";
      case 'category-chart': return "Distribution des catégories";
      default: return "";
    }
  };

  const renderWidgetContent = (widget: WidgetConfig) => {
    switch (widget.type) {
      case 'today-tasks':
        return (
          <div className="space-y-4">
            {todayTasks.length > 0 ? (
              todayTasks.map(task => (
                <TaskCard key={task.id} task={task} compact />
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">Aucune tâche pour aujourd'hui</p>
            )}
            <div className="mt-4 text-center">
              <Link to="/tasks/today" className="text-sm text-primary hover:underline">
                Voir toutes les tâches d'aujourd'hui
              </Link>
            </div>
          </div>
        );
      
      case 'urgent-tasks':
        return (
          <div className="space-y-4">
            {urgentTasks.length > 0 ? (
              urgentTasks.map(task => (
                <TaskCard key={task.id} task={task} compact />
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">Aucune tâche urgente</p>
            )}
            <div className="mt-4 text-center">
              <Link to="/tasks/urgent" className="text-sm text-primary hover:underline">
                Voir toutes les tâches urgentes
              </Link>
            </div>
          </div>
        );
      
      case 'overdue-tasks':
        return (
          <div className="space-y-4">
            {overdueTasks.length > 0 ? (
              overdueTasks.map(task => (
                <TaskCard key={task.id} task={task} compact />
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">Aucune tâche en retard</p>
            )}
            <div className="mt-4 text-center">
              <Link to="/tasks" className="text-sm text-primary hover:underline">
                Voir toutes les tâches
              </Link>
            </div>
          </div>
        );
      
      case 'habits':
        return <HabitTracker />;
      
      case 'priority-chart':
        if (!stats) return <p>Chargement...</p>;
        
        const priorityData = [
          { name: 'Haute', value: stats.priorityCounts.high || 0, color: '#FF5252' },
          { name: 'Moyenne', value: stats.priorityCounts.medium || 0, color: '#FFCA28' },
          { name: 'Basse', value: stats.priorityCounts.low || 0, color: '#4CAF50' },
        ];
        
        return (
          <div className="h-full w-full">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name]} 
                  labelFormatter={() => ''} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'category-chart':
        if (!stats) return <p>Chargement...</p>;
        
        const categoryData = [
          { name: 'Travail', value: stats.categoryCounts.work || 0, color: '#5C6BC0' },
          { name: 'Personnel', value: stats.categoryCounts.personal || 0, color: '#26A69A' },
          { name: 'Santé', value: stats.categoryCounts.health || 0, color: '#EC407A' },
          { name: 'Finance', value: stats.categoryCounts.finance || 0, color: '#66BB6A' },
          { name: 'Apprentissage', value: stats.categoryCounts.learning || 0, color: '#7E57C2' },
          { name: 'Autre', value: stats.categoryCounts.other || 0, color: '#78909C' },
        ];
        
        return (
          <div className="h-full w-full">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Tâches" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      default:
        return <p>Type de widget non reconnu</p>;
    }
  };

  if (!stats) {
    return <div className="p-8 text-center">Chargement des données...</div>;
  }

  // Si un widget est maximisé, afficher uniquement ce widget
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
            {renderWidgetContent(widget)}
          </DashboardWidget>
        </div>
      );
    }
  }

  // Options de widgets disponibles
  const availableWidgets = [
    { type: 'today-tasks', label: "Tâches d'Aujourd'hui" },
    { type: 'urgent-tasks', label: "Tâches Urgentes" },
    { type: 'overdue-tasks', label: "Tâches en Retard" },
    { type: 'habits', label: "Habitudes Quotidiennes" },
    { type: 'priority-chart', label: "Tâches par Priorité" },
    { type: 'category-chart', label: "Tâches par Catégorie" },
  ].filter(w => !widgetConfigs.some(config => config.type === w.type && config.isVisible));

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Tableau de bord</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}
            className="h-8 w-8"
          >
            {layout === 'grid' ? (
              <LayoutList className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un widget
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="space-y-1">
                {availableWidgets.length > 0 ? (
                  availableWidgets.map(widget => (
                    <Button
                      key={widget.type}
                      variant="ghost"
                      className="w-full justify-start text-sm h-8"
                      onClick={() => handleAddWidget(widget.type)}
                    >
                      {widget.label}
                    </Button>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground p-2">
                    Tous les widgets sont déjà visibles
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
            className="h-8"
          >
            <Settings className="h-4 w-4 mr-1" />
            {isEditMode ? "Terminer" : "Personnaliser"}
          </Button>
        </div>
      </div>
      
      {layout === 'grid' ? (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
          {widgetConfigs
            .filter(widget => widget.isVisible)
            .map(widget => (
              <DashboardWidget
                key={widget.id}
                id={widget.id}
                title={widget.title}
                description={widget.description}
                onRemove={handleRemoveWidget}
                onMaximize={handleMaximizeWidget}
                className={isEditMode ? "border-dashed border-2" : ""}
              >
                {renderWidgetContent(widget)}
              </DashboardWidget>
            ))}
        </div>
      ) : (
        <ResizablePanelGroup 
          direction="vertical" 
          className="min-h-[200px]"
        >
          {widgetConfigs
            .filter(widget => widget.isVisible)
            .map((widget, index, array) => (
              <React.Fragment key={widget.id}>
                <ResizablePanel
                  defaultSize={widget.size}
                  onResize={(size) => handlePanelResize(widget.id, size)}
                  className="min-h-[200px]"
                >
                  <DashboardWidget
                    id={widget.id}
                    title={widget.title}
                    description={widget.description}
                    onRemove={handleRemoveWidget}
                    onMaximize={handleMaximizeWidget}
                    className={isEditMode ? "border-dashed border-2" : ""}
                  >
                    {renderWidgetContent(widget)}
                  </DashboardWidget>
                </ResizablePanel>
                {index < array.length - 1 && (
                  <ResizableHandle withHandle />
                )}
              </React.Fragment>
            ))}
        </ResizablePanelGroup>
      )}
    </div>
  );
};

export default DashboardManager;
