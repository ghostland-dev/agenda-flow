
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  Task, 
  TaskPriority, 
  TaskUrgency, 
  TaskSize, 
  TaskCategory, 
  TaskPeriod 
} from '@/types/task';
import TaskService from '@/services/taskService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SliderInput } from './SliderInput';
import { TagInput } from './TagInput';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Plus, Trash } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSuccess }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isEditing = !!task;
  
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [urgency, setUrgency] = useState<TaskUrgency>(task?.urgency || 'soon');
  const [size, setSize] = useState<TaskSize>(task?.size || 'medium');
  const [category, setCategory] = useState<TaskCategory>(task?.category || 'personal');
  const [period, setPeriod] = useState<TaskPeriod>(task?.period || 'daily');
  const [dueDate, setDueDate] = useState<Date | undefined>(task?.dueDate || undefined);
  const [subTasks, setSubTasks] = useState<{id?: string; title: string; completed: boolean}[]>(
    task?.subTasks || []
  );
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [mentalLoad, setMentalLoad] = useState(task?.mentalLoad || 5);
  const [energyRequired, setEnergyRequired] = useState(task?.energyRequired || 5);
  const [newSubTask, setNewSubTask] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le titre de la tâche est requis',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      if (isEditing && task) {
        TaskService.updateTask(task.id, {
          title,
          description,
          priority,
          urgency,
          size,
          category,
          period,
          dueDate: dueDate || null,
          subTasks: subTasks.map(st => ({
            id: st.id || '',
            title: st.title,
            completed: st.completed,
            createdAt: new Date()
          })),
          tags,
          mentalLoad,
          energyRequired,
        });
        
        toast({
          title: 'Succès',
          description: 'Tâche mise à jour avec succès',
        });
      } else {
        TaskService.createTask({
          title,
          description,
          priority,
          urgency,
          size,
          category,
          period,
          status: 'pending',
          dueDate: dueDate || null,
          subTasks: subTasks.map(st => ({
            id: '',
            title: st.title,
            completed: st.completed,
            createdAt: new Date()
          })),
          tags,
          completed: false,
          completedAt: null,
          mentalLoad,
          energyRequired,
        });
        
        toast({
          title: 'Succès',
          description: 'Nouvelle tâche créée avec succès',
        });
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/tasks');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la tâche:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde de la tâche',
        variant: 'destructive',
      });
    }
  };
  
  const handleAddSubTask = () => {
    if (newSubTask.trim()) {
      setSubTasks([...subTasks, { title: newSubTask, completed: false }]);
      setNewSubTask('');
    }
  };
  
  const handleRemoveSubTask = (index: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-3">
      <div className="space-y-4">
        <div className="grid gap-3">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            placeholder="Titre de la tâche"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Description détaillée"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Basse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="urgency">Urgence</Label>
            <Select value={urgency} onValueChange={(value) => setUrgency(value as TaskUrgency)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une urgence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immédiate</SelectItem>
                <SelectItem value="soon">Prochaine</SelectItem>
                <SelectItem value="later">Plus tard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="size">Taille</Label>
            <Select value={size} onValueChange={(value) => setSize(value as TaskSize)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une taille" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Petite</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as TaskCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Travail</SelectItem>
                <SelectItem value="personal">Personnel</SelectItem>
                <SelectItem value="health">Santé</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="learning">Apprentissage</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="period">Période</Label>
            <Select value={period} onValueChange={(value) => setPeriod(value as TaskPeriod)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Quotidienne</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuelle</SelectItem>
                <SelectItem value="yearly">Annuelle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="due-date">Date d'échéance</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? (
                    format(dueDate, "PPP", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Charge Mentale (1-10)</Label>
          <SliderInput value={mentalLoad} onChange={setMentalLoad} min={1} max={10} step={1} />
        </div>
        
        <div className="space-y-2">
          <Label>Énergie Requise (1-10)</Label>
          <SliderInput value={energyRequired} onChange={setEnergyRequired} min={1} max={10} step={1} />
        </div>
        
        <div className="space-y-2">
          <Label>Tags</Label>
          <TagInput tags={tags} setTags={setTags} suggestions={TaskService.getTags()} />
        </div>
        
        <div className="space-y-3">
          <Label>Sous-tâches</Label>
          
          <div className="space-y-2">
            {subTasks.map((subTask, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={subTask.title}
                  onChange={(e) => {
                    const updatedSubTasks = [...subTasks];
                    updatedSubTasks[index].title = e.target.value;
                    setSubTasks(updatedSubTasks);
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveSubTask(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <div className="flex items-center gap-2">
              <Input
                placeholder="Nouvelle sous-tâche"
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubTask();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddSubTask}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button type="submit">
          {isEditing ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
