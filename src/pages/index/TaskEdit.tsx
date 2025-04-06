
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Task } from '@/types/task';
import TaskService from '@/services/taskService';
import TaskForm from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TaskEdit: React.FC = () => {
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
  
  const handleSuccess = () => {
    navigate(`/tasks/${id}`);
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
  
  return (
    <div className="container py-8 max-w-3xl">
      <div className="flex items-center mb-6">
        <Button variant="outline" asChild>
          <Link to={`/tasks/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
        <h1 className="text-2xl font-bold ml-4">Modifier la tâche</h1>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <TaskForm task={task} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default TaskEdit;
