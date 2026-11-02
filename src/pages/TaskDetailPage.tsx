import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TaskService from '@/services/taskService';

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const task = TaskService.getTasks().find((t) => t.id === id);

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 md:px-6 max-w-3xl">
        <Link to="/tasks">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux tâches
          </Button>
        </Link>

        {!task ? (
          <p className="text-muted-foreground">Cette tâche n'existe pas ou a été supprimée.</p>
        ) : (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{task.status}</Badge>
              <Badge variant="outline">{task.priority}</Badge>
              <Badge variant="outline">{task.category}</Badge>
              {task.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            {task.description && <p className="whitespace-pre-line">{task.description}</p>}
            {task.dueDate && (
              <p className="text-sm text-muted-foreground">
                Échéance : {new Date(task.dueDate).toLocaleDateString('fr-FR')}
              </p>
            )}
            {task.subTasks && task.subTasks.length > 0 && (
              <ul className="list-disc pl-5 space-y-1">
                {task.subTasks.map((sub) => (
                  <li key={sub.id} className={sub.completed ? 'line-through text-muted-foreground' : ''}>
                    {sub.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TaskDetailPage;
