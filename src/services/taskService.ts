import { Task, TaskFilter, TaskPriority, TaskUrgency, TaskSize, TaskCategory, TaskPeriod, TaskStatus, SubTask } from '../types/task';
import { v4 as uuidv4 } from 'uuid';

// Mock data pour commencer
const mockTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Compléter le rapport trimestriel',
    description: 'Finaliser le rapport financier du Q1 2025',
    priority: 'high',
    urgency: 'immediate',
    size: 'large',
    category: 'work',
    period: 'monthly',
    status: 'pending',
    dueDate: new Date(2025, 3, 15),
    subTasks: [
      { id: uuidv4(), title: 'Rassembler les données', completed: true, createdAt: new Date() },
      { id: uuidv4(), title: 'Créer des graphiques', completed: false, createdAt: new Date() },
      { id: uuidv4(), title: 'Rédiger les conclusions', completed: false, createdAt: new Date() }
    ],
    tags: ['finance', 'deadline', 'rapport'],
    completed: false,
    completedAt: null,
    createdAt: new Date(2025, 2, 1),
    updatedAt: new Date(2025, 2, 1),
    mentalLoad: 8,
    energyRequired: 7
  },
  {
    id: uuidv4(),
    title: 'Séance d\'entraînement',
    description: 'Courir 5km au parc',
    priority: 'medium',
    urgency: 'soon',
    size: 'medium',
    category: 'health',
    period: 'daily',
    status: 'pending',
    dueDate: new Date(2025, 3, 7),
    subTasks: [],
    tags: ['sport', 'santé'],
    completed: false,
    completedAt: null,
    createdAt: new Date(2025, 3, 6),
    updatedAt: new Date(2025, 3, 6),
    mentalLoad: 3,
    energyRequired: 8
  },
  {
    id: uuidv4(),
    title: 'Payer les factures',
    description: 'Régler les factures d\'électricité et d\'eau',
    priority: 'high',
    urgency: 'immediate',
    size: 'small',
    category: 'finance',
    period: 'monthly',
    status: 'completed',
    dueDate: new Date(2025, 3, 10),
    subTasks: [],
    tags: ['factures', 'mensuel'],
    completed: true,
    completedAt: new Date(2025, 3, 9),
    createdAt: new Date(2025, 3, 5),
    updatedAt: new Date(2025, 3, 9),
    mentalLoad: 5,
    energyRequired: 2
  },
  {
    id: uuidv4(),
    title: 'Apprendre React Hooks avancés',
    description: 'Étudier les hooks personnalisés et useContext',
    priority: 'low',
    urgency: 'later',
    size: 'medium',
    category: 'learning',
    period: 'weekly',
    status: 'in-progress',
    dueDate: new Date(2025, 4, 1),
    subTasks: [
      { id: uuidv4(), title: 'useReducer', completed: true, createdAt: new Date() },
      { id: uuidv4(), title: 'useContext', completed: false, createdAt: new Date() },
      { id: uuidv4(), title: 'Hooks personnalisés', completed: false, createdAt: new Date() }
    ],
    tags: ['développement', 'react', 'apprentissage'],
    completed: false,
    completedAt: null,
    createdAt: new Date(2025, 3, 1),
    updatedAt: new Date(2025, 3, 1),
    mentalLoad: 6,
    energyRequired: 4
  },
  {
    id: uuidv4(),
    title: 'Organiser l\'anniversaire surprise',
    description: 'Planifier la fête d\'anniversaire surprise pour Marie',
    priority: 'medium',
    urgency: 'soon',
    size: 'large',
    category: 'personal',
    period: 'yearly',
    status: 'in-progress',
    dueDate: new Date(2025, 5, 15),
    subTasks: [
      { id: uuidv4(), title: 'Réserver le restaurant', completed: true, createdAt: new Date() },
      { id: uuidv4(), title: 'Inviter les amis', completed: true, createdAt: new Date() },
      { id: uuidv4(), title: 'Commander le gâteau', completed: false, createdAt: new Date() },
      { id: uuidv4(), title: 'Acheter les décorations', completed: false, createdAt: new Date() }
    ],
    tags: ['anniversaire', 'surprise', 'événement'],
    completed: false,
    completedAt: null,
    createdAt: new Date(2025, 4, 1),
    updatedAt: new Date(2025, 4, 1),
    mentalLoad: 5,
    energyRequired: 6
  }
];

