
import React from 'react';
import { Task } from '@/types/task';
import { Progress } from '@/components/ui/progress';

interface TaskCardProgressProps {
  task: Task;
}

export const TaskCardProgress: React.FC<TaskCardProgressProps> = ({ task }) => {
  if (task.subTasks.length === 0) return null;
  
  const subTasksTotal = task.subTasks.length;
  const subTasksCompleted = task.subTasks.filter(st => st.completed).length;
  const subTasksProgress = subTasksTotal > 0 
    ? Math.round((subTasksCompleted / subTasksTotal) * 100) 
    : 0;
  
  return (
    <div className="mt-3 pl-8">
      <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
        <span>Progression des sous-tâches</span>
        <span>{subTasksCompleted}/{subTasksTotal}</span>
      </div>
      <Progress value={subTasksProgress} className="h-1" />
    </div>
  );
};
