
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, AlertTriangle } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { TaskCardStatus } from './TaskCardStatus';

interface TaskCardCompactProps {
  task: Task;
  getPriorityColor: (priority: string) => string;
  onStatusChange?: () => void;
  isOverdue: boolean;
}

export const TaskCardCompact: React.FC<TaskCardCompactProps> = ({ 
  task, 
  getPriorityColor, 
  onStatusChange,
  isOverdue 
}) => {
  return (
    <div className="p-3 flex items-center gap-3">
      <TaskCardStatus task={task} onStatusChange={onStatusChange} />
      
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-medium truncate",
          task.completed && "line-through text-muted-foreground"
        )}>
          {task.title}
        </h3>
        
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {format(new Date(task.dueDate), 'dd MMM', { locale: fr })}
              </span>
            </div>
          )}
          
          <Badge variant="outline" className={cn(
            "text-xs",
            getPriorityColor(task.priority)
          )}>
            {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
          </Badge>
        </div>
      </div>
      
      {isOverdue && !task.completed && (
        <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
      )}
    </div>
  );
};