// Initialisation du stockage local
const initializeLocalStorage = () => {
  const storedTasks = localStorage.getItem('tasks');
  if (!storedTasks) {
    localStorage.setItem('tasks', JSON.stringify(mockTasks));
    return mockTasks;
  }
  return JSON.parse(storedTasks);
};

// Service pour les tâches
export const TaskService = {
  getTasks: (filter?: TaskFilter): Task[] => {
    let tasks: Task[] = initializeLocalStorage();
    
    if (filter) {
      // Filtrage
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        tasks = tasks.filter(task => 
          task.title.toLowerCase().includes(searchLower) || 
          task.description.toLowerCase().includes(searchLower) ||
          task.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      if (filter.categories?.length) {
        tasks = tasks.filter(task => filter.categories?.includes(task.category));
      }
      
      if (filter.priorities?.length) {
        tasks = tasks.filter(task => filter.priorities?.includes(task.priority));
      }
      
      if (filter.urgencies?.length) {
        tasks = tasks.filter(task => filter.urgencies?.includes(task.urgency));
      }
      
      if (filter.sizes?.length) {
        tasks = tasks.filter(task => filter.sizes?.includes(task.size));
      }
      
      if (filter.periods?.length) {
        tasks = tasks.filter(task => filter.periods?.includes(task.period));
      }
      
      if (filter.statuses?.length) {
        tasks = tasks.filter(task => filter.statuses?.includes(task.status));
      }
      
      if (filter.tags?.length) {
        tasks = tasks.filter(task => 
          task.tags.some(tag => filter.tags?.includes(tag))
        );
      }
      
      if (filter.dueBeforeDate) {
        tasks = tasks.filter(task => 
          task.dueDate && new Date(task.dueDate) <= new Date(filter.dueBeforeDate!)
        );
      }
      
      if (filter.dueAfterDate) {
        tasks = tasks.filter(task => 
          task.dueDate && new Date(task.dueDate) >= new Date(filter.dueAfterDate!)
        );
      }
      
      // Tri
      if (filter.sortBy) {
        tasks.sort((a, b) => {
          let comparison = 0;
          
          switch (filter.sortBy) {
            case 'dueDate':
              if (a.dueDate && b.dueDate) {
                comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
              } else if (a.dueDate) {
                comparison = -1;
              } else if (b.dueDate) {
                comparison = 1;
              }
              break;
            case 'priority':
              const priorityValues = { high: 3, medium: 2, low: 1 };
              comparison = priorityValues[a.priority] - priorityValues[b.priority];
              break;
            case 'urgency':
              const urgencyValues = { immediate: 3, soon: 2, later: 1 };
              comparison = urgencyValues[a.urgency] - urgencyValues[b.urgency];
              break;
            case 'createdAt':
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              break;
            case 'mentalLoad':
              comparison = a.mentalLoad - b.mentalLoad;
              break;
            case 'energyRequired':
              comparison = a.energyRequired - b.energyRequired;
              break;
            default:
              break;
          }
          
          return filter.sortDirection === 'desc' ? -comparison : comparison;
        });
      }
    }
    
    return tasks;
  },
  
  getTaskById: (id: string): Task | undefined => {
    const tasks = initializeLocalStorage();
    return tasks.find(task => task.id === id);
  },
  
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
    const tasks = initializeLocalStorage();
    
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedTasks = [...tasks, newTask];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    return newTask;
  },
  
  updateTask: (id: string, updates: Partial<Task>): Task | undefined => {
    const tasks = initializeLocalStorage();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) return undefined;
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    tasks[taskIndex] = updatedTask;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    return updatedTask;
  },
  
  deleteTask: (id: string): boolean => {
    const tasks = initializeLocalStorage();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === tasks.length) return false;
    
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    return true;
  },
  
  addSubTask: (taskId: string, subTaskTitle: string): SubTask | undefined => {
    const tasks = initializeLocalStorage();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return undefined;
    
    const newSubTask: SubTask = {
      id: uuidv4(),
      title: subTaskTitle,
      completed: false,
      createdAt: new Date()
    };
    
    tasks[taskIndex].subTasks.push(newSubTask);
    tasks[taskIndex].updatedAt = new Date();
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return newSubTask;
  },
  
  updateSubTask: (taskId: string, subTaskId: string, completed: boolean): boolean => {
    const tasks = initializeLocalStorage();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return false;
    
    const subTaskIndex = tasks[taskIndex].subTasks.findIndex(st => st.id === subTaskId);
    
    if (subTaskIndex === -1) return false;
    
    tasks[taskIndex].subTasks[subTaskIndex].completed = completed;
    tasks[taskIndex].updatedAt = new Date();
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return true;
  },
  
  deleteSubTask: (taskId: string, subTaskId: string): boolean => {
    const tasks = initializeLocalStorage();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return false;
    
    const initialSubTasksLength = tasks[taskIndex].subTasks.length;
    tasks[taskIndex].subTasks = tasks[taskIndex].subTasks.filter(st => st.id !== subTaskId);
    
    if (tasks[taskIndex].subTasks.length === initialSubTasksLength) return false;
    
    tasks[taskIndex].updatedAt = new Date();
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return true;
  },
  
  getTags: (): string[] => {
    const tasks = initializeLocalStorage();
    const allTags = tasks.flatMap(task => task.tags);
    return [...new Set(allTags)].filter((tag): tag is string => typeof tag === 'string');
  },
  
  getTaskStats: () => {
    const tasks = initializeLocalStorage();
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = tasks.filter(task => !task.completed).length;
    
    const categoryCounts = tasks.reduce((acc: Record<string, number>, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {});
    
    const priorityCounts = tasks.reduce((acc: Record<string, number>, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});
    
    const urgencyCounts = tasks.reduce((acc: Record<string, number>, task) => {
      acc[task.urgency] = (acc[task.urgency] || 0) + 1;
      return acc;
    }, {});
    
    const periodCounts = tasks.reduce((acc: Record<string, number>, task) => {
      acc[task.period] = (acc[task.period] || 0) + 1;
      return acc;
    }, {});
    
    const overdueTasks = tasks.filter(task => 
      !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
    ).length;
    
    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
      categoryCounts,
      priorityCounts,
      urgencyCounts,
      periodCounts,
      overdueTasks
    };
  },
  
  exportTasks: (format: 'json' | 'csv', filter?: TaskFilter): string => {
    const tasks = filter ? TaskService.getTasks(filter) : initializeLocalStorage();
    
    if (format === 'json') {
      return JSON.stringify(tasks, null, 2);
    } else if (format === 'csv') {
      const headers = 'ID,Title,Description,Priority,Urgency,Size,Category,Period,Status,Due Date,Completed,Created At,Updated At,Mental Load,Energy Required,Tags\n';
      
      const rows = tasks.map(task => {
        return [
          task.id,
          `"${task.title.replace(/"/g, '""')}"`,
          `"${task.description.replace(/"/g, '""')}"`,
          task.priority,
          task.urgency,
          task.size,
          task.category,
          task.period,
          task.status,
          task.dueDate ? new Date(task.dueDate).toISOString() : '',
          task.completed ? 'Yes' : 'No',
          new Date(task.createdAt).toISOString(),
          new Date(task.updatedAt).toISOString(),
          task.mentalLoad,
          task.energyRequired,
          `"${task.tags.join(', ')}"`
        ].join(',');
      });
      
      return headers + rows.join('\n');
    }
    
    return '';
  },
  
  importTasks: (data: string, format: 'json' | 'csv'): { success: boolean; message: string } => {
    try {
      let tasks: Task[] = [];
      
      if (format === 'json') {
        tasks = JSON.parse(data);
        
        // Validation basique
        if (!Array.isArray(tasks)) {
          return { success: false, message: 'Le format JSON n\'est pas valide. Il devrait contenir un tableau de tâches.' };
        }
        
        // Vérifier que chaque tâche a les propriétés minimales requises
        const isValid = tasks.every(task => 
          typeof task.id === 'string' && 
          typeof task.title === 'string' && 
          typeof task.completed !== 'undefined'
        );
        
        if (!isValid) {
          return { success: false, message: 'Certaines tâches n\'ont pas le format correct.' };
        }
      } else if (format === 'csv') {
        const lines = data.split('\n');
        const headers = lines[0].split(',');
        
        // Vérifier les en-têtes minimaux
        const requiredHeaders = ['ID', 'Title', 'Priority', 'Category'];
        const hasRequiredHeaders = requiredHeaders.every(h => headers.includes(h));
        
        if (!hasRequiredHeaders) {
          return { success: false, message: 'Le fichier CSV doit avoir au moins les en-têtes : ID, Title, Priority, Category.' };
        }
        
        // Analyser les lignes
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',');
          if (values.length !== headers.length) {
            return { success: false, message: `La ligne ${i + 1} n'a pas le bon nombre de colonnes.` };
          }
          
          // Créer un objet tâche
          const task: any = {};
          headers.forEach((header, index) => {
            task[header.toLowerCase()] = values[index];
          });
          
          // Convertir en type Task
          tasks.push({
            id: task.id,
            title: task.title.replace(/^"|"$/g, '').replace(/""/g, '"'),
            description: task.description ? task.description.replace(/^"|"$/g, '').replace(/""/g, '"') : '',
            priority: task.priority as TaskPriority,
            urgency: task.urgency as TaskUrgency,
            size: task.size as TaskSize,
            category: task.category as TaskCategory,
            period: task.period as TaskPeriod,
            status: task.status as TaskStatus,
            dueDate: task['due date'] ? new Date(task['due date']) : null,
            subTasks: [],
            tags: task.tags ? task.tags.replace(/^"|"$/g, '').split(', ') : [],
            completed: task.completed === 'Yes',
            completedAt: null,
            createdAt: task['created at'] ? new Date(task['created at']) : new Date(),
            updatedAt: task['updated at'] ? new Date(task['updated at']) : new Date(),
            mentalLoad: parseInt(task['mental load'] || '5'),
            energyRequired: parseInt(task['energy required'] || '5')
          });
        }
      }
      
      // Fusionner avec les tâches existantes
      const existingTasks = TaskService.getTasks();
      const existingIds = new Set(existingTasks.map(t => t.id));
      
      const newTasks = tasks.filter(t => !existingIds.has(t.id));
      const updatedTasks = [...existingTasks, ...newTasks];
      
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      return { 
        success: true, 
        message: `Importation réussie. ${newTasks.length} nouvelles tâches ajoutées.` 
      };
    } catch (error) {
      console.error('Erreur lors de l\'importation :', error);
      return { 
        success: false, 
        message: `Erreur lors de l'importation : ${error instanceof Error ? error.message : 'Format invalide'}` 
      };
    }
  },
  
  calculatePriorityScore: (task: Task): number => {
    const priorityValues = { high: 10, medium: 5, low: 1 };
    const urgencyValues = { immediate: 10, soon: 5, later: 1 };
    const sizeValues = { large: 3, medium: 2, small: 1 };
    
    // Le score est une combinaison pondérée des différents facteurs
    let score = 0;
    
    // Priorité (40%)
    score += priorityValues[task.priority] * 0.4;
    
    // Urgence (30%)
    score += urgencyValues[task.urgency] * 0.3;
    
    // Date d'échéance (15%)
    if (task.dueDate) {
      const daysUntilDue = Math.max(0, Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
      
      if (daysUntilDue <= 1) {
        score += 10 * 0.15; // Très urgent
      } else if (daysUntilDue <= 3) {
        score += 8 * 0.15; // Urgent
      } else if (daysUntilDue <= 7) {
        score += 5 * 0.15; // Moyennement urgent
      } else {
        score += 1 * 0.15; // Peu urgent
      }
    }
    
    // Charge mentale (10%)
    score += (task.mentalLoad / 10) * 10 * 0.1;
    
    // Énergie requise (5%)
    score += (task.energyRequired / 10) * 10 * 0.05;
    
    return Math.round(score * 10) / 10; // Arrondir à une décimale
  }
};

export default TaskService;
