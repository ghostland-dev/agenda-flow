
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  Tag, 
  CheckSquare, 
  Square, 
  Edit, 
  AlertTriangle 
} from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import TaskService from '@/services/taskService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface TaskCardProps {
  task: Task;
  onStatusChange?: () => void;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onStatusChange,
  compact = false
}) => {
  const { toast } = useToast();
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-priority-high text-white';
      case 'medium': return 'bg-priority-medium text-black';
      case 'low': return 'bg-priority-low text-white';
      default: return 'bg-gray-400 text-white';
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'bg-category-work text-white';
      case 'personal': return 'bg-category-personal text-white';
      case 'health': return 'bg-category-health text-white';
      case 'finance': return 'bg-category-finance text-white';
      case 'learning': return 'bg-category-learning text-white';
      default: return 'bg-gray-400 text-white';
    }
  };
  
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
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  
  const priorityScore = TaskService.calculatePriorityScore(task);
  
  // Calculer le pourcentage de sous-tâches complétées
  const subTasksTotal = task.subTasks.length;
  const subTasksCompleted = task.subTasks.filter(st => st.completed).length;
  const subTasksProgress = subTasksTotal > 0 
    ? Math.round((subTasksCompleted / subTasksTotal) * 100) 
    : 0;
  
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
          task.completed && "bg-muted/30"
        )}
      >
        {compact ? (
          <div className="p-3 flex items-center gap-3">
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
        ) : (
          <div className="p-4">
            <div className="flex items-center gap-3">
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
            
            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1 pl-8">
                {task.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center text-xs bg-muted rounded-full px-2 py-0.5"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Sous-tâches */}
            {task.subTasks.length > 0 && (
              <div className="mt-3 pl-8">
                <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                  <span>Progression des sous-tâches</span>
                  <span>{subTasksCompleted}/{subTasksTotal}</span>
                </div>
                <Progress value={subTasksProgress} className="h-1" />
              </div>
            )}
            
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
          </div>
        )}
        
        {isOverdue && !compact && !task.completed && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive" className="text-xs">
              En retard
            </Badge>
          </div>
        )}
      </div>
    </Link>
  );
};
