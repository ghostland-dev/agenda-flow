
import React from 'react';
import { Task } from '@/types/task';
import { TaskCard } from '@/components/TaskCard';
import { Link } from 'react-router-dom';
import HabitTracker from '@/components/HabitTracker';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import TaskService from '@/services/taskService';
import { Badge } from '@/components/ui/badge';
import { Clock, BrainCircuit, Zap } from 'lucide-react';

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
    
    case 'urgent-tasks':
      return (
        <div className="space-y-4">
          {tasks && tasks.length > 0 ? (
            tasks.map(task => (
              <TaskCard key={task.id} task={task} compact />
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">Aucune tâche urgente</p>
          )}
          <div className="mt-4 text-center">
            <Link to="/tasks/urgent" className="text-sm text-primary hover:underline">
              Voir toutes les tâches urgentes
            </Link>
          </div>
        </div>
      );
    
    case 'overdue-tasks':
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
    
    case 'habits':
      return <HabitTracker />;
    
    case 'priority-chart':
      if (!stats) return <p>Chargement...</p>;
      
      const priorityData = [
        { name: 'Haute', value: stats.priorityCounts.high || 0, color: '#FF5252' },
        { name: 'Moyenne', value: stats.priorityCounts.medium || 0, color: '#FFCA28' },
        { name: 'Basse', value: stats.priorityCounts.low || 0, color: '#4CAF50' },
      ];
      
      return (
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [value, name]} 
                labelFormatter={() => ''} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    
    case 'category-chart':
      if (!stats) return <p>Chargement...</p>;
      
      const categoryData = [
        { name: 'Travail', value: stats.categoryCounts.work || 0, color: '#5C6BC0' },
        { name: 'Personnel', value: stats.categoryCounts.personal || 0, color: '#26A69A' },
        { name: 'Santé', value: stats.categoryCounts.health || 0, color: '#EC407A' },
        { name: 'Finance', value: stats.categoryCounts.finance || 0, color: '#66BB6A' },
        { name: 'Apprentissage', value: stats.categoryCounts.learning || 0, color: '#7E57C2' },
        { name: 'Autre', value: stats.categoryCounts.other || 0, color: '#78909C' },
      ];
      
      return (
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Tâches" radius={[0, 4, 4, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
      
    case 'task-optimizer':
      // Utiliser le service d'optimisation pour obtenir les tâches dans l'ordre optimal
      const optimizedTasks = TaskService.optimizeTasks().slice(0, 5); // Limiter à 5 tâches
      
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
    
    default:
      return <p>Type de widget non reconnu</p>;
  }
};

export default WidgetContent;
