
import React from 'react';
import { Task } from '@/types/task';
import { TaskCard } from '@/components/TaskCard';
import { Link } from 'react-router-dom';

interface TodayTasksWidgetProps {
  tasks?: Task[];
}

const TodayTasksWidget: React.FC<TodayTasksWidgetProps> = ({ tasks }) => {
  return (
    <div className="space-y-4">
      {tasks && tasks.length > 0 ? (
        tasks.map(task => (
          <TaskCard key={task.id} task={task} compact />
        ))
      ) : (
        <p className="text-center py-4 text-muted-foreground">Aucune tâche pour aujourd'hui</p>
      )}
      <div className="mt-4 text-center">
        <Link to="/tasks/today" className="text-sm text-primary hover:underline">
          Voir toutes les tâches d'aujourd'hui
        </Link>
      </div>
    </div>
  );
};

export default TodayTasksWidget;
