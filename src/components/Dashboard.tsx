
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TaskService from '@/services/taskService';
import { TaskCard } from './TaskCard';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { Task } from '@/types/task';
import { Clock, CheckSquare, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    // Charger les statistiques
    const taskStats = TaskService.getTaskStats();
    setStats(taskStats);
    
    // Charger les tâches urgentes
    const urgent = TaskService.getTasks({
      urgencies: ['immediate'],
      sortBy: 'dueDate',
      sortDirection: 'asc',
    }).slice(0, 5);
    setUrgentTasks(urgent);
    
    // Charger les tâches du jour
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    today.setHours(0, 0, 0, 0);
    
    const todayTasksList = TaskService.getTasks({
      dueAfterDate: today,
      dueBeforeDate: tomorrow,
      sortBy: 'priority',
      sortDirection: 'desc',
    }).slice(0, 5);
    setTodayTasks(todayTasksList);
    
    // Charger les tâches en retard
    const overdue = TaskService.getTasks({
      dueBeforeDate: today,
      statuses: ['pending', 'in-progress'],
      sortBy: 'dueDate',
      sortDirection: 'asc',
    }).slice(0, 5);
    setOverdueTasks(overdue);
  }, []);
  
  if (!stats) {
    return <div className="p-8 text-center">Chargement des données...</div>;
  }
  
  // Préparer les données pour le graphique de priorité
  const priorityData = [
    { name: 'Haute', value: stats.priorityCounts.high || 0, color: '#FF5252' },
    { name: 'Moyenne', value: stats.priorityCounts.medium || 0, color: '#FFCA28' },
    { name: 'Basse', value: stats.priorityCounts.low || 0, color: '#4CAF50' },
  ];
  
  // Préparer les données pour le graphique de catégorie
  const categoryData = [
    { name: 'Travail', value: stats.categoryCounts.work || 0, color: '#5C6BC0' },
    { name: 'Personnel', value: stats.categoryCounts.personal || 0, color: '#26A69A' },
    { name: 'Santé', value: stats.categoryCounts.health || 0, color: '#EC407A' },
    { name: 'Finance', value: stats.categoryCounts.finance || 0, color: '#66BB6A' },
    { name: 'Apprentissage', value: stats.categoryCounts.learning || 0, color: '#7E57C2' },
    { name: 'Autre', value: stats.categoryCounts.other || 0, color: '#78909C' },
  ];
  
  // Préparer les données pour le graphique de périodes
  const periodData = [
    { name: 'Quotidien', value: stats.periodCounts.daily || 0 },
    { name: 'Hebdo', value: stats.periodCounts.weekly || 0 },
    { name: 'Mensuel', value: stats.periodCounts.monthly || 0 },
    { name: 'Annuel', value: stats.periodCounts.yearly || 0 },
  ];
  
  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tâches Totales</CardTitle>
            <CardDescription>Nombre total de tâches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTasks}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              {stats.completedTasks} terminées ({Math.round(stats.completionRate)}%)
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">En Attente</CardTitle>
            <CardDescription>Tâches non terminées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingTasks}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              {stats.overdueTasks} en retard
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Priorités Hautes</CardTitle>
            <CardDescription>Tâches prioritaires</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.priorityCounts.high || 0}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              {urgentTasks.filter(t => !t.completed).length} en attente
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Aujourd'hui</CardTitle>
            <CardDescription>Tâches pour aujourd'hui</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayTasks.length}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              {todayTasks.filter(t => t.completed).length} terminées
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tâches par Priorité</CardTitle>
            <CardDescription>Distribution des tâches selon leur priorité</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
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
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tâches par Catégorie</CardTitle>
            <CardDescription>Distribution des tâches selon leur catégorie</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
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
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-4 w-4 text-priority-high" />
                Tâches Urgentes
              </CardTitle>
              <CardDescription>Nécessitent une attention immédiate</CardDescription>
            </div>
            <Link to="/tasks/urgent" className="text-sm text-primary hover:underline">
              Voir tout
            </Link>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              {urgentTasks.length > 0 ? (
                urgentTasks.map(task => (
                  <TaskCard key={task.id} task={task} compact />
                ))
              ) : (
                <p className="text-center py-4 text-muted-foreground">Aucune tâche urgente</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center">
                <CheckSquare className="mr-2 h-4 w-4 text-priority-medium" />
                Tâches d'Aujourd'hui
              </CardTitle>
              <CardDescription>À faire aujourd'hui</CardDescription>
            </div>
            <Link to="/tasks/today" className="text-sm text-primary hover:underline">
              Voir tout
            </Link>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              {todayTasks.length > 0 ? (
                todayTasks.map(task => (
                  <TaskCard key={task.id} task={task} compact />
                ))
              ) : (
                <p className="text-center py-4 text-muted-foreground">Aucune tâche pour aujourd'hui</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                Tâches en Retard
              </CardTitle>
              <CardDescription>Échéance dépassée</CardDescription>
            </div>
            <Link to="/tasks" className="text-sm text-primary hover:underline">
              Voir tout
            </Link>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              {overdueTasks.length > 0 ? (
                overdueTasks.map(task => (
                  <TaskCard key={task.id} task={task} compact />
                ))
              ) : (
                <p className="text-center py-4 text-muted-foreground">Aucune tâche en retard</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
