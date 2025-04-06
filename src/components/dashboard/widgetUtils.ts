
export interface WidgetConfig {
  id: string;
  title: string;
  description?: string;
  type: string;
  size: number;
  isVisible: boolean;
}

export const getWidgetTitle = (type: string): string => {
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

export const getWidgetDescription = (type: string): string => {
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

export const getDefaultWidgets = (focusMode = false): WidgetConfig[] => {
  return [
    { id: 'today', title: "Tâches d'Aujourd'hui", description: "À faire aujourd'hui", type: 'today-tasks', size: 33, isVisible: true },
    { id: 'habits', title: "Habitudes Quotidiennes", description: "Vos habitudes à maintenir", type: 'habits', size: 33, isVisible: true },
    { id: 'urgent', title: "Tâches Urgentes", description: "Nécessitent une attention immédiate", type: 'urgent-tasks', size: 33, isVisible: true },
    { id: 'overdue', title: "Tâches en Retard", description: "Échéance dépassée", type: 'overdue-tasks', size: 33, isVisible: !focusMode },
    { id: 'priority', title: "Tâches par Priorité", description: "Distribution des priorités", type: 'priority-chart', size: 50, isVisible: !focusMode },
    { id: 'category', title: "Tâches par Catégorie", description: "Distribution des catégories", type: 'category-chart', size: 50, isVisible: !focusMode },
  ];
};

export const getAvailableWidgetTypes = () => {
  return [
    { type: 'today-tasks', label: "Tâches d'Aujourd'hui" },
    { type: 'urgent-tasks', label: "Tâches Urgentes" },
    { type: 'overdue-tasks', label: "Tâches en Retard" },
    { type: 'habits', label: "Habitudes Quotidiennes" },
    { type: 'priority-chart', label: "Tâches par Priorité" },
    { type: 'category-chart', label: "Tâches par Catégorie" },
  ];
};
