import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Task, TaskPriority, TaskCategory } from '@/types/task';
import { CheckCircle, Clock, Activity, BarChart3, LineChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TaskStatisticsProps {
  tasks: Task[];
  completedToday: number;
  averageCompletionTime?: number; // in minutes
}

const COLORS = {
  high: "#ef4444", // red-500
  medium: "#f59e0b", // amber-500
  low: "#10b981", // emerald-500
  work: "#3b82f6", // blue-500
  personal: "#8b5cf6", // violet-500
  health: "#ec4899", // pink-500
  finance: "#14b8a6", // teal-500
  learning: "#f97316", // orange-500
  other: "#6b7280", // gray-500
};

const TaskStatistics: React.FC<TaskStatisticsProps> = ({ 
  tasks, 
  completedToday,
  averageCompletionTime = 0 
}) => {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Priority distribution
    const priorityData = [
      { name: 'Haute', value: 0, color: COLORS.high },
      { name: 'Moyenne', value: 0, color: COLORS.medium },
      { name: 'Basse', value: 0, color: COLORS.low },
    ];
    
    // Category distribution
    const categoryData = [
      { name: 'Travail', value: 0, color: COLORS.work },
      { name: 'Personnel', value: 0, color: COLORS.personal },
      { name: 'Santé', value: 0, color: COLORS.health },
      { name: 'Finance', value: 0, color: COLORS.finance },
      { name: 'Apprentissage', value: 0, color: COLORS.learning },
      { name: 'Autre', value: 0, color: COLORS.other },
    ];
    
    // Count by priority and category
    tasks.forEach(task => {
      // Priority
      if (task.priority === 'high') priorityData[0].value += 1;
      else if (task.priority === 'medium') priorityData[1].value += 1;
      else if (task.priority === 'low') priorityData[2].value += 1;
      
      // Category
      if (task.category === 'work') categoryData[0].value += 1;
      else if (task.category === 'personal') categoryData[1].value += 1;
      else if (task.category === 'health') categoryData[2].value += 1;
      else if (task.category === 'finance') categoryData[3].value += 1;
      else if (task.category === 'learning') categoryData[4].value += 1;
      else categoryData[5].value += 1;
    });
    
    // Only keep categories with values
    const filteredCategoryData = categoryData.filter(cat => cat.value > 0);
    
    // Weekly performance (completed tasks per day for the last 7 days)
    const today = new Date();
    const weeklyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(date);
      
      const completedTasks = tasks.filter(task => {
        if (!task.completed || !task.completedAt) return false;
        const completedDate = new Date(task.completedAt);
        return completedDate >= date && completedDate < nextDay;
      }).length;
      
      weeklyData.push({
        name: dayName,
        Tâches: completedTasks
      });
    }
    
    return {
      total,
      completed,
      pending,
      completionRate,
      priorityData,
      categoryData: filteredCategoryData,
      weeklyData
    };
  }, [tasks]);
  
  // Find the most recent completed task
  const lastCompletedTask = useMemo(() => {
    const completedTasks = tasks
      .filter(task => task.completed && task.completedAt)
      .sort((a, b) => {
        const dateA = new Date(a.completedAt || 0);
        const dateB = new Date(b.completedAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
    
    return completedTasks[0];
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Key metrics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-primary" />
            Statistiques
          </CardTitle>
          <CardDescription>Aperçu de votre progression</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-center">
            <div className="flex flex-col px-4 py-3 rounded-lg bg-primary/10">
              <dt className="text-sm font-medium text-muted-foreground">Tâches totales</dt>
              <dd className="text-2xl font-bold">{stats.total}</dd>
            </div>
            <div className="flex flex-col px-4 py-3 rounded-lg bg-primary/10">
              <dt className="text-sm font-medium text-muted-foreground">Complétées</dt>
              <dd className="text-2xl font-bold">{stats.completed}</dd>
            </div>
            <div className="flex flex-col px-4 py-3 rounded-lg bg-primary/10">
              <dt className="text-sm font-medium text-muted-foreground">En attente</dt>
              <dd className="text-2xl font-bold">{stats.pending}</dd>
            </div>
            <div className="flex flex-col px-4 py-3 rounded-lg bg-primary/10">
              <dt className="text-sm font-medium text-muted-foreground">Taux de complétion</dt>
              <dd className="text-2xl font-bold">{stats.completionRate}%</dd>
            </div>
          </dl>
          
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>Aujourd'hui</span>
              <span className="font-medium">{completedToday} tâches complétées</span>
            </div>
            {lastCompletedTask && (
              <div className="flex justify-between text-sm">
                <span>Dernière tâche complétée</span>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(lastCompletedTask.completedAt!), { 
                    addSuffix: true,
                    locale: fr 
                  })}
                </span>
              </div>
            )}
            {averageCompletionTime > 0 && (
              <div className="flex justify-between text-sm">
                <span>Temps moyen de complétion</span>
                <span className="font-medium">{averageCompletionTime} min</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Weekly Performance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            Performance hebdomadaire
          </CardTitle>
          <CardDescription>Tâches complétées sur les 7 derniers jours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.weeklyData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="Tâches" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Priority Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            Distribution par priorité
          </CardTitle>
          <CardDescription>Vos tâches par niveau de priorité</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            {stats.priorityData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} tâche${value !== 1 ? 's' : ''}`]}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-muted-foreground">Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Category Distribution */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <LineChart className="h-5 w-5 mr-2 text-primary" />
            Distribution par catégorie
          </CardTitle>
          <CardDescription>Vos tâches par catégorie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            {stats.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.categoryData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip 
                    formatter={(value) => [`${value} tâche${value !== 1 ? 's' : ''}`]} 
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-muted-foreground">Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskStatistics;
