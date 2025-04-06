
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, AlertTriangle } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskCardStatus } from './TaskCardStatus';
import { TaskCardBadges, TaskCardTags } from './TaskCardBadges';
import { TaskCardProgress } from './TaskCardProgress';
import { TaskCardFooter } from './TaskCardFooter';

interface TaskCardFullProps {
  task: Task;
  onStatusChange?: () => void;
  isOverdue: boolean;
  priorityScore: number;
  getPriorityColor: (priority: string) => string;
  getCategoryColor: (category: string) => string;
}

export const TaskCardFull: React.FC<TaskCardFullProps> = ({ 
  task, 
  onStatusChange,
  isOverdue,
  priorityScore,
  getPriorityColor,
  getCategoryColor
}) => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <TaskCardStatus task={task} onStatusChange={onStatusChange} />
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-lg",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/tasks/${task.id}/edit`} onClick={e => e.stopPropagation()}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Modifier</span>
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-2 line-clamp-2 text-sm text-muted-foreground pl-8">
        {task.description}
      </div>
      
      <TaskCardBadges
        task={task}
        getPriorityColor={getPriorityColor}
        getCategoryColor={getCategoryColor}
      />
      
      <TaskCardTags tags={task.tags} />
      
      <TaskCardProgress task={task} />
      
      <TaskCardFooter task={task} priorityScore={priorityScore} />
      
      {isOverdue && !task.completed && (
        <div className="absolute top-2 right-2">
          <Badge variant="destructive" className="text-xs">
            En retard
          </Badge>
        </div>
      )}
    </div>
  );
};
