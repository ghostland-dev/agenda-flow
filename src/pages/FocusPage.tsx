
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PomodoroTimer from '@/components/pomodoro/PomodoroTimer';
import { TaskCard } from '@/components/TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';
import TaskService from '@/services/taskService';
import { CheckCircle2, List, Clock, FileText, Timer } from 'lucide-react';

const FocusPage: React.FC = () => {
  const { toast } = useToast();
  const [priorityTasks, setPriorityTasks] = useState<Task[]>([]);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noteInput, setNoteInput] = useState('');
  
  // Load priority tasks (high priority & due today)
  const loadPriorityTasks = () => {
    setIsLoading(true);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tasks = TaskService.getTasks({
      priorities: ['high'],
      dueAfterDate: today,
      dueBeforeDate: tomorrow,
      sortBy: 'priority',
      sortDirection: 'desc'
    });
    
    // Also add other high priority tasks
    const highPriorityTasks = TaskService.getTasks({
      priorities: ['high'],
      completed: false
    });
    
    // Combine, filter duplicates, and sort by priority
    const combinedTasks = [...tasks];
    
    highPriorityTasks.forEach(task => {
      if (!combinedTasks.find(t => t.id === task.id)) {
        combinedTasks.push(task);
      }
    });
    
    // Sort by priority score
    combinedTasks.sort((a, b) => 
      TaskService.calculatePriorityScore(b) - TaskService.calculatePriorityScore(a)
    );
    
    setPriorityTasks(combinedTasks);
    
    // If we don't have a current task but have tasks available, set the first as current
    if (!currentTaskId && combinedTasks.length > 0 && !combinedTasks[0].completed) {
      setCurrentTaskId(combinedTasks[0].id);
    }
    
    setIsLoading(false);
  };
  
  useEffect(() => {
    loadPriorityTasks();
  }, []);

  const getCurrentTask = () => {
    return priorityTasks.find(task => task.id === currentTaskId);
  };
  
  const handleCompleteTask = () => {
    if (!currentTaskId) return;
    
    const currentTask = getCurrentTask();
    if (!currentTask) return;
    
    // Mark task as completed
    TaskService.completeTask(currentTaskId);
    
    toast({
      title: 'Tâche complétée',
      description: `"${currentTask.title}" a été marquée comme terminée`,
    });
    
    // Reset current task and reload tasks
    setCurrentTaskId(null);
    loadPriorityTasks();
  };
  
  const handleSelectTask = (taskId: string) => {
    setCurrentTaskId(taskId);
  };
  
  const handleSkipTask = () => {
    if (!currentTaskId) return;
    
    // Find next uncompleted task
    const currentIndex = priorityTasks.findIndex(task => task.id === currentTaskId);
    let nextTaskIndex = -1;
    
    for (let i = currentIndex + 1; i < priorityTasks.length; i++) {
      if (!priorityTasks[i].completed) {
        nextTaskIndex = i;
        break;
      }
    }
    
    // If no next task, start from beginning (excluding current)
    if (nextTaskIndex === -1) {
      for (let i = 0; i < currentIndex; i++) {
        if (!priorityTasks[i].completed) {
          nextTaskIndex = i;
          break;
        }
      }
    }
    
    if (nextTaskIndex !== -1) {
      setCurrentTaskId(priorityTasks[nextTaskIndex].id);
      toast({
        description: `Passage à "${priorityTasks[nextTaskIndex].title}"`,
      });
    } else {
      setCurrentTaskId(null);
      toast({
        description: 'Aucune autre tâche disponible',
      });
    }
  };
  
  const handleSaveNote = () => {
    if (!noteInput.trim()) return;
    
    // In a real app, this would save the note to the database
    // For now, we'll just show a toast
    toast({
      title: 'Note enregistrée',
      description: 'Votre note a été enregistrée',
    });
    setNoteInput('');
  };
  
  const handlePomodoroComplete = () => {
    toast({
      title: 'Session terminée !',
      description: 'Prenez une courte pause ou continuez à travailler.'
    });
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Mode Focus</h1>
            <p className="text-muted-foreground">Concentrez-vous sur une tâche à la fois</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Current Task */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-lg">
                  <div className="flex items-center">
                    <Timer className="h-5 w-5 mr-2 text-primary" />
                    Tâche actuelle
                  </div>
                  <Badge variant="outline">Focus</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-24">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : currentTaskId ? (
                  <div className="space-y-4">
                    <TaskCard task={getCurrentTask()!} compact={false} />
                    
                    <div className="flex gap-3 justify-end">
                      <Button variant="outline" onClick={handleSkipTask}>
                        Passer
                      </Button>
                      <Button onClick={handleCompleteTask}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Terminer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">Aucune tâche sélectionnée</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      Sélectionnez une tâche dans la liste pour commencer à travailler dessus
                    </p>
                    {priorityTasks.length > 0 && (
                      <Button 
                        onClick={() => handleSelectTask(priorityTasks[0].id)} 
                        variant="outline" 
                        size="sm"
                      >
                        Sélectionner la première tâche
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Notes for focused work */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full h-32 p-3 border rounded-md resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="Prenez des notes pendant que vous travaillez..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <Button onClick={handleSaveNote} size="sm">
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Pomodoro Timer */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Pomodoro Timer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PomodoroTimer onSessionComplete={handlePomodoroComplete} />
              </CardContent>
            </Card>
            
            {/* Task List */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <List className="h-5 w-5 mr-2 text-primary" />
                  Tâches prioritaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-24">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : priorityTasks.length > 0 ? (
                  <div className="space-y-2">
                    {priorityTasks
                      .filter(task => !task.completed)
                      .map(task => (
                        <div 
                          key={task.id}
                          className={`border rounded-md p-2 cursor-pointer hover:border-primary transition-colors ${
                            task.id === currentTaskId ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => handleSelectTask(task.id)}
                        >
                          <TaskCard task={task} compact={true} />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">Aucune tâche prioritaire</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FocusPage;
