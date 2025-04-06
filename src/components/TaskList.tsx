
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TaskCard } from './TaskCard';
import TaskService from '@/services/taskService';
import { Task, TaskFilter } from '@/types/task';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, SlidersHorizontal, ArrowUpDown, RefreshCw, FilePlus, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TaskImportExport from './TaskImportExport';
import { Card } from './ui/card';

interface TaskListProps {
  initialFilter?: TaskFilter;
  title?: string;
  description?: string;
  focusMode?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ 
  initialFilter = {},
  title = "Toutes les tâches",
  description = "Gérez et organisez vos tâches",
  focusMode = false
}) => {
  const { toast } = useToast();
  const location = useLocation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>(initialFilter);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showFilterUI, setShowFilterUI] = useState(!focusMode);
  
  const loadTasks = () => {
    setIsLoading(true);
    
    // Apply focus mode-specific filters
    let finalFilter = { ...filter };
    
    if (focusMode) {
      // In focus mode, only show today's tasks by default
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Only override dates if not already set by initialFilter
      if (!filter.dueAfterDate && !filter.dueBeforeDate) {
        finalFilter = {
          ...finalFilter,
          dueAfterDate: today,
          dueBeforeDate: tomorrow,
        };
      }
      
      // In focus mode, sort by priority by default
      if (!filter.sortBy) {
        finalFilter = {
          ...finalFilter,
          sortBy: 'priority',
          sortDirection: 'desc',
        };
      }
    }
    
    const loadedTasks = TaskService.getTasks(finalFilter);
    
    // Filtrer les tâches complétées si nécessaire
    const filteredTasks = showCompleted 
      ? loadedTasks 
      : loadedTasks.filter(t => !t.completed);
    
    setTasks(filteredTasks);
    setIsLoading(false);
  };
  
  useEffect(() => {
    loadTasks();
  }, [filter, showCompleted, location.pathname, focusMode]);
  
  // Update filter UI visibility when focus mode changes
  useEffect(() => {
    setShowFilterUI(!focusMode);
  }, [focusMode]);
  
  const handleSearch = (searchTerm: string) => {
    setFilter(prev => ({ ...prev, search: searchTerm }));
  };
  
  const handleSortChange = (value: string) => {
    switch (value) {
      case 'dueDate_asc':
        setFilter(prev => ({ ...prev, sortBy: 'dueDate', sortDirection: 'asc' }));
        break;
      case 'dueDate_desc':
        setFilter(prev => ({ ...prev, sortBy: 'dueDate', sortDirection: 'desc' }));
        break;
      case 'priority_desc':
        setFilter(prev => ({ ...prev, sortBy: 'priority', sortDirection: 'desc' }));
        break;
      case 'priority_asc':
        setFilter(prev => ({ ...prev, sortBy: 'priority', sortDirection: 'asc' }));
        break;
      case 'urgency_desc':
        setFilter(prev => ({ ...prev, sortBy: 'urgency', sortDirection: 'desc' }));
        break;
      case 'createdAt_desc':
        setFilter(prev => ({ ...prev, sortBy: 'createdAt', sortDirection: 'desc' }));
        break;
      case 'createdAt_asc':
        setFilter(prev => ({ ...prev, sortBy: 'createdAt', sortDirection: 'asc' }));
        break;
      case 'mentalLoad_desc':
        setFilter(prev => ({ ...prev, sortBy: 'mentalLoad', sortDirection: 'desc' }));
        break;
      case 'energyRequired_desc':
        setFilter(prev => ({ ...prev, sortBy: 'energyRequired', sortDirection: 'desc' }));
        break;
      default:
        break;
    }
  };
  
  const toggleCategoryFilter = (category: string) => {
    setFilter(prev => {
      const categories = prev.categories || [];
      
      if (categories.includes(category as any)) {
        return {
          ...prev,
          categories: categories.filter(c => c !== category)
        };
      } else {
        return {
          ...prev,
          categories: [...categories, category as any]
        };
      }
    });
  };
  
  const togglePriorityFilter = (priority: string) => {
    setFilter(prev => {
      const priorities = prev.priorities || [];
      
      if (priorities.includes(priority as any)) {
        return {
          ...prev,
          priorities: priorities.filter(p => p !== priority)
        };
      } else {
        return {
          ...prev,
          priorities: [...priorities, priority as any]
        };
      }
    });
  };
  
  const resetFilters = () => {
    setFilter(initialFilter);
    setShowCompleted(true);
    toast({
      title: 'Filtres réinitialisés',
      description: 'Tous les filtres ont été réinitialisés'
    });
  };
  
  const toggleFilterUI = () => {
    setShowFilterUI(!showFilterUI);
  };
  
  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        
        <div className="flex gap-2 mt-4 sm:mt-0">
          {!focusMode && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowImportExport(true)}
            >
              <FilePlus className="h-4 w-4 mr-2" />
              Importer/Exporter
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleFilterUI}
          >
            {showFilterUI ? 
              <><EyeOff className="h-4 w-4 mr-2" />Masquer les filtres</> : 
              <><Eye className="h-4 w-4 mr-2" />Afficher les filtres</>
            }
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetFilters}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>
      
      {showFilterUI && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Rechercher..."
                value={filter.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-2">
              <Select
                value={
                  filter.sortBy && filter.sortDirection
                    ? `${filter.sortBy}_${filter.sortDirection}`
                    : 'priority_desc'
                }
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-44">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <SelectValue placeholder="Trier par" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate_asc">Date (croissant)</SelectItem>
                  <SelectItem value="dueDate_desc">Date (décroissant)</SelectItem>
                  <SelectItem value="priority_desc">Priorité (élevée à basse)</SelectItem>
                  <SelectItem value="priority_asc">Priorité (basse à élevée)</SelectItem>
                  <SelectItem value="urgency_desc">Urgence (décroissant)</SelectItem>
                  <SelectItem value="createdAt_desc">Récemment créées</SelectItem>
                  <SelectItem value="createdAt_asc">Anciennement créées</SelectItem>
                  <SelectItem value="mentalLoad_desc">Charge mentale</SelectItem>
                  <SelectItem value="energyRequired_desc">Énergie requise</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filtrer par catégorie</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={(filter.categories || []).includes('work')}
                    onCheckedChange={() => toggleCategoryFilter('work')}
                  >
                    Travail
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={(filter.categories || []).includes('personal')}
                    onCheckedChange={() => toggleCategoryFilter('personal')}
                  >
                    Personnel
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={(filter.categories || []).includes('health')}
                    onCheckedChange={() => toggleCategoryFilter('health')}
                  >
                    Santé
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={(filter.categories || []).includes('finance')}
                    onCheckedChange={() => toggleCategoryFilter('finance')}
                  >
                    Finance
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={(filter.categories || []).includes('learning')}
                    onCheckedChange={() => toggleCategoryFilter('learning')}
                  >
                    Apprentissage
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={(filter.categories || []).includes('other')}
                    onCheckedChange={() => toggleCategoryFilter('other')}
                  >
                    Autre
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Autres filtres</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuLabel className="pt-2">Priorité</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={(filter.priorities || []).includes('high')}
                    onCheckedChange={() => togglePriorityFilter('high')}
                  >
                    Haute
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={(filter.priorities || []).includes('medium')}
                    onCheckedChange={() => togglePriorityFilter('medium')}
                  >
                    Moyenne
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={(filter.priorities || []).includes('low')}
                    onCheckedChange={() => togglePriorityFilter('low')}
                  >
                    Basse
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuCheckboxItem
                    checked={showCompleted}
                    onCheckedChange={setShowCompleted}
                  >
                    Afficher les tâches terminées
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {filter.search || filter.categories?.length || filter.priorities?.length ? (
            <div className="mb-4 text-sm">
              <span className="font-medium">Filtres actifs : </span>
              {filter.search && (
                <span className="mr-2">
                  Recherche: "{filter.search}"
                </span>
              )}
              {filter.categories?.map(category => (
                <span key={category} className="mr-2 inline-flex bg-accent text-accent-foreground rounded-full px-2 py-0.5 text-xs">
                  {category === 'work' ? 'Travail' : 
                   category === 'personal' ? 'Personnel' : 
                   category === 'health' ? 'Santé' : 
                   category === 'finance' ? 'Finance' : 
                   category === 'learning' ? 'Apprentissage' : 'Autre'}
                </span>
              ))}
              {filter.priorities?.map(priority => (
                <span key={priority} className="mr-2 inline-flex bg-accent text-accent-foreground rounded-full px-2 py-0.5 text-xs">
                  {priority === 'high' ? 'Priorité haute' : 
                   priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                </span>
              ))}
            </div>
          ) : null}
          
          <Separator className="my-4" />
        </>
      )}
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des tâches...</p>
        </div>
      ) : tasks.length > 0 ? (
        <div className={focusMode ? "space-y-4 max-w-xl mx-auto" : "space-y-4"}>
          {focusMode && (
            <Card className="p-4 mb-4 bg-muted/30">
              <p className="text-sm text-center text-muted-foreground">
                Mode Focus activé : Affichage des tâches essentielles pour aujourd'hui
              </p>
            </Card>
          )}
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onStatusChange={loadTasks} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucune tâche trouvée</p>
          <p className="text-sm text-muted-foreground mt-1">
            Ajoutez une nouvelle tâche ou modifiez vos filtres
          </p>
        </div>
      )}
      
      <TaskImportExport 
        open={showImportExport} 
        onOpenChange={setShowImportExport} 
        onComplete={loadTasks}
        filter={filter}
      />
    </div>
  );
};

export default TaskList;
