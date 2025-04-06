
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Clock, BrainCircuit, Zap } from 'lucide-react';
import TaskService from '@/services/taskService';
import { Task } from '@/types/task';

interface TaskOptimizerWidgetProps {
  tasks?: Task[];
}

const TaskOptimizerWidget: React.FC<TaskOptimizerWidgetProps> = ({ tasks }) => {
  // Use provided tasks or get optimized tasks if not provided
  const optimizedTasks = tasks || TaskService.optimizeTasks().slice(0, 5);
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-center text-muted-foreground mb-4">
        Ordre optimal basé sur la priorité, l'urgence et l'effort requis
      </p>
      
      {optimizedTasks.length > 0 ? (
        optimizedTasks.map((task, index) => (
          <div key={task.id} className="border rounded-lg p-3 bg-background/50 space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <span className="flex justify-center items-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-medium mr-2">
                  {index + 1}
                </span>
                <span className="font-medium">{task.title}</span>
              </div>
              <Badge 
                className={`
                  ${task.priority === 'high' ? 'bg-red-500' : 
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}
                  text-white
                `}
              >
                {task.priority === 'high' ? 'Haute' : 
                  task.priority === 'medium' ? 'Moyenne' : 'Basse'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {TaskService.suggestBestTimeForTask(task)}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <div className="flex items-center" title="Charge mentale">
                  <BrainCircuit className="h-3 w-3 mr-1" />
                  <span>{task.mentalLoad}/10</span>
                </div>
                <div className="flex items-center" title="Énergie requise">
                  <Zap className="h-3 w-3 mr-1" />
                  <span>{task.energyRequired}/10</span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center py-4 text-muted-foreground">
          Aucune tâche à optimiser
        </p>
      )}
      
      <div className="mt-4 text-center">
        <Link to="/tasks" className="text-sm text-primary hover:underline">
          Voir toutes les tâches
        </Link>
      </div>
    </div>
  );
};

export default TaskOptimizerWidget;
