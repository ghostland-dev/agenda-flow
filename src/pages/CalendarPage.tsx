
import React, { useState, useEffect } from 'react';
import TaskCalendar from '@/components/calendar/TaskCalendar';
import Layout from '@/components/Layout';
import TaskService from '@/services/taskService';
import { Task } from '@/types/task';

const CalendarPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadTasks = () => {
    setIsLoading(true);
    const loadedTasks = TaskService.getTasks();
    setTasks(loadedTasks);
    setIsLoading(false);
  };
  
  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <Layout>
      <div className="container py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <TaskCalendar 
            tasks={tasks}
            onRefresh={loadTasks}
          />
        )}
      </div>
    </Layout>
  );
};

export default CalendarPage;
