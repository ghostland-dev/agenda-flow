
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Search } from 'lucide-react';
import { TaskTemplate as TaskTemplateType, Task } from '@/types/task';
import TaskService from '@/services/taskService';
import TaskTemplate from './TaskTemplate';
import TaskForm from '../TaskForm';

interface TaskTemplateListProps {
  onUseTemplate?: (task: Task) => void;
}

const TaskTemplateList: React.FC<TaskTemplateListProps> = ({ onUseTemplate }) => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<TaskTemplateType[]>(TaskService.getTemplates());
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTemplateDialog, setShowNewTemplateDialog] = useState(false);
  
  // Filter templates based on search query
  const filteredTemplates = templates.filter(template => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      template.title.toLowerCase().includes(query) ||
      (template.description && template.description.toLowerCase().includes(query)) ||
      (template.tags && template.tags.some(tag => tag.toLowerCase().includes(query))) ||
      template.category.toLowerCase().includes(query)
    );
  });
  
  const handleSaveTemplate = (task: Task) => {
    // Convert task to template
    const newTemplate: TaskTemplateType = {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      urgency: task.urgency,
      size: task.size,
      category: task.category,
      period: task.period,
      tags: task.tags,
      mentalLoad: task.mentalLoad,
      energyRequired: task.energyRequired,
      subTasks: task.subTasks?.map(st => ({
        title: st.title,
        completed: false,
        id: st.id,
      })) || [],
    };
    
    // Save template
    TaskService.saveTemplate(newTemplate);
    
    // Update templates list
    setTemplates(TaskService.getTemplates());
    
    toast({
      title: 'Modèle enregistré',
      description: 'Le modèle de tâche a été créé avec succès'
    });
    
    setShowNewTemplateDialog(false);
  };
  
  const handleEditTemplate = (template: TaskTemplateType) => {
    // Update templates list
    setTemplates(TaskService.getTemplates());
    
    toast({
      title: 'Modèle mis à jour',
      description: 'Le modèle de tâche a été modifié avec succès'
    });
  };
  
  const handleDeleteTemplate = (id: string) => {
    TaskService.deleteTemplate(id);
    setTemplates(TaskService.getTemplates());
    
    toast({
      title: 'Modèle supprimé',
      description: 'Le modèle de tâche a été supprimé avec succès'
    });
  };
  
  const handleUseTemplate = (task: Task) => {
    if (onUseTemplate) {
      onUseTemplate(task);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Modèles de tâches</h2>
          <p className="text-muted-foreground">Créez et utilisez des modèles pour vos tâches récurrentes</p>
        </div>
        
        <Dialog open={showNewTemplateDialog} onOpenChange={setShowNewTemplateDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nouveau modèle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Créer un modèle de tâche</DialogTitle>
            </DialogHeader>
            <TaskForm 
              isTemplate={true} 
              onSuccess={handleSaveTemplate} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un modèle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {filteredTemplates.map(template => (
            <TaskTemplate
              key={template.id}
              template={template}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
              onUse={handleUseTemplate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-md">
          {templates.length === 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-1">Aucun modèle de tâche</h3>
              <p className="text-muted-foreground mb-4">
                Créez des modèles pour gagner du temps lors de la création de tâches similaires
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowNewTemplateDialog(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Créer votre premier modèle
              </Button>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium">Aucun résultat trouvé</h3>
              <p className="text-muted-foreground">
                Aucun modèle ne correspond à votre recherche
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskTemplateList;
