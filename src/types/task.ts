
// Update the existing task.ts file to include templates and other new fields

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskUrgency = 'immediate' | 'soon' | 'later';
export type TaskSize = 'small' | 'medium' | 'large';
export type TaskStatus = 'pending' | 'in-progress' | 'blocked' | 'completed';
export type TaskCategory = 'work' | 'personal' | 'health' | 'finance' | 'learning' | 'other';
export type TaskPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  urgency: TaskUrgency;
  size: TaskSize;
  category: TaskCategory;
  period: TaskPeriod;
  dueDate: Date | null;
  createdAt?: Date;
  completedAt: Date | null;
  completed: boolean;
  tags: string[];
  subTasks?: SubTask[];
  mentalLoad: number; // 1-10 scale
  energyRequired: number; // 1-10 scale
}

export interface TaskTemplate {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  urgency: TaskUrgency;
  size: TaskSize;
  category: TaskCategory;
  period: TaskPeriod;
  tags: string[];
  subTasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  mentalLoad: number; // 1-10 scale
  energyRequired: number; // 1-10 scale
}

export interface TaskFilter {
  search?: string;
  statuses?: TaskStatus[];
  priorities?: TaskPriority[];
  urgencies?: TaskUrgency[];
  categories?: TaskCategory[];
  periods?: TaskPeriod[];
  dueBeforeDate?: Date;
  dueAfterDate?: Date;
  tags?: string[];
  sortBy?: 'dueDate' | 'priority' | 'urgency' | 'createdAt' | 'category' | 'mentalLoad' | 'energyRequired';
  sortDirection?: 'asc' | 'desc';
  completed?: boolean;
}
