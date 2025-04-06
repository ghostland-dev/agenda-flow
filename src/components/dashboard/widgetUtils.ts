
import { v4 as uuidv4 } from 'uuid';

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  description?: string;
  size: number;
  isVisible: boolean;
}

export const getDefaultWidgetConfigs = (): WidgetConfig[] => {
  return [
    {
      id: uuidv4(),
      type: 'today-tasks',
      title: "Tâches du jour",
      description: "Tâches prévues pour aujourd'hui",
      size: 33,
      isVisible: true
    },
    {
      id: uuidv4(),
      type: 'urgent-tasks',
      title: "Tâches urgentes",
      description: "Tâches nécessitant une attention immédiate",
      size: 33,
      isVisible: true
    },
    {
      id: uuidv4(),
      type: 'priority-chart',
      title: "Répartition par priorité",
      description: "Distribution des tâches par niveau de priorité",
      size: 33,
      isVisible: true
    },
    {
      id: uuidv4(),
      type: 'category-chart',
      title: "Répartition par catégorie",
      description: "Distribution des tâches par catégorie",
      size: 33,
      isVisible: false
    },
    {
      id: uuidv4(),
      type: 'overdue-tasks',
      title: "Tâches en retard",
      description: "Tâches dont la date d'échéance est dépassée",
      size: 33,
      isVisible: false
    },
    {
      id: uuidv4(),
      type: 'habits',
      title: "Suivi des habitudes",
      description: "Progression de vos habitudes quotidiennes",
      size: 33,
      isVisible: false
    },
    {
      id: uuidv4(),
      type: 'task-optimizer',
      title: "Optimiseur de tâches",
      description: "Ordre optimal pour compléter vos tâches",
      size: 33,
      isVisible: true
    }
  ];
};

// Add the missing functions needed by DashboardManager
export const getDefaultWidgets = (focusMode = false): WidgetConfig[] => {
  const configs = getDefaultWidgetConfigs();
  
  if (focusMode) {
    // In focus mode, only show essential widgets
    return configs.map(widget => ({
      ...widget,
      isVisible: ['today-tasks', 'urgent-tasks', 'habits'].includes(widget.type)
    }));
  }
  
  return configs;
};

export const getWidgetTitle = (type: string): string => {
  const widget = getAvailableWidgetTypes().find(w => w.type === type);
  return widget ? widget.label : 'Widget';
};

export const getWidgetDescription = (type: string): string => {
  const widget = getDefaultWidgetConfigs().find(w => w.type === type);
  return widget?.description || '';
};

export const getAvailableWidgetTypes = () => {
  return [
    { type: 'today-tasks', label: 'Tâches du jour' },
    { type: 'urgent-tasks', label: 'Tâches urgentes' },
    { type: 'overdue-tasks', label: 'Tâches en retard' },
    { type: 'priority-chart', label: 'Répartition par priorité' },
    { type: 'category-chart', label: 'Répartition par catégorie' },
    { type: 'habits', label: 'Suivi des habitudes' },
    { type: 'task-optimizer', label: 'Optimiseur de tâches' }
  ];
};
