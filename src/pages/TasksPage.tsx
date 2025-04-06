
// Update Tasks page to link to templates

import React from 'react';
import Layout from '@/components/Layout';
import TaskList from '@/components/TaskList';
import { Link } from 'react-router-dom';
import { BookTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TasksPageProps {
  searchQuery?: string;
  focusMode?: boolean;
}

const TasksPage: React.FC<TasksPageProps> = ({ searchQuery = '', focusMode = false }) => {
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Mes tâches</h1>
          <Link to="/templates">
            <Button variant="outline">
              <BookTemplate className="h-4 w-4 mr-2" />
              Modèles
            </Button>
          </Link>
        </div>
        <TaskList 
          initialFilter={{ search: searchQuery }} 
          focusMode={focusMode}
        />
      </div>
    </Layout>
  );
};

export default TasksPage;
