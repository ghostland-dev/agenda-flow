
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import TaskService from '@/services/taskService';
import { AlertTriangle, Download, Trash, Upload, User, CreditCard, ShieldCheck, Cloud, BellRing, Settings as SettingsIcon } from 'lucide-react';
import TaskImportExport from '@/components/TaskImportExport';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Mock subscription plans for demonstration
const subscriptionPlans = [
  { name: 'Free', price: '0€/mois', features: ['5 catégories', 'Jusqu\'à 50 tâches', 'Exportation basique'], current: true },
  { name: 'Premium', price: '4.99€/mois', features: ['Catégories illimitées', 'Tâches illimitées', 'Exportation avancée', 'Synchronisation multi-appareils', 'Pas de publicités'], current: false },
  { name: 'Business', price: '9.99€/mois', features: ['Toutes les fonctionnalités Premium', 'Collaboration en équipe', 'Rapports avancés', 'API', 'Support prioritaire'], current: false },
];

const Settings = () => {
  const { toast } = useToast();
  const [taskStats, setTaskStats] = useState<any>(null);
  const [showImportExport, setShowImportExport] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(false);
  
  // Mock user profile data
  const [userProfile, setUserProfile] = useState({
    name: 'Utilisateur',
    email: 'utilisateur@exemple.com',
    createdAt: '2025-01-15',
  });
  
  useEffect(() => {
    const stats = TaskService.getTaskStats();
    setTaskStats(stats);
    
    // Load user preferences from localStorage
    const savedNotifications = localStorage.getItem('notificationsEnabled');
    const savedDarkMode = localStorage.getItem('darkModeEnabled');
    const savedSync = localStorage.getItem('syncEnabled');
    
    if (savedNotifications) setNotificationsEnabled(savedNotifications === 'true');
    if (savedDarkMode) setDarkModeEnabled(savedDarkMode === 'true');
    if (savedSync) setSyncEnabled(savedSync === 'true');
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
  
  const handleNotificationsChange = (checked: boolean) => {
    setNotificationsEnabled(checked);
    localStorage.setItem('notificationsEnabled', String(checked));
    toast({
      title: checked ? 'Notifications activées' : 'Notifications désactivées',
      description: checked ? 'Vous recevrez des notifications pour vos tâches' : 'Vous ne recevrez plus de notifications'
    });
  };
  
  const handleDarkModeChange = (checked: boolean) => {
    setDarkModeEnabled(checked);
    localStorage.setItem('darkModeEnabled', String(checked));
    toast({
      title: checked ? 'Mode sombre activé' : 'Mode clair activé',
      description: 'Le thème a été mis à jour'
    });
    // Note: This would typically modify the actual theme in a real app
  };
  
  const handleSyncChange = (checked: boolean) => {
    setSyncEnabled(checked);
    localStorage.setItem('syncEnabled', String(checked));
    toast({
      title: checked ? 'Synchronisation activée' : 'Synchronisation désactivée',
      description: checked ? 'Vos tâches seront synchronisées entre vos appareils' : 'Vos tâches ne seront plus synchronisées'
    });
  };
  
  const handleUpgradeClick = (plan: string) => {
    toast({
      title: 'Mise à niveau vers ' + plan,
      description: 'Fonctionnalité de mise à niveau à venir prochainement',
    });
  };
  
  if (!taskStats) {
    return <div className="text-center py-8">Chargement...</div>;
  }
  
  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full grid grid-cols-5 mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="subscription">Abonnement</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="data">Données</TabsTrigger>
          <TabsTrigger value="about">À propos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Votre Profil</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 rounded-full p-6 text-primary">
                    <User className="h-12 w-12" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={userProfile.email} onChange={(e) => setUserProfile({...userProfile, email: e.target.value})} />
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Compte créé le: {new Date(userProfile.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Sauvegarder</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.name} className={`${plan.current ? 'border-primary' : ''}`}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="text-lg font-semibold">{plan.price}</CardDescription>
                  {plan.current && <Badge className="bg-primary">Actuel</Badge>}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.current ? 'outline' : 'default'}
                    onClick={() => handleUpgradeClick(plan.name)}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Plan actuel' : 'Mettre à niveau'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>
                Personnalisez votre expérience TaskFlow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Recevoir des notifications pour les tâches en échéance</p>
                </div>
                <Switch 
                  checked={notificationsEnabled} 
                  onCheckedChange={handleNotificationsChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Mode sombre</h3>
                  <p className="text-sm text-muted-foreground">Activer le thème sombre pour l'interface</p>
                </div>
                <Switch 
                  checked={darkModeEnabled} 
                  onCheckedChange={handleDarkModeChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Synchronisation multi-appareils</h3>
                  <p className="text-sm text-muted-foreground">Synchroniser vos tâches sur tous vos appareils</p>
                </div>
                <Switch 
                  checked={syncEnabled} 
                  onCheckedChange={handleSyncChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
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
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: "Sauvegarde cloud",
                            description: "Fonctionnalité à venir prochainement",
                          })
                        }}
                      >
                        <Cloud className="h-4 w-4 mr-2" />
                        Sauvegarde cloud
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
