
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardsProps {
  stats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    completionRate: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
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
  );
};

export default StatsCards;
