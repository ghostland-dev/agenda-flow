
import { useState, useEffect } from 'react';
import TaskService from '@/services/taskService';
import { Task } from '@/types/task';

export function useTaskData() {
  const [stats, setStats] = useState<any>(null);
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    loadTaskData();
  }, []);
  
  const loadTaskData = () => {
    const taskStats = TaskService.getTaskStats();
    setStats(taskStats);
    
    const urgent = TaskService.getTasks({
      urgencies: ['immediate'],
      sortBy: 'dueDate',
      sortDirection: 'asc',
    }).slice(0, 5);
    setUrgentTasks(urgent);
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    today.setHours(0, 0, 0, 0);
    
    const todayTasksList = TaskService.getTasks({
      dueAfterDate: today,
      dueBeforeDate: tomorrow,
      sortBy: 'priority',
      sortDirection: 'desc',
    }).slice(0, 5);
    setTodayTasks(todayTasksList);
    
    const overdue = TaskService.getTasks({
      dueBeforeDate: today,
      statuses: ['pending', 'in-progress'],
      sortBy: 'dueDate',
      sortDirection: 'asc',
    }).slice(0, 5);
    setOverdueTasks(overdue);
  };

  // Groupe toutes les données pour les widgets
  const widgetData = {
    stats,
    'today-tasksTasks': todayTasks,
    'urgent-tasksTasks': urgentTasks,
    'overdue-tasksTasks': overdueTasks
  };

  return {
    stats,
    urgentTasks,
    todayTasks,
    overdueTasks,
    widgetData,
    refreshData: loadTaskData
  };
}
