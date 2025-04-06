
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Bookmark, Copy, Pencil, PlusCircle, Trash } from 'lucide-react';
import { Task, TaskTemplate as TaskTemplateType } from '@/types/task';
import TaskService from '@/services/taskService';
import TaskForm from '../TaskForm';

interface TaskTemplateProps {
  template: TaskTemplateType;
  onEdit: (template: TaskTemplateType) => void;
  onDelete: (id: string) => void;
  onUse: (task: Task) => void;
}

const TaskTemplate: React.FC<TaskTemplateProps> = ({
  template,
  onEdit,
  onDelete,
  onUse
}) => {
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const handleUseTemplate = () => {
    // Create a new task based on the template
    const newTask = TaskService.createTaskFromTemplate(template);
    
    toast({
      title: 'Tâche créée',
      description: `La tâche "${template.title}" a été créée à partir du modèle`
    });
    
    onUse(newTask);
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'work': return 'Travail';
      case 'personal': return 'Personnel';
      case 'health': return 'Santé';
      case 'finance': return 'Finance';
      case 'learning': return 'Apprentissage';
      default: return 'Autre';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-amber-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <>
      <Card className="transition-all hover:border-primary/50 hover:shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              <Bookmark className="mr-1 h-3 w-3" />
              Modèle
            </Badge>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowEditDialog(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-destructive" 
                onClick={() => onDelete(template.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardTitle className="text-base">{template.title}</CardTitle>
          <CardDescription className="line-clamp-2">{template.description || 'Aucune description'}</CardDescription>
        </CardHeader>
        <CardContent className="pb-3 text-sm space-y-2.5">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {getCategoryLabel(template.category)}
            </Badge>
            <Badge className={`text-xs ${getPriorityColor(template.priority)}`}>
              {template.priority === 'high' ? 'Priorité Haute' : 
               template.priority === 'medium' ? 'Priorité Moyenne' : 'Priorité Basse'}
            </Badge>
            {template.tags && template.tags.length > 0 && (
              template.tags.slice(0, 2).map((tag, index) => (
                <Badge variant="outline" key={index} className="text-xs">
                  {tag}
                </Badge>
              ))
            )}
            {template.tags && template.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{template.tags.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            size="sm" 
            onClick={handleUseTemplate}
            variant="outline"
          >
            <Copy className="h-4 w-4 mr-2" />
            Utiliser ce modèle
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le modèle</DialogTitle>
          </DialogHeader>
          <TaskForm 
            task={template as any} 
            isTemplate={true}
            onSuccess={() => {
              setShowEditDialog(false);
              onEdit(template);
            }} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskTemplate;
