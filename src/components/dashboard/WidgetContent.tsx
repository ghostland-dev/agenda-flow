
import React from 'react';
import { Task } from '@/types/task';
import TodayTasksWidget from './widgets/TodayTasksWidget';
import UrgentTasksWidget from './widgets/UrgentTasksWidget';
import OverdueTasksWidget from './widgets/OverdueTasksWidget';
import HabitsWidget from './widgets/HabitsWidget';
import PriorityChartWidget from './widgets/PriorityChartWidget';
import CategoryChartWidget from './widgets/CategoryChartWidget';
import TaskOptimizerWidget from './widgets/TaskOptimizerWidget';

export interface WidgetContentProps {
  type: string;
  data: {
    tasks?: Task[];
    stats?: any;
  };
}

const WidgetContent: React.FC<WidgetContentProps> = ({ type, data }) => {
  const { tasks, stats } = data;

  switch (type) {
    case 'today-tasks':
      return <TodayTasksWidget tasks={tasks} />;
    
    case 'urgent-tasks':
      return <UrgentTasksWidget tasks={tasks} />;
    
    case 'overdue-tasks':
      return <OverdueTasksWidget tasks={tasks} />;
    
    case 'habits':
      return <HabitsWidget />;
    
    case 'priority-chart':
      return <PriorityChartWidget stats={stats} />;
    
    case 'category-chart':
      return <CategoryChartWidget stats={stats} />;
    
    case 'task-optimizer':
      return <TaskOptimizerWidget tasks={tasks} />;
    
    default:
      return <p>Type de widget non reconnu</p>;
  }
};

export default WidgetContent;
