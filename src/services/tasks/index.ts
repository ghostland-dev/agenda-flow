
import { Task, TaskFilter } from '../../types/task';
import { initializeLocalStorage } from './storageService';
import { filterTasks } from './taskFilterService';
import { 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask,
  addSubTask,
  updateSubTask,
  deleteSubTask,
  getTags
} from './taskCrudService';
import { calculateTaskStats, calculatePriorityScore } from './taskStatsService';
import { exportTasks as exportTasksFunc, importTasks as importTasksFunc } from './importExportService';

// Main TaskService facade that combines all the functionality
export const TaskService = {
  getTasks: (filter?: TaskFilter): Task[] => {
    const tasks = initializeLocalStorage();
    return filterTasks(tasks, filter);
  },
  
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addSubTask,
  updateSubTask,
  deleteSubTask,
  getTags,
  
  getTaskStats: () => {
    const tasks = initializeLocalStorage();
    return calculateTaskStats(tasks);
  },
  
  calculatePriorityScore,
  
  exportTasks: (format: 'json' | 'csv', filter?: TaskFilter): string => {
    const tasks = initializeLocalStorage();
    return exportTasksFunc(tasks, format, filter);
  },
  
  importTasks: (data: string, format: 'json' | 'csv'): { success: boolean; message: string } => {
    const tasks = initializeLocalStorage();
    const result = importTasksFunc(tasks, data, format);
    
    if (result.success && result.tasks) {
      // Save the updated tasks to localStorage
      localStorage.setItem('tasks', JSON.stringify(result.tasks));
    }
    
    return { success: result.success, message: result.message };
  }
};

export default TaskService;
