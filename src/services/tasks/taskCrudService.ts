
import { Task, SubTask } from '../../types/task';
import { v4 as uuidv4 } from 'uuid';
import { initializeLocalStorage, saveTasks } from './storageService';

// CRUD operations for tasks
export const getTaskById = (id: string): Task | undefined => {
  const tasks = initializeLocalStorage();
  return tasks.find(task => task.id === id);
};

export const createTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
  const tasks = initializeLocalStorage();
  
  const newTask: Task = {
    ...task,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const updatedTasks = [...tasks, newTask];
  saveTasks(updatedTasks);
  
  return newTask;
};

export const updateTask = (id: string, updates: Partial<Task>): Task | undefined => {
  const tasks = initializeLocalStorage();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) return undefined;
  
  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);
  
  return updatedTask;
};

export const deleteTask = (id: string): boolean => {
  const tasks = initializeLocalStorage();
  const filteredTasks = tasks.filter(task => task.id !== id);
  
  if (filteredTasks.length === tasks.length) return false;
  
  saveTasks(filteredTasks);
  return true;
};

// CRUD operations for subtasks
export const addSubTask = (taskId: string, subTaskTitle: string): SubTask | undefined => {
  const tasks = initializeLocalStorage();
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) return undefined;
  
  const newSubTask: SubTask = {
    id: uuidv4(),
    title: subTaskTitle,
    completed: false,
    createdAt: new Date()
  };
  
  tasks[taskIndex].subTasks.push(newSubTask);
  tasks[taskIndex].updatedAt = new Date();
  
  saveTasks(tasks);
  return newSubTask;
};

export const updateSubTask = (taskId: string, subTaskId: string, completed: boolean): boolean => {
  const tasks = initializeLocalStorage();
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) return false;
  
  const subTaskIndex = tasks[taskIndex].subTasks.findIndex(st => st.id === subTaskId);
  
  if (subTaskIndex === -1) return false;
  
  tasks[taskIndex].subTasks[subTaskIndex].completed = completed;
  tasks[taskIndex].updatedAt = new Date();
  
  saveTasks(tasks);
  return true;
};

export const deleteSubTask = (taskId: string, subTaskId: string): boolean => {
  const tasks = initializeLocalStorage();
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) return false;
  
  const initialSubTasksLength = tasks[taskIndex].subTasks.length;
  tasks[taskIndex].subTasks = tasks[taskIndex].subTasks.filter(st => st.id !== subTaskId);
  
  if (tasks[taskIndex].subTasks.length === initialSubTasksLength) return false;
  
  tasks[taskIndex].updatedAt = new Date();
  saveTasks(tasks);
  return true;
};

// Utility functions
export const getTags = (): string[] => {
  const tasks = initializeLocalStorage();
  const allTags = tasks.flatMap(task => task.tags);
  return [...new Set(allTags)].filter((tag): tag is string => typeof tag === 'string');
};
