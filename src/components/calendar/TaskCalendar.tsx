
import React, { useState, useMemo } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { TaskCard } from '@/components/TaskCard';
import { Task } from '@/types/task';
import { fr } from 'date-fns/locale';
import { format, isEqual, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface TaskCalendarProps {
  tasks: Task[];
  onRefresh: () => void;
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, onRefresh }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Filter tasks for the selected date
  const tasksForSelectedDate = useMemo(() => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), selectedDate)
    );
  }, [tasks, selectedDate]);

  // Create a map of dates to task counts for the calendar
  const dateToTaskMap = useMemo(() => {
    const map = new Map<string, { count: number; priorities: Record<string, number> }>();
    
    // Initialize all days of the current month
    const monthDays = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    });
    
    monthDays.forEach(day => {
      map.set(format(day, 'yyyy-MM-dd'), { 
        count: 0,
        priorities: { high: 0, medium: 0, low: 0 }
      });
    });
    
    // Add tasks to the map
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
        const existing = map.get(dateKey) || { count: 0, priorities: { high: 0, medium: 0, low: 0 } };
        
        existing.count += 1;
        if (task.priority) {
          existing.priorities[task.priority] += 1;
        }
        
        map.set(dateKey, existing);
      }
    });
    
    return map;
  }, [tasks, currentMonth]);

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">Calendrier des tâches</h2>
          <p className="text-muted-foreground">Visualisez vos tâches par date</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <Calendar className="h-4 w-4 mr-2" />
          Aujourd'hui
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Calendrier</CardTitle>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              locale={fr}
              disabled={{ before: new Date(2000, 0, 1) }}
              className="rounded-md border shadow-sm"
              modifiersStyles={{
                selected: { backgroundColor: 'var(--primary)' }
              }}
              modifiers={{
                hasTasks: (date) => {
                  const dateKey = format(date, 'yyyy-MM-dd');
                  return (dateToTaskMap.get(dateKey)?.count || 0) > 0;
                }
              }}
              components={{
                DayContent: ({ date }) => {
                  const dateKey = format(date, 'yyyy-MM-dd');
                  const dayData = dateToTaskMap.get(dateKey);
                  const taskCount = dayData?.count || 0;
                  
                  return (
                    <div className="relative flex h-9 w-9 items-center justify-center">
                      {date.getDate()}
                      {taskCount > 0 && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {dayData!.priorities.high > 0 && (
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          )}
                          {dayData!.priorities.medium > 0 && (
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          )}
                          {dayData!.priorities.low > 0 && (
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          )}
                        </span>
                      )}
                    </div>
                  );
                }
              }}
            />
            
            <div className="mt-4 flex justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500" />
                Priorité haute
              </div>
              <div className="flex items-center">
                <span className="mr-1.5 h-2 w-2 rounded-full bg-amber-500" />
                Moyenne
              </div>
              <div className="flex items-center">
                <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500" />
                Basse
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>
              Tâches du {format(selectedDate, "d MMMM yyyy", { locale: fr })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksForSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {tasksForSelectedDate.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={onRefresh}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Aucune tâche pour cette date</h3>
                <p className="text-muted-foreground mt-1">
                  Sélectionnez une autre date ou ajoutez une nouvelle tâche
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskCalendar;
