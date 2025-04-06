
import { Task } from '../../types/task';

// Calcule le meilleur ordre d'exécution des tâches en fonction de différents critères
export const optimizeTasks = (tasks: Task[]): Task[] => {
  // Filtrer les tâches non complétées
  const incompleteTasks = tasks.filter(task => !task.completed);
  
  // Si aucune tâche incomplète, retourner un tableau vide
  if (incompleteTasks.length === 0) {
    return [];
  }
  
  // Attribuer un score à chaque tâche en fonction de plusieurs facteurs
  const scoredTasks = incompleteTasks.map(task => {
    // Facteurs de score
    const urgencyScore = getUrgencyScore(task.urgency);
    const priorityScore = getPriorityScore(task.priority);
    const dueDateScore = getDueDateScore(task.dueDate);
    const sizeScore = getSizeScore(task.size);
    const energyScore = 10 - task.energyRequired; // Inverse pour favoriser les tâches moins énergivores en premier
    const mentalLoadScore = 10 - task.mentalLoad; // Inverse pour favoriser les tâches moins exigeantes mentalement
    
    // Score total (pondération des facteurs)
    const totalScore = 
      (urgencyScore * 3) + 
      (priorityScore * 2.5) + 
      (dueDateScore * 2) + 
      (sizeScore * 1.5) + 
      (energyScore * 1) + 
      (mentalLoadScore * 1);
    
    return {
      task,
      score: totalScore
    };
  });
  
  // Trier les tâches par score décroissant
  scoredTasks.sort((a, b) => b.score - a.score);
  
  // Retourner les tâches dans l'ordre optimal
  return scoredTasks.map(item => item.task);
};

// Calcule un score pour l'urgence (0-10)
const getUrgencyScore = (urgency: string): number => {
  switch (urgency) {
    case 'immediate': return 10;
    case 'soon': return 6;
    case 'later': return 2;
    default: return 5;
  }
};

// Calcule un score pour la priorité (0-10)
const getPriorityScore = (priority: string): number => {
  switch (priority) {
    case 'high': return 10;
    case 'medium': return 6;
    case 'low': return 2;
    default: return 5;
  }
};

// Calcule un score basé sur la date d'échéance (0-10)
const getDueDateScore = (dueDate: Date | null): number => {
  if (!dueDate) return 3; // Pas de date d'échéance = priorité moyenne-basse
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDateTime = new Date(dueDate).getTime();
  const todayTime = today.getTime();
  
  const daysDifference = Math.ceil((dueDateTime - todayTime) / (1000 * 60 * 60 * 24));
  
  if (daysDifference < 0) return 10; // En retard = priorité maximale
  if (daysDifference === 0) return 9; // Aujourd'hui
  if (daysDifference === 1) return 8; // Demain
  if (daysDifference <= 3) return 7; // Dans les 3 jours
  if (daysDifference <= 7) return 6; // Dans la semaine
  if (daysDifference <= 14) return 4; // Dans les 2 semaines
  if (daysDifference <= 30) return 3; // Dans le mois
  
  return 1; // Plus d'un mois
};

// Calcule un score basé sur la taille de la tâche (0-10)
const getSizeScore = (size: string): number => {
  switch (size) {
    case 'small': return 8; // Privilégier les petites tâches pour des victoires rapides
    case 'medium': return 6;
    case 'large': return 4; // Les grandes tâches ont un score plus bas car plus complexes
    default: return 5;
  }
};

// Suggère le meilleur moment de la journée pour effectuer une tâche
export const suggestBestTimeForTask = (task: Task): string => {
  const mentalLoad = task.mentalLoad || 5;
  const energyRequired = task.energyRequired || 5;
  
  // Logique pour déterminer le meilleur moment
  if (mentalLoad >= 8) {
    return "Matin (haute concentration)";
  } else if (energyRequired >= 8) {
    return "Début de journée (énergie élevée)";
  } else if (mentalLoad <= 3 && energyRequired >= 6) {
    return "Après-midi (énergie moyenne)";
  } else if (mentalLoad <= 3 && energyRequired <= 3) {
    return "Fin de journée (énergie basse)";
  } else {
    return "Flexible (tâche équilibrée)";
  }
};
