
// Update taskService to include new functionality for templates and other features

import { v4 as uuidv4 } from 'uuid';
import { 
  Task, 
  TaskFilter,
  TaskTemplate,
  TaskPriority,
  TaskUrgency
} from '@/types/task';

// Helper function to calculate days difference
const daysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const TaskService = {
  // Get all tasks with optional filtering
  getTasks: (filter?: TaskFilter): Task[] => {
    // Retrieve tasks from localStorage
    const tasksJson = localStorage.getItem('tasks');
    let tasks: Task[] = [];
    
    if (tasksJson) {
      try {
        tasks = JSON.parse(tasksJson);
      } catch (e) {
        console.error('Failed to parse tasks', e);
      }
    }
    
    // If no filter, return all tasks
    if (!filter) return tasks;
    
    // Apply filters
    return tasks.filter(task => {
      // Search filter
      if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filter.statuses && filter.statuses.length > 0) {
        if (!filter.statuses.includes(task.status)) {
          return false;
        }
      }
      
      // Priority filter
      if (filter.priorities && filter.priorities.length > 0) {
        if (!filter.priorities.includes(task.priority)) {
          return false;
        }
      }
      
      // Urgency filter
      if (filter.urgencies && filter.urgencies.length > 0) {
        if (!filter.urgencies.includes(task.urgency)) {
          return false;
        }
      }
      
      // Category filter
      if (filter.categories && filter.categories.length > 0) {
        if (!filter.categories.includes(task.category)) {
          return false;
        }
      }
      
      // Period filter
      if (filter.periods && filter.periods.length > 0) {
        if (!filter.periods.includes(task.period)) {
          return false;
        }
      }
      
      // Due date filters
      if (filter.dueBeforeDate && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        if (dueDate > filter.dueBeforeDate) {
          return false;
        }
      }
      
      if (filter.dueAfterDate && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        if (dueDate < filter.dueAfterDate) {
          return false;
        }
      }
      
      // Tags filter
      if (filter.tags && filter.tags.length > 0) {
        if (!task.tags || !filter.tags.some(tag => task.tags.includes(tag))) {
          return false;
        }
      }
      
      // Completed filter
      if (filter.completed !== undefined) {
        if (task.completed !== filter.completed) {
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => {
      // Apply sorting
      if (filter.sortBy) {
        const direction = filter.sortDirection === 'desc' ? -1 : 1;
        
        switch (filter.sortBy) {
          case 'dueDate':
            if (a.dueDate && b.dueDate) {
              return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * direction;
            } else if (a.dueDate) {
              return -1 * direction;
            } else if (b.dueDate) {
              return 1 * direction;
            }
            break;
            
          case 'priority':
            const priorityOrder: { [key in TaskPriority]: number } = {
              high: 3,
              medium: 2,
              low: 1
            };
            return (priorityOrder[b.priority] - priorityOrder[a.priority]) * direction;
            
          case 'urgency':
            const urgencyOrder: { [key in TaskUrgency]: number } = {
              immediate: 3,
              soon: 2,
              later: 1
            };
            return (urgencyOrder[b.urgency] - urgencyOrder[a.urgency]) * direction;
            
          case 'createdAt':
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return (dateA - dateB) * direction;
            
          case 'mentalLoad':
            return (b.mentalLoad - a.mentalLoad) * direction;
            
          case 'energyRequired':
            return (b.energyRequired - a.energyRequired) * direction;
        }
      }
      
      return 0;
    });
  },
  
  // Create a new task
  createTask: (taskData: Partial<Task>): Task => {
    const tasksJson = localStorage.getItem('tasks');
    const tasks: Task[] = tasksJson ? JSON.parse(tasksJson) : [];
    
    const newTask: Task = {
      id: uuidv4(),
      title: taskData.title || '',
      description: taskData.description || '',
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      urgency: taskData.urgency || 'soon',
      size: taskData.size || 'medium',
      category: taskData.category || 'personal',
      period: taskData.period || 'daily',
      dueDate: taskData.dueDate || null,
      createdAt: new Date(),
      completedAt: null,
      completed: false,
      tags: taskData.tags || [],
      subTasks: taskData.subTasks || [],
      mentalLoad: taskData.mentalLoad || 5,
      energyRequired: taskData.energyRequired || 5,
    };
    
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    return newTask;
  },
  
  // Get a single task by ID
  getTask: (id: string): Task | null => {
    const tasksJson = localStorage.getItem('tasks');
    if (!tasksJson) return null;
    
    const tasks: Task[] = JSON.parse(tasksJson);
    return tasks.find(task => task.id === id) || null;
  },
  
  // Update an existing task
  updateTask: (id: string, taskData: Partial<Task>): Task | null => {
    const tasksJson = localStorage.getItem('tasks');
    if (!tasksJson) return null;
    
    const tasks: Task[] = JSON.parse(tasksJson);
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) return null;
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...taskData
    };
    
    tasks[taskIndex] = updatedTask;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    return updatedTask;
  },
  
  // Delete a task
  deleteTask: (id: string): boolean => {
    const tasksJson = localStorage.getItem('tasks');
    if (!tasksJson) return false;
    
    const tasks: Task[] = JSON.parse(tasksJson);
    const updatedTasks = tasks.filter(task => task.id !== id);
    
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    return true;
  },
  
  // Mark a task as completed
  completeTask: (id: string): Task | null => {
    const tasksJson = localStorage.getItem('tasks');
    if (!tasksJson) return null;
    
    const tasks: Task[] = JSON.parse(tasksJson);
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) return null;
    
    const updatedTask = {
      ...tasks[taskIndex],
      completed: true,
      status: 'completed' as const,
      completedAt: new Date()
    };
    
    tasks[taskIndex] = updatedTask;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    return updatedTask;
  },
  
  // Calculate priority score for a task (for sorting)
  calculatePriorityScore: (task: Task): number => {
    let score = 0;
    
    // Priority factors
    if (task.priority === 'high') score += 50;
    else if (task.priority === 'medium') score += 30;
    else score += 10;
    
    // Urgency factors
    if (task.urgency === 'immediate') score += 50;
    else if (task.urgency === 'soon') score += 30;
    else score += 10;
    
    // Due date factor
    if (task.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        // Overdue tasks get highest priority
        score += 100;
      } else {
        // The closer to due date, the higher the score
        const daysLeft = daysDifference(today, dueDate);
        
        if (daysLeft === 0) score += 80; // Due today
        else if (daysLeft === 1) score += 70; // Due tomorrow
        else if (daysLeft <= 3) score += 60; // Due within 3 days
        else if (daysLeft <= 7) score += 40; // Due within a week
        else score += 20; // Due later
      }
    }
    
    // Mental load and energy required factors
    score += task.mentalLoad * 2;
    score += task.energyRequired * 2;
    
    return score;
  },
  
  // Get unique tags used in tasks
  getTags: (): string[] => {
    const tasksJson = localStorage.getItem('tasks');
    if (!tasksJson) return [];
    
    const tasks: Task[] = JSON.parse(tasksJson);
    const allTags = tasks.reduce((tags, task) => {
      if (task.tags) {
        return [...tags, ...task.tags];
      }
      return tags;
    }, [] as string[]);
    
    // Return unique tags
    return [...new Set(allTags)];
  },
  
  // Export tasks to JSON or CSV format
  exportTasks: (format: 'json' | 'csv', filter?: TaskFilter): string => {
    const tasks = TaskService.getTasks(filter);
    
    if (format === 'json') {
      return JSON.stringify(tasks, null, 2);
    } else {
      // CSV export
      const headers = ['id', 'title', 'description', 'status', 'priority', 'urgency', 
                      'size', 'category', 'period', 'dueDate', 'createdAt', 
                      'completedAt', 'completed', 'tags', 'mentalLoad', 'energyRequired'];
      
      const csvRows = [headers.join(',')];
      
      tasks.forEach(task => {
        const row = [
          task.id,
          `"${task.title.replace(/"/g, '""')}"`,
          `"${(task.description || '').replace(/"/g, '""')}"`,
          task.status,
          task.priority,
          task.urgency,
          task.size,
          task.category,
          task.period,
          task.dueDate ? new Date(task.dueDate).toISOString() : '',
          task.createdAt ? new Date(task.createdAt).toISOString() : '',
          task.completedAt ? new Date(task.completedAt).toISOString() : '',
          task.completed ? 'true' : 'false',
          `"${task.tags?.join(';') || ''}"`,
          task.mentalLoad,
          task.energyRequired
        ];
        
        csvRows.push(row.join(','));
      });
      
      return csvRows.join('\n');
    }
  },
  
  // Import tasks from JSON or CSV format
  importTasks: (data: string, format: 'json' | 'csv'): { success: boolean; message: string } => {
    try {
      let tasks: Task[] = [];
      
      if (format === 'json') {
        tasks = JSON.parse(data);
        
        // Validate tasks schema
        if (!Array.isArray(tasks)) {
          return { 
            success: false, 
            message: 'Format JSON invalide. Les données doivent être un tableau de tâches.' 
          };
        }
        
        // Basic validation
        for (const task of tasks) {
          if (!task.id || !task.title) {
            return { 
              success: false, 
              message: 'Format JSON invalide. Chaque tâche doit avoir un ID et un titre.' 
            };
          }
        }
      } else {
        // Parse CSV
        const lines = data.split('\n');
        const headers = lines[0].split(',');
        
        tasks = lines.slice(1).map(line => {
          const values = line.split(',');
          const task: any = {};
          
          headers.forEach((header, i) => {
            if (header === 'dueDate' || header === 'createdAt' || header === 'completedAt') {
              task[header] = values[i] ? new Date(values[i]) : null;
            } else if (header === 'completed') {
              task[header] = values[i] === 'true';
            } else if (header === 'tags') {
              task[header] = values[i] ? values[i].replace(/"/g, '').split(';') : [];
            } else if (header === 'mentalLoad' || header === 'energyRequired') {
              task[header] = parseInt(values[i]) || 5;
            } else {
              task[header] = values[i]?.replace(/^"(.*)"$/, '$1');
            }
          });
          
          return task as Task;
        });
      }
      
      // Save imported tasks
      localStorage.setItem('tasks', JSON.stringify(tasks));
      
      return { 
        success: true, 
        message: `${tasks.length} tâches importées avec succès` 
      };
    } catch (error) {
      console.error('Import error', error);
      return { 
        success: false, 
        message: `Erreur d'importation: ${error instanceof Error ? error.message : 'Format invalide'}` 
      };
    }
  },
  
  // Template functions
  getTemplates: (): TaskTemplate[] => {
    const templatesJson = localStorage.getItem('task-templates');
    if (!templatesJson) return [];
    
    try {
      return JSON.parse(templatesJson);
    } catch (e) {
      console.error('Failed to parse task templates', e);
      return [];
    }
  },
  
  saveTemplate: (template: TaskTemplate): TaskTemplate => {
    const templatesJson = localStorage.getItem('task-templates');
    const templates: TaskTemplate[] = templatesJson ? JSON.parse(templatesJson) : [];
    
    // Check if template already exists
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex !== -1) {
      // Update existing template
      templates[existingIndex] = template;
    } else {
      // Add new template
      templates.push({
        ...template,
        id: template.id || uuidv4()
      });
    }
    
    localStorage.setItem('task-templates', JSON.stringify(templates));
    return template;
  },
  
  deleteTemplate: (id: string): boolean => {
    const templatesJson = localStorage.getItem('task-templates');
    if (!templatesJson) return false;
    
    const templates: TaskTemplate[] = JSON.parse(templatesJson);
    const updatedTemplates = templates.filter(template => template.id !== id);
    
    localStorage.setItem('task-templates', JSON.stringify(updatedTemplates));
    return true;
  },
  
  createTaskFromTemplate: (template: TaskTemplate): Task => {
    // Create a task based on template properties
    return TaskService.createTask({
      title: template.title,
      description: template.description,
      priority: template.priority,
      urgency: template.urgency,
      size: template.size,
      category: template.category,
      period: template.period,
      tags: template.tags,
      subTasks: template.subTasks,
      mentalLoad: template.mentalLoad,
      energyRequired: template.energyRequired
    });
  }
};

export default TaskService;
