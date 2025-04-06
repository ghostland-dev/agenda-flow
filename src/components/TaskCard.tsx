
import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import TaskService from '@/services/taskService';
import { TaskCardCompact } from './task-card/TaskCardCompact';
import { TaskCardFull } from './task-card/TaskCardFull';
import { getPriorityColor, getCategoryColor } from './task-card/taskCardUtils';

export interface TaskCardProps {
  task: Task;
  onStatusChange?: () => void;
  compact?: boolean;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onStatusChange,
  compact = false,
  className
}) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const priorityScore = TaskService.calculatePriorityScore(task);
  
  return (
    <Link 
      to={`/tasks/${task.id}`} 
      className={cn(
        "block",
        task.completed && "opacity-70"
      )}
    >
      <div 
        className={cn(
          "relative border rounded-lg hover:border-primary transition-colors",
          isOverdue && !task.completed && "border-destructive",
          task.completed && "bg-muted/30",
          className
        )}
      >
        {compact ? (
          <TaskCardCompact 
            task={task}
            getPriorityColor={getPriorityColor}
            onStatusChange={onStatusChange}
            isOverdue={isOverdue}
          />
        ) : (
          <TaskCardFull 
            task={task}
            onStatusChange={onStatusChange}
            isOverdue={isOverdue}
            priorityScore={priorityScore}
            getPriorityColor={getPriorityColor}
            getCategoryColor={getCategoryColor}
          />
        )}
      </div>
    </Link>
  );
};
