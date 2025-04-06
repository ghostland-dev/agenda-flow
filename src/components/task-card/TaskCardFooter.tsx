
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskCardFooterProps {
  task: Task;
  priorityScore: number;
}

export const TaskCardFooter: React.FC<TaskCardFooterProps> = ({ 
  task, 
  priorityScore 
}) => {
  return (
    <div className="mt-3 pl-8 flex justify-between items-center text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {task.completed ? (
          <span>Terminé le {format(new Date(task.completedAt!), 'dd MMM yyyy', { locale: fr })}</span>
        ) : (
          <span>Créé le {format(new Date(task.createdAt), 'dd MMM yyyy', { locale: fr })}</span>
        )}
      </div>
      
      <div className="rounded-full bg-primary/10 px-2 py-0.5">
        Score: {priorityScore}
      </div>
    </div>
  );
};
