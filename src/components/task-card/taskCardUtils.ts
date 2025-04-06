
import { Task } from '@/types/task';

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-priority-high text-white';
    case 'medium': return 'bg-priority-medium text-black';
    case 'low': return 'bg-priority-low text-white';
    default: return 'bg-gray-400 text-white';
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'work': return 'bg-category-work text-white';
    case 'personal': return 'bg-category-personal text-white';
    case 'health': return 'bg-category-health text-white';
    case 'finance': return 'bg-category-finance text-white';
    case 'learning': return 'bg-category-learning text-white';
    default: return 'bg-gray-400 text-white';
  }
};
