
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import TaskService from '@/services/taskService';
import { TaskFilter } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { FileDown, FileUp, Check, AlertTriangle } from 'lucide-react';

interface TaskImportExportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  filter?: TaskFilter;
}

const TaskImportExport: React.FC<TaskImportExportProps> = ({
  open,
  onOpenChange,
  onComplete,
  filter
}) => {
  const { toast } = useToast();
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json');
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [importData, setImportData] = useState('');
  const [exportData, setExportData] = useState('');
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const handleExport = () => {
    const data = TaskService.exportTasks(exportFormat, filter);
    setExportData(data);
    
    toast({
      title: 'Exportation réussie',
      description: `Les données ont été exportées au format ${exportFormat.toUpperCase()}`
    });
  };
  
  const handleImport = () => {
    if (!importData.trim()) {
      setImportResult({
        success: false,
        message: 'Veuillez entrer des données à importer'
      });
      return;
    }
    
    const result = TaskService.importTasks(importData, importFormat);
    setImportResult(result);
    
    if (result.success) {
      onComplete();
      toast({
        title: 'Importation réussie',
        description: result.message
      });
    } else {
      toast({
        title: 'Erreur d\'importation',
        description: result.message,
        variant: 'destructive'
      });
    }
  };
  
  const downloadExport = () => {
    const blob = new Blob([exportData], { type: exportFormat === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-export.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Importer / Exporter des tâches</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="export" className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="export">
              <FileDown className="h-4 w-4 mr-2" />
              Exporter
            </TabsTrigger>
            <TabsTrigger value="import">
              <FileUp className="h-4 w-4 mr-2" />
              Importer
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="export" className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label>Format d'exportation</Label>
                <Select 
                  value={exportFormat} 
                  onValueChange={(value) => setExportFormat(value as 'json' | 'csv')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="mt-8" onClick={handleExport}>
                Générer l'exportation
              </Button>
            </div>
            
            {exportData && (
              <>
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Données exportées</Label>
                    <Button variant="outline" size="sm" onClick={downloadExport}>
                      Télécharger
                    </Button>
                  </div>
                  
                  <Textarea 
                    value={exportData} 
                    readOnly 
                    className="font-mono text-xs h-60"
                  />
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="import" className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label>Format d'importation</Label>
                <Select 
                  value={importFormat} 
                  onValueChange={(value) => setImportFormat(value as 'json' | 'csv')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-8">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  Charger un fichier
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept={importFormat === 'json' ? '.json' : '.csv'}
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Données à importer</Label>
              <Textarea 
                value={importData} 
                onChange={(e) => setImportData(e.target.value)} 
                placeholder={importFormat === 'json' ? '{"id": "..."}' : 'ID,Title,Priority,Category,...'}
                className="font-mono text-xs h-60"
              />
            </div>
            
            {importResult && (
              <Alert variant={importResult.success ? 'default' : 'destructive'}>
                <div className="flex items-start gap-2">
                  {importResult.success ? (
                    <Check className="h-4 w-4 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                  )}
                  <AlertDescription>
                    {importResult.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}
            
            <div className="text-right">
              <Button onClick={handleImport}>
                Importer les données
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TaskImportExport;
