
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import TaskStatistics from '@/components/statistics/TaskStatistics';
import TaskService from '@/services/taskService';
import { Task } from '@/types/task';
import { isToday } from 'date-fns';

const StatisticsPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedToday, setCompletedToday] = useState(0);
  const [averageCompletionTime, setAverageCompletionTime] = useState(0);
  
  const loadData = () => {
    setIsLoading(true);
    
    const loadedTasks = TaskService.getTasks();
    setTasks(loadedTasks);
    
    // Count tasks completed today
    const completedTodayCount = loadedTasks.filter(task => {
      return task.completed && task.completedAt && isToday(new Date(task.completedAt));
    }).length;
    setCompletedToday(completedTodayCount);
    
    // Calculate average completion time (mock data - in a real app this would come from backend)
    const randomAvgTime = Math.round(Math.random() * 120) + 30; // Between 30 and 150 minutes
    setAverageCompletionTime(randomAvgTime);
    
    setIsLoading(false);
  };
  
  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Statistiques et progrès</h1>
            <p className="text-muted-foreground">Suivez votre productivité et mesurez vos progrès</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <TaskStatistics 
            tasks={tasks}
            completedToday={completedToday}
            averageCompletionTime={averageCompletionTime}
          />
        )}
      </div>
    </Layout>
  );
};

export default StatisticsPage;
