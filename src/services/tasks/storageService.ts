
import { Task } from '../../types/task';
import { mockTasks } from './mockData';

// Storage-related functionality
export const initializeLocalStorage = (): Task[] => {
  const storedTasks = localStorage.getItem('tasks');
  if (!storedTasks) {
    localStorage.setItem('tasks', JSON.stringify(mockTasks));
    return mockTasks;
  }
  return JSON.parse(storedTasks);
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};
