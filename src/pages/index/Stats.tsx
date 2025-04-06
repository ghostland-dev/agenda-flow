
import React, { useEffect, useState } from 'react';
import TaskService from '@/services/taskService';
import { Task } from '@/types/task';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, CartesianGrid 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, subMonths, subWeeks, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const Stats: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [completedTasksOverTime, setCompletedTasksOverTime] = useState<any[]>([]);
  const [tasksPerCategory, setTasksPerCategory] = useState<any[]>([]);
  const [tasksPerPriority, setTasksPerPriority] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const taskStats = TaskService.getTaskStats();
    setStats(taskStats);
    
    // Récupérer toutes les tâches
    const allTasks = TaskService.getTasks();
    
    // Générer les données pour les tâches terminées au fil du temps
    generateCompletedTasksOverTime(allTasks);
    
    // Tâches par catégorie
    const categoryData = [
      { name: 'Travail', value: taskStats.categoryCounts.work || 0, color: '#5C6BC0' },
      { name: 'Personnel', value: taskStats.categoryCounts.personal || 0, color: '#26A69A' },
      { name: 'Santé', value: taskStats.categoryCounts.health || 0, color: '#EC407A' },
      { name: 'Finance', value: taskStats.categoryCounts.finance || 0, color: '#66BB6A' },
      { name: 'Apprentissage', value: taskStats.categoryCounts.learning || 0, color: '#7E57C2' },
      { name: 'Autre', value: taskStats.categoryCounts.other || 0, color: '#78909C' },
    ];
    setTasksPerCategory(categoryData);
    
    // Tâches par priorité
    const priorityData = [
      { name: 'Haute', value: taskStats.priorityCounts.high || 0, color: '#FF5252' },
      { name: 'Moyenne', value: taskStats.priorityCounts.medium || 0, color: '#FFCA28' },
      { name: 'Basse', value: taskStats.priorityCounts.low || 0, color: '#4CAF50' },
    ];
    setTasksPerPriority(priorityData);
    
    setIsLoading(false);
  }, []);
  
  const generateCompletedTasksOverTime = (tasks: Task[]) => {
    const completedTasks = tasks.filter(task => task.completed && task.completedAt);
    
    // Pour les 12 derniers mois
    let lastMonths: any[] = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthName = format(monthDate, 'MMM yyyy', { locale: fr });
      
      const tasksInMonth = completedTasks.filter(task => {
        const completedDate = new Date(task.completedAt!);
        const currentMonth = monthDate.getMonth();
        const currentYear = monthDate.getFullYear();
        return completedDate.getMonth() === currentMonth && completedDate.getFullYear() === currentYear;
      });
      
      lastMonths.push({
        name: monthName,
        value: tasksInMonth.length
      });
    }
    
    // Pour les 12 dernières semaines
    let lastWeeks: any[] = [];
    for (let i = 11; i >= 0; i--) {
      const weekDate = subWeeks(new Date(), i);
      const weekName = `S${format(weekDate, 'w')}`;
      
      const startOfWeek = new Date(weekDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      const tasksInWeek = completedTasks.filter(task => {
        const completedDate = new Date(task.completedAt!);
        return completedDate >= startOfWeek && completedDate <= endOfWeek;
      });
      
      lastWeeks.push({
        name: weekName,
        value: tasksInWeek.length
      });
    }
    
    setCompletedTasksOverTime({
      months: lastMonths,
      weeks: lastWeeks
    });
  };
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Statistiques</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tâches Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tâches Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.completedTasks}</div>
            <div className="text-sm text-muted-foreground">
              {Math.round(stats.completionRate)}% de complétion
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tâches En Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.pendingTasks}</div>
            <div className="text-sm text-muted-foreground">
              {stats.overdueTasks} en retard
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tâches par Priorité</CardTitle>
            <CardDescription>Distribution des tâches selon leur priorité</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tasksPerPriority}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {tasksPerPriority.map((entry, index) => (
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
                data={tasksPerCategory}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Tâches" radius={[0, 4, 4, 0]}>
                  {tasksPerCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Tâches Terminées au Fil du Temps</CardTitle>
          <CardDescription>Nombre de tâches terminées par période</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="months" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="months">Par Mois</TabsTrigger>
              <TabsTrigger value="weeks">Par Semaine</TabsTrigger>
            </TabsList>
            
            <TabsContent value="months" className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={completedTasksOverTime.months}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Tâches terminées" 
                    stroke="#5C6BC0" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="weeks" className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={completedTasksOverTime.weeks}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Tâches terminées" 
                    stroke="#26A69A" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
