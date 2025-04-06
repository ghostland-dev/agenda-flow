
import { Task, TaskFilter, TaskPriority, TaskUrgency, TaskSize, TaskCategory, TaskPeriod, TaskStatus } from '../../types/task';
import { filterTasks } from './taskFilterService';

// Import/export functionality
export const exportTasks = (tasks: Task[], format: 'json' | 'csv', filter?: TaskFilter): string => {
  const filteredTasks = filter ? filterTasks(tasks, filter) : tasks;
  
  if (format === 'json') {
    return JSON.stringify(filteredTasks, null, 2);
  } else if (format === 'csv') {
    const headers = 'ID,Title,Description,Priority,Urgency,Size,Category,Period,Status,Due Date,Completed,Created At,Updated At,Mental Load,Energy Required,Tags\n';
    
    const rows = filteredTasks.map(task => {
      return [
        task.id,
        `"${task.title.replace(/"/g, '""')}"`,
        `"${task.description.replace(/"/g, '""')}"`,
        task.priority,
        task.urgency,
        task.size,
        task.category,
        task.period,
        task.status,
        task.dueDate ? new Date(task.dueDate).toISOString() : '',
        task.completed ? 'Yes' : 'No',
        new Date(task.createdAt).toISOString(),
        new Date(task.updatedAt).toISOString(),
        task.mentalLoad,
        task.energyRequired,
        `"${task.tags.join(', ')}"`
      ].join(',');
    });
    
    return headers + rows.join('\n');
  }
  
  return '';
};

export const importTasks = (
  currentTasks: Task[], 
  data: string, 
  format: 'json' | 'csv'
): { success: boolean; message: string; tasks?: Task[] } => {
  try {
    let tasks: Task[] = [];
    
    if (format === 'json') {
      tasks = JSON.parse(data);
      
      // Basic validation
      if (!Array.isArray(tasks)) {
        return { success: false, message: 'Le format JSON n\'est pas valide. Il devrait contenir un tableau de tâches.' };
      }
      
      // Check if each task has required properties
      const isValid = tasks.every(task => 
        typeof task.id === 'string' && 
        typeof task.title === 'string' && 
        typeof task.completed !== 'undefined'
      );
      
      if (!isValid) {
        return { success: false, message: 'Certaines tâches n\'ont pas le format correct.' };
      }
    } else if (format === 'csv') {
      const lines = data.split('\n');
      const headers = lines[0].split(',');
      
      // Check minimum required headers
      const requiredHeaders = ['ID', 'Title', 'Priority', 'Category'];
      const hasRequiredHeaders = requiredHeaders.every(h => headers.includes(h));
      
      if (!hasRequiredHeaders) {
        return { success: false, message: 'Le fichier CSV doit avoir au moins les en-têtes : ID, Title, Priority, Category.' };
      }
      
      // Parse lines
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        if (values.length !== headers.length) {
          return { success: false, message: `La ligne ${i + 1} n'a pas le bon nombre de colonnes.` };
        }
        
        // Create task object
        const task: any = {};
        headers.forEach((header, index) => {
          task[header.toLowerCase()] = values[index];
        });
        
        // Convert to Task type
        tasks.push({
          id: task.id,
          title: task.title.replace(/^"|"$/g, '').replace(/""/g, '"'),
          description: task.description ? task.description.replace(/^"|"$/g, '').replace(/""/g, '"') : '',
          priority: task.priority as TaskPriority,
          urgency: task.urgency as TaskUrgency,
          size: task.size as TaskSize,
          category: task.category as TaskCategory,
          period: task.period as TaskPeriod,
          status: task.status as TaskStatus,
          dueDate: task['due date'] ? new Date(task['due date']) : null,
          subTasks: [],
          tags: task.tags ? task.tags.replace(/^"|"$/g, '').split(', ') : [],
          completed: task.completed === 'Yes',
          completedAt: null,
          createdAt: task['created at'] ? new Date(task['created at']) : new Date(),
          updatedAt: task['updated at'] ? new Date(task['updated at']) : new Date(),
          mentalLoad: parseInt(task['mental load'] || '5'),
          energyRequired: parseInt(task['energy required'] || '5')
        });
      }
    }
    
    // Merge with existing tasks
    const existingIds = new Set(currentTasks.map(t => t.id));
    const newTasks = tasks.filter(t => !existingIds.has(t.id));
    const updatedTasks = [...currentTasks, ...newTasks];
    
    return { 
      success: true, 
      message: `Importation réussie. ${newTasks.length} nouvelles tâches ajoutées.`,
      tasks: updatedTasks
    };
  } catch (error) {
    console.error('Erreur lors de l\'importation :', error);
    return { 
      success: false, 
      message: `Erreur lors de l'importation : ${error instanceof Error ? error.message : 'Format invalide'}` 
    };
  }
};
