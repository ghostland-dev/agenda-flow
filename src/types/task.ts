
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskUrgency = 'immediate' | 'soon' | 'later';
export type TaskSize = 'small' | 'medium' | 'large';
export type TaskCategory = 'work' | 'personal' | 'health' | 'finance' | 'learning' | 'other';
export type TaskPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'archived';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  urgency: TaskUrgency;
  size: TaskSize;
  category: TaskCategory;
  period: TaskPeriod;
  status: TaskStatus;
  dueDate: Date | null;
  subTasks: SubTask[];
  tags: string[];
  completed: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  mentalLoad: number; // Scale 1-10
  energyRequired: number; // Scale 1-10
}

export interface TaskFilter {
  search?: string;
  categories?: TaskCategory[];
  priorities?: TaskPriority[];
  urgencies?: TaskUrgency[];
  sizes?: TaskSize[];
  periods?: TaskPeriod[];
  statuses?: TaskStatus[];
  tags?: string[];
  dueBeforeDate?: Date;
  dueAfterDate?: Date;
  sortBy?: 'dueDate' | 'priority' | 'urgency' | 'createdAt' | 'mentalLoad' | 'energyRequired';
  sortDirection?: 'asc' | 'desc';
}
