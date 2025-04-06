
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import TaskService from '@/services/taskService';
import { AlertTriangle, Download, Trash, Upload } from 'lucide-react';
import TaskImportExport from '@/components/TaskImportExport';

const Settings = () => {
  const { toast } = useToast();
  const [taskStats, setTaskStats] = useState<any>(null);
  const [showImportExport, setShowImportExport] = useState(false);
  
  useEffect(() => {
    const stats = TaskService.getTaskStats();
    setTaskStats(stats);
  }, []);
  
  const clearAllTasks = () => {
    localStorage.removeItem('tasks');
    localStorage.setItem('tasks', '[]');
    toast({
      title: 'Toutes les tâches ont été supprimées',
      description: 'Votre liste de tâches est maintenant vide'
    });
    
    // Réinitialiser les statistiques
    const stats = TaskService.getTaskStats();
    setTaskStats(stats);
  };
  
  if (!taskStats) {
    return <div className="text-center py-8">Chargement...</div>;
  }
  
  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      
      <Tabs defaultValue="data" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="data">Données</TabsTrigger>
          <TabsTrigger value="about">À propos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="data">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Données</CardTitle>
                <CardDescription>
                  Importer, exporter ou supprimer des données
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Résumé des Données</h3>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>Tâches totales: <Badge variant="outline">{taskStats.totalTasks}</Badge></li>
                      <li>Tâches complétées: <Badge variant="outline">{taskStats.completedTasks}</Badge></li>
                      <li>Tâches en attente: <Badge variant="outline">{taskStats.pendingTasks}</Badge></li>
                      <li>Catégories: <Badge variant="outline">{Object.keys(taskStats.categoryCounts).length}</Badge></li>
                      <li>Tags utilisés: <Badge variant="outline">{TaskService.getTags().length}</Badge></li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Opérations</h3>
                    <div className="mt-2 space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setShowImportExport(true)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Importer / Exporter
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            className="w-full"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Supprimer toutes les tâches
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action supprimera définitivement toutes vos tâches et ne peut pas être annulée. 
                              Nous vous recommandons d'exporter vos données avant de procéder.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={clearAllTasks}>Supprimer</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800">Stockage local uniquement</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        Toutes vos tâches sont stockées localement dans le navigateur.
                        Si vous effacez les données de navigation, vos tâches seront perdues.
                        Pensez à exporter régulièrement vos données.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>À propos de TaskFlow</CardTitle>
              <CardDescription>
                Application de gestion de tâches et de listes de contrôle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Fonctionnalités</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Gestion de tâches quotidiennes, hebdomadaires, mensuelles et annuelles</li>
                  <li>Classification par catégories, priorités, urgence et taille</li>
                  <li>Système de sous-tâches pour décomposer les tâches complexes</li>
                  <li>Tableau de bord avec statistiques et visualisations</li>
                  <li>Filtrage avancé et recherche</li>
                  <li>Import/export de données aux formats JSON et CSV</li>
                  <li>Interface responsive pour mobile, tablette et ordinateur</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Accessibilité</h3>
                <p className="text-sm text-muted-foreground">
                  TaskFlow est conçu pour être accessible à tous les utilisateurs, avec une 
                  navigation au clavier fluide, des contrastes adaptés, et une compatibilité 
                  avec les lecteurs d'écran.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium">Crédits</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  TaskFlow utilise React, Tailwind CSS, Shadcn/UI, et d'autres bibliothèques open source.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  © 2025 TaskFlow. Tous droits réservés.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Version 1.0.0
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <TaskImportExport 
        open={showImportExport} 
        onOpenChange={setShowImportExport} 
        onComplete={() => {
          const stats = TaskService.getTaskStats();
          setTaskStats(stats);
        }}
      />
    </div>
  );
};

export default Settings;
