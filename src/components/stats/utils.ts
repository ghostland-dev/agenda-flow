
import { Task } from '@/types/task';
import { format, subMonths, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface CompletedTasksOverTime {
  months: Array<{ name: string; value: number }>;
  weeks: Array<{ name: string; value: number }>;
}

export const generateCompletedTasksOverTime = (tasks: Task[]): CompletedTasksOverTime => {
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
  
  return {
    months: lastMonths,
    weeks: lastWeeks
  };
};
