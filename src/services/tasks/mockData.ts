
import { Task } from '../../types/task';
import { v4 as uuidv4 } from 'uuid';

// Mock data for initial tasks
export const mockTasks: Task[] = [
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
