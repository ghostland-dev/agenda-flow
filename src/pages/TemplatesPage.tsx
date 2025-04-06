
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import TaskTemplateList from '@/components/templates/TaskTemplateList';
import { Task } from '@/types/task';
import { useToast } from '@/hooks/use-toast';

const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleUseTemplate = (task: Task) => {
    // When a template is used, navigate to the tasks page
    navigate('/tasks');
  };

  return (
    <Layout>
      <div className="container py-6">
        <TaskTemplateList onUseTemplate={handleUseTemplate} />
      </div>
    </Layout>
  );
};

export default TemplatesPage;
