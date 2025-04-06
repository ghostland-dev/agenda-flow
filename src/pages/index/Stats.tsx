
import React, { useEffect, useState } from 'react';
import TaskService from '@/services/taskService';
import { Task } from '@/types/task';
import StatsCards from '@/components/stats/StatsCards';
import PriorityChart from '@/components/stats/PriorityChart';
import CategoryChart from '@/components/stats/CategoryChart';
import CompletedTasksChart from '@/components/stats/CompletedTasksChart';
import StatsLoader from '@/components/stats/StatsLoader';
import { generateCompletedTasksOverTime } from '@/components/stats/utils';

const Stats: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [completedTasksOverTime, setCompletedTasksOverTime] = useState<any>({ months: [], weeks: [] });
  const [tasksPerCategory, setTasksPerCategory] = useState<any[]>([]);
  const [tasksPerPriority, setTasksPerPriority] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const taskStats = TaskService.getTaskStats();
    setStats(taskStats);
    
    // Récupérer toutes les tâches
    const allTasks = TaskService.getTasks();
    
    // Générer les données pour les tâches terminées au fil du temps
    const tasksOverTime = generateCompletedTasksOverTime(allTasks);
    setCompletedTasksOverTime(tasksOverTime);
    
    // Tâches par catégorie
    const categoryData = [
      { name: 'Travail', value: taskStats.categoryCounts.work || 0, color: '#5C6BC0' },
      { name: 'Personnel', value: taskStats.categoryCounts.personal || 0, color: '#26A69A' },
      { name: 'Santé', value: taskStats.categoryCounts.health || 0, color: '#EC407A' },
      { name: 'Finance', value: taskStats.categoryCounts.finance || 0, color: '#66BB6A' },
      { name: 'Apprentissage', value: taskStats.categoryCounts.learning || 0, color: '#7E57C2' },
      { name: 'Autre', value: taskStats.categoryCounts.other || 0, color: '#78909C' },
    ];
    setTasksPerCategory(categoryData);
    
    // Tâches par priorité
    const priorityData = [
      { name: 'Haute', value: taskStats.priorityCounts.high || 0, color: '#FF5252' },
      { name: 'Moyenne', value: taskStats.priorityCounts.medium || 0, color: '#FFCA28' },
      { name: 'Basse', value: taskStats.priorityCounts.low || 0, color: '#4CAF50' },
    ];
    setTasksPerPriority(priorityData);
    
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return <StatsLoader />;
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Statistiques</h1>
      
      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PriorityChart data={tasksPerPriority} />
        <CategoryChart data={tasksPerCategory} />
      </div>
      
      <CompletedTasksChart data={completedTasksOverTime} />
    </div>
  );
};

export default Stats;
