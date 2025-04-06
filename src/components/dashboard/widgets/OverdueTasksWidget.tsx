
import React from 'react';
import { Task } from '@/types/task';
import { TaskCard } from '@/components/TaskCard';
import { Link } from 'react-router-dom';

interface OverdueTasksWidgetProps {
  tasks?: Task[];
}

const OverdueTasksWidget: React.FC<OverdueTasksWidgetProps> = ({ tasks }) => {
  return (
    <div className="space-y-4">
      {tasks && tasks.length > 0 ? (
        tasks.map(task => (
          <TaskCard key={task.id} task={task} compact />
        ))
      ) : (
        <p className="text-center py-4 text-muted-foreground">Aucune tâche en retard</p>
      )}
      <div className="mt-4 text-center">
        <Link to="/tasks" className="text-sm text-primary hover:underline">
          Voir toutes les tâches
        </Link>
      </div>
    </div>
  );
};

export default OverdueTasksWidget;
