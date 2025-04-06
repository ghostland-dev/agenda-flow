
import React from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { Task } from '@/types/task';
import TaskService from '@/services/taskService';
import { useToast } from '@/hooks/use-toast';

interface TaskCardStatusProps {
  task: Task;
  onStatusChange?: () => void;
}

export const TaskCardStatus: React.FC<TaskCardStatusProps> = ({ 
  task, 
  onStatusChange 
}) => {
  const { toast } = useToast();
  
  const handleToggleStatus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const updatedTask = TaskService.updateTask(task.id, {
      completed: !task.completed,
      completedAt: !task.completed ? new Date() : null,
      status: !task.completed ? 'completed' : 'pending'
    });
    
    if (updatedTask) {
      toast({
        title: updatedTask.completed ? 'Tâche terminée' : 'Tâche réactivée',
        description: updatedTask.title,
      });
      
      if (onStatusChange) {
        onStatusChange();
      }
    }
  };
  
  return (
    <button 
      onClick={handleToggleStatus}
      className="flex-shrink-0"
    >
      {task.completed ? (
        <CheckSquare className="h-5 w-5 text-primary" />
      ) : (
        <Square className="h-5 w-5 text-primary" />
      )}
    </button>
  );
};
