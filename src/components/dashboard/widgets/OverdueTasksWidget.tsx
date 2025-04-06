
import React from 'react';
import { Task } from '@/types/task';
import { TaskCard } from '@/components/TaskCard';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface OverdueTasksWidgetProps {
  tasks?: Task[];
}

const OverdueTasksWidget: React.FC<OverdueTasksWidgetProps> = ({ tasks }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 text-sm text-amber-600 mb-4">
        <AlertTriangle className="h-4 w-4" />
        <p className="text-center">Tâches en retard nécessitant votre attention</p>
      </div>
      
      {tasks && tasks.length > 0 ? (
        tasks.map(task => (
          <TaskCard key={task.id} task={task} compact className="border-amber-200 shadow-sm hover:border-amber-300" />
        ))
      ) : (
        <p className="text-center py-6 text-muted-foreground bg-muted/30 rounded-md">
          Félicitations ! Aucune tâche en retard
        </p>
      )}
      
      <div className="mt-4 text-center">
        <Link to="/tasks" className="text-sm text-primary hover:underline inline-flex items-center">
          Voir toutes les tâches
        </Link>
      </div>
    </div>
  );
};

export default OverdueTasksWidget;
