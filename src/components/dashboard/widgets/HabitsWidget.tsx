
import React from 'react';
import HabitTracker from '@/components/HabitTracker';
import { Card } from '@/components/ui/card';

const HabitsWidget: React.FC = () => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-center text-muted-foreground mb-4">
        Suivez vos habitudes quotidiennes pour atteindre vos objectifs
      </p>
      <Card className="p-2 shadow-sm border-primary/10">
        <HabitTracker />
      </Card>
    </div>
  );
};

export default HabitsWidget;
