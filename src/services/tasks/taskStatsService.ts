
import { Task } from '../../types/task';

// Statistics and analytics
export const calculateTaskStats = (tasks: Task[]) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  
  const categoryCounts = tasks.reduce((acc: Record<string, number>, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});
  
  const priorityCounts = tasks.reduce((acc: Record<string, number>, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {});
  
  const urgencyCounts = tasks.reduce((acc: Record<string, number>, task) => {
    acc[task.urgency] = (acc[task.urgency] || 0) + 1;
    return acc;
  }, {});
  
  const periodCounts = tasks.reduce((acc: Record<string, number>, task) => {
    acc[task.period] = (acc[task.period] || 0) + 1;
    return acc;
  }, {});
  
  const overdueTasks = tasks.filter(task => 
    !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
  ).length;
  
  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
    categoryCounts,
    priorityCounts,
    urgencyCounts,
    periodCounts,
    overdueTasks
  };
};

export const calculatePriorityScore = (task: Task): number => {
  const priorityValues = { high: 10, medium: 5, low: 1 };
  const urgencyValues = { immediate: 10, soon: 5, later: 1 };
  
  // The score is a combination weighted of different factors
  let score = 0;
  
  // Priority (40%)
  score += priorityValues[task.priority] * 0.4;
  
  // Urgency (30%)
  score += urgencyValues[task.urgency] * 0.3;
  
  // Due date (15%)
  if (task.dueDate) {
    const daysUntilDue = Math.max(0, Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    
    if (daysUntilDue <= 1) {
      score += 10 * 0.15; // Very urgent
    } else if (daysUntilDue <= 3) {
      score += 8 * 0.15; // Urgent
    } else if (daysUntilDue <= 7) {
      score += 5 * 0.15; // Medium urgency
    } else {
      score += 1 * 0.15; // Low urgency
    }
  }
  
  // Mental load (10%)
  score += (task.mentalLoad / 10) * 10 * 0.1;
  
  // Energy required (5%)
  score += (task.energyRequired / 10) * 10 * 0.05;
  
  return Math.round(score * 10) / 10; // Round to one decimal place
};
