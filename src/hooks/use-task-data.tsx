
import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import TaskService from '@/services/taskService';
import { useToast } from '@/hooks/use-toast';

export function useTaskData() {
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [optimizedTasks, setOptimizedTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  // Load data for all widgets
  const loadData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Today's tasks
    setTodayTasks(
      TaskService.getTasks({
        dueAfterDate: today,
        dueBeforeDate: tomorrow
      })
    );
    
    // Urgent tasks
    setUrgentTasks(
      TaskService.getTasks({
        urgencies: ['immediate']
      })
    );
    
    // Overdue tasks
    setOverdueTasks(
      TaskService.getTasks({
        dueBeforeDate: today,
        statuses: ['pending', 'in-progress']
      })
    );
    
    // Optimized tasks
    setOptimizedTasks(TaskService.optimizeTasks());
    
    // Statistics
    setStats(TaskService.getTaskStats());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefreshWidget = (id: string) => {
    loadData();
    toast({
      title: "Widget actualisé",
      description: "Les données du widget ont été mises à jour",
    });
  };

  // Data to pass to widgets
  const widgetData = {
    'today-tasksTasks': todayTasks,
    'urgent-tasksTasks': urgentTasks,
    'overdue-tasksTasks': overdueTasks,
    'task-optimizerTasks': optimizedTasks,
    stats
  };

  return {
    todayTasks,
    urgentTasks,
    overdueTasks,
    optimizedTasks,
    stats,
    widgetData,
    handleRefreshWidget
  };
}
