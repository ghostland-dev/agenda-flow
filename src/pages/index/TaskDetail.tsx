
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Task } from '@/types/task';
import TaskService from '@/services/taskService';
import {
  Calendar,
  Clock,
  Edit,
  Trash,
  CheckSquare,
  Square,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const taskData = TaskService.getTaskById(id);
      
      if (taskData) {
        setTask(taskData);
      } else {
        toast({
          title: 'Erreur',
          description: 'Tâche non trouvée',
          variant: 'destructive',
        });
        navigate('/tasks');
      }
      
      setIsLoading(false);
    }
  }, [id, navigate, toast]);
  
  const handleDelete = () => {
    if (id) {
      const success = TaskService.deleteTask(id);
      
      if (success) {
        toast({
          title: 'Succès',
          description: 'Tâche supprimée avec succès',
        });
        navigate('/tasks');
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer la tâche',
          variant: 'destructive',
        });
      }
    }
  };
  
  const handleToggleStatus = () => {
    if (task) {
      const updatedTask = TaskService.updateTask(task.id, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : null,
        status: !task.completed ? 'completed' : 'pending'
      });
      
      if (updatedTask) {
        setTask(updatedTask);
        
        toast({
          title: updatedTask.completed ? 'Tâche terminée' : 'Tâche réactivée',
          description: updatedTask.title,
        });
      }
    }
  };
  
  const handleToggleSubTask = (subTaskId: string, completed: boolean) => {
    if (task) {
      const success = TaskService.updateSubTask(task.id, subTaskId, completed);
      
      if (success) {
        const updatedTask = TaskService.getTaskById(task.id);
        if (updatedTask) {
          setTask(updatedTask);
        }
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement de la tâche...</p>
        </div>
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <p className="text-xl font-medium">Tâche non trouvée</p>
          <p className="mt-2 text-muted-foreground">
            La tâche que vous cherchez n'existe pas ou a été supprimée.
          </p>
          <Button asChild className="mt-4">
            <Link to="/tasks">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux tâches
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return priority;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-priority-high text-white';
      case 'medium': return 'bg-priority-medium text-black';
      case 'low': return 'bg-priority-low text-white';
      default: return 'bg-gray-400 text-white';
    }
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'work': return 'Travail';
      case 'personal': return 'Personnel';
      case 'health': return 'Santé';
      case 'finance': return 'Finance';
      case 'learning': return 'Apprentissage';
      default: return 'Autre';
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
  
  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'Immédiate';
      case 'soon': return 'Prochaine';
      case 'later': return 'Plus tard';
      default: return urgency;
    }
  };
  
  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Petite';
      case 'medium': return 'Moyenne';
      case 'large': return 'Grande';
      default: return size;
    }
  };
  
  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'daily': return 'Quotidienne';
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuelle';
      case 'yearly': return 'Annuelle';
      default: return period;
    }
  };
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  
  // Calculer le pourcentage de sous-tâches complétées
  const subTasksTotal = task.subTasks.length;
  const subTasksCompleted = task.subTasks.filter(st => st.completed).length;
  const subTasksProgress = subTasksTotal > 0 
    ? Math.round((subTasksCompleted / subTasksTotal) * 100) 
    : 0;
  
  const priorityScore = TaskService.calculatePriorityScore(task);
  
  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" asChild>
          <Link to="/tasks">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant={task.completed ? 'outline' : 'default'}
            onClick={handleToggleStatus}
          >
            {task.completed ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Marquer comme à faire
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4 mr-2" />
                Marquer comme terminée
              </>
            )}
          </Button>
          
          <Button variant="outline" asChild>
            <Link to={`/tasks/${task.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action supprimera définitivement la tâche "{task.title}" et ne peut pas être annulée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-start justify-between">
          <h1 className={cn(
            "text-2xl font-bold",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h1>
          
          {isOverdue && !task.completed && (
            <Badge variant="destructive" className="ml-2">
              <AlertTriangle className="h-3 w-3 mr-1" />
              En retard
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className={getPriorityColor(task.priority)}>
            Priorité: {getPriorityLabel(task.priority)}
          </Badge>
          
          <Badge variant="outline" className={getCategoryColor(task.category)}>
            {getCategoryLabel(task.category)}
          </Badge>
          
          <Badge variant="outline">
            Urgence: {getUrgencyLabel(task.urgency)}
          </Badge>
          
          <Badge variant="outline">
            Taille: {getSizeLabel(task.size)}
          </Badge>
          
          <Badge variant="outline">
            {getPeriodLabel(task.period)}
          </Badge>
          
          {task.dueDate && (
            <Badge variant="outline" className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(task.dueDate), 'dd MMMM yyyy', { locale: fr })}
            </Badge>
          )}
          
          <Badge variant="outline" className="flex items-center">
            Score: {priorityScore}
          </Badge>
        </div>
        
        {task.description && (
          <div className="mt-6">
            <h2 className="text-lg font-medium">Description</h2>
            <p className="mt-2 text-muted-foreground whitespace-pre-line">
              {task.description}
            </p>
          </div>
        )}
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {task.subTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-medium mb-4">Sous-tâches</h2>
              
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                <span>Progression</span>
                <span>{subTasksCompleted}/{subTasksTotal}</span>
              </div>
              <Progress value={subTasksProgress} className="h-2 mb-4" />
              
              <div className="space-y-3">
                {task.subTasks.map(subTask => (
                  <div key={subTask.id} className="flex items-start gap-2">
                    <Checkbox
                      id={subTask.id}
                      checked={subTask.completed}
                      onCheckedChange={(checked) => {
                        handleToggleSubTask(subTask.id, checked as boolean);
                      }}
                    />
                    <label
                      htmlFor={subTask.id}
                      className={cn(
                        "text-sm cursor-pointer",
                        subTask.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {subTask.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h2 className="text-lg font-medium mb-4">Informations</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Charge mentale :</div>
                <div className="text-sm font-medium">{task.mentalLoad}/10</div>
                
                <div className="text-sm text-muted-foreground">Énergie requise :</div>
                <div className="text-sm font-medium">{task.energyRequired}/10</div>
                
                <div className="text-sm text-muted-foreground">Créée le :</div>
                <div className="text-sm font-medium">
                  {format(new Date(task.createdAt), 'dd MMMM yyyy', { locale: fr })}
                </div>
                
                {task.completed && task.completedAt && (
                  <>
                    <div className="text-sm text-muted-foreground">Terminée le :</div>
                    <div className="text-sm font-medium">
                      {format(new Date(task.completedAt), 'dd MMMM yyyy', { locale: fr })}
                    </div>
                  </>
                )}
                
                <div className="text-sm text-muted-foreground">Dernière modification :</div>
                <div className="text-sm font-medium">
                  {format(new Date(task.updatedAt), 'dd MMMM yyyy HH:mm', { locale: fr })}
                </div>
              </div>
              
              {task.tags.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Tags :</div>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
