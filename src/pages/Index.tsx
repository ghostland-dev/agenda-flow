
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import TaskList from '@/components/TaskList';
import TaskDetail from '@/pages/index/TaskDetail';
import TaskEdit from '@/pages/index/TaskEdit';
import Stats from '@/pages/index/Stats';
import Settings from '@/pages/index/Settings';
import NotFound from '@/pages/NotFound';

const Index = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route 
          path="/tasks/urgent" 
          element={
            <TaskList 
              initialFilter={{ urgencies: ['immediate'] }} 
              title="Tâches Urgentes" 
              description="Tâches nécessitant une attention immédiate"
            />
          } 
        />
        <Route 
          path="/tasks/important" 
          element={
            <TaskList 
              initialFilter={{ priorities: ['high'] }} 
              title="Tâches Importantes" 
              description="Tâches avec une priorité élevée"
            />
          } 
        />
        <Route 
          path="/tasks/today" 
          element={
            <TaskList 
              initialFilter={{ 
                dueAfterDate: new Date(new Date().setHours(0, 0, 0, 0)),
                dueBeforeDate: new Date(new Date().setHours(23, 59, 59, 999))
              }} 
              title="Tâches d'Aujourd'hui" 
              description="Tâches prévues pour aujourd'hui"
            />
          } 
        />
        <Route 
          path="/tasks/week" 
          element={
            <TaskList 
              initialFilter={{ 
                periods: ['weekly'] 
              }} 
              title="Tâches Hebdomadaires" 
              description="Tâches prévues pour cette semaine"
            />
          } 
        />
        <Route 
          path="/categories" 
          element={
            <TaskList 
              title="Catégories" 
              description="Tâches organisées par catégorie"
            />
          } 
        />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/tasks/:id/edit" element={<TaskEdit />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/filters" element={<TaskList title="Filtres Avancés" description="Filtrez vos tâches selon différents critères" />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default Index;
