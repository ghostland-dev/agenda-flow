
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Habit {
  id: string;
  title: string;
  completed: boolean;
}

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const { toast } = useToast();

  // Load habits from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem('daily-habits');
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (e) {
        console.error('Failed to parse habits', e);
      }
    }
  }, []);

  // Save habits to localStorage when they change
  useEffect(() => {
    localStorage.setItem('daily-habits', JSON.stringify(habits));
  }, [habits]);

  const handleAddHabit = () => {
    if (!newHabit.trim()) return;
    
    const habit: Habit = {
      id: Date.now().toString(),
      title: newHabit.trim(),
      completed: false
    };
    
    setHabits([...habits, habit]);
    setNewHabit('');
    
    toast({
      title: 'Habitude ajoutée',
      description: `"${habit.title}" a été ajoutée à vos habitudes quotidiennes.`,
    });
  };

  const handleToggleHabit = (id: string) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const handleRemoveHabit = (id: string) => {
    const habitToRemove = habits.find(h => h.id === id);
    setHabits(habits.filter(habit => habit.id !== id));
    
    if (habitToRemove) {
      toast({
        title: 'Habitude supprimée',
        description: `"${habitToRemove.title}" a été supprimée.`,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddHabit();
    }
  };

  const resetDailyHabits = () => {
    setHabits(habits.map(habit => ({ ...habit, completed: false })));
    toast({
      title: 'Habitudes réinitialisées',
      description: 'Toutes les habitudes ont été réinitialisées pour aujourd\'hui.',
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Habitudes Quotidiennes</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetDailyHabits}
            className="h-8"
          >
            <Save className="h-3.5 w-3.5 mr-1" />
            Réinitialiser
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex mb-3">
          <Input
            placeholder="Ajouter une habitude quotidienne..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 mr-2"
          />
          <Button onClick={handleAddHabit} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {habits.length === 0 ? (
          <p className="text-center text-muted-foreground py-3 text-sm">
            Ajoutez vos habitudes quotidiennes ici
          </p>
        ) : (
          <div className="space-y-2 mt-2">
            {habits.map((habit) => (
              <div 
                key={habit.id}
                className="flex items-center justify-between group py-1 px-2 rounded-md hover:bg-muted/50"
              >
                <div className="flex items-center">
                  <Checkbox 
                    id={`habit-${habit.id}`}
                    checked={habit.completed}
                    onCheckedChange={() => handleToggleHabit(habit.id)}
                    className="mr-2"
                  />
                  <label 
                    htmlFor={`habit-${habit.id}`}
                    className={`text-sm cursor-pointer ${habit.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {habit.title}
                  </label>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100" 
                  onClick={() => handleRemoveHabit(habit.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitTracker;
