
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Tag } from 'lucide-react';
import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskCardBadgesProps {
  task: Task;
  getPriorityColor: (priority: string) => string;
  getCategoryColor: (category: string) => string;
}

export const TaskCardBadges: React.FC<TaskCardBadgesProps> = ({ 
  task, 
  getPriorityColor, 
  getCategoryColor 
}) => {
  return (
    <div className="mt-3 flex flex-wrap gap-2 pl-8">
      <Badge variant="outline" className={cn(
        "text-xs",
        getPriorityColor(task.priority)
      )}>
        {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
      </Badge>
      
      <Badge variant="outline" className={cn(
        "text-xs",
        getCategoryColor(task.category)
      )}>
        {task.category === 'work' ? 'Travail' : 
         task.category === 'personal' ? 'Personnel' : 
         task.category === 'health' ? 'Santé' : 
         task.category === 'finance' ? 'Finance' : 
         task.category === 'learning' ? 'Apprentissage' : 'Autre'}
      </Badge>
      
      {task.period && (
        <Badge variant="outline" className="text-xs">
          {task.period === 'daily' ? 'Quotidien' : 
           task.period === 'weekly' ? 'Hebdo' : 
           task.period === 'monthly' ? 'Mensuel' : 'Annuel'}
        </Badge>
      )}
      
      {task.dueDate && (
        <div className="flex items-center gap-1 text-xs border rounded-full px-2 py-0.5">
          <Calendar className="h-3 w-3" />
          <span>
            {format(new Date(task.dueDate), 'dd MMM yyyy', { locale: fr })}
          </span>
        </div>
      )}
    </div>
  );
};

export const TaskCardTags: React.FC<{ tags: string[] }> = ({ tags }) => {
  if (tags.length === 0) return null;
  
  return (
    <div className="mt-3 flex flex-wrap gap-1 pl-8">
      {tags.map((tag, index) => (
        <span 
          key={index}
          className="inline-flex items-center text-xs bg-muted rounded-full px-2 py-0.5"
        >
          <Tag className="h-3 w-3 mr-1" />
          {tag}
        </span>
      ))}
    </div>
  );
};
