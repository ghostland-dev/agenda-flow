
import { Task, TaskFilter } from '../../types/task';

// Filtering and sorting tasks
export const filterTasks = (tasks: Task[], filter?: TaskFilter): Task[] => {
  if (!filter) return tasks;
  
  let filteredTasks = [...tasks];
  
  // Filtering
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(searchLower) || 
      task.description.toLowerCase().includes(searchLower) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  if (filter.categories?.length) {
    filteredTasks = filteredTasks.filter(task => filter.categories?.includes(task.category));
  }
  
  if (filter.priorities?.length) {
    filteredTasks = filteredTasks.filter(task => filter.priorities?.includes(task.priority));
  }
  
  if (filter.urgencies?.length) {
    filteredTasks = filteredTasks.filter(task => filter.urgencies?.includes(task.urgency));
  }
  
  if (filter.sizes?.length) {
    filteredTasks = filteredTasks.filter(task => filter.sizes?.includes(task.size));
  }
  
  if (filter.periods?.length) {
    filteredTasks = filteredTasks.filter(task => filter.periods?.includes(task.period));
  }
  
  if (filter.statuses?.length) {
    filteredTasks = filteredTasks.filter(task => filter.statuses?.includes(task.status));
  }
  
  if (filter.tags?.length) {
    filteredTasks = filteredTasks.filter(task => 
      task.tags.some(tag => filter.tags?.includes(tag))
    );
  }
  
  if (filter.dueBeforeDate) {
    filteredTasks = filteredTasks.filter(task => 
      task.dueDate && new Date(task.dueDate) <= new Date(filter.dueBeforeDate!)
    );
  }
  
  if (filter.dueAfterDate) {
    filteredTasks = filteredTasks.filter(task => 
      task.dueDate && new Date(task.dueDate) >= new Date(filter.dueAfterDate!)
    );
  }
  
  return sortTasks(filteredTasks, filter);
};

export const sortTasks = (tasks: Task[], filter?: TaskFilter): Task[] => {
  if (!filter?.sortBy) return tasks;
  
  return [...tasks].sort((a, b) => {
    let comparison = 0;
    
    switch (filter.sortBy) {
      case 'dueDate':
        if (a.dueDate && b.dueDate) {
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else if (a.dueDate) {
          comparison = -1;
        } else if (b.dueDate) {
          comparison = 1;
        }
        break;
      case 'priority':
        const priorityValues = { high: 3, medium: 2, low: 1 };
        comparison = priorityValues[a.priority] - priorityValues[b.priority];
        break;
      case 'urgency':
        const urgencyValues = { immediate: 3, soon: 2, later: 1 };
        comparison = urgencyValues[a.urgency] - urgencyValues[b.urgency];
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'mentalLoad':
        comparison = a.mentalLoad - b.mentalLoad;
        break;
      case 'energyRequired':
        comparison = a.energyRequired - b.energyRequired;
        break;
      default:
        break;
    }
    
    return filter.sortDirection === 'desc' ? -comparison : comparison;
  });
};
