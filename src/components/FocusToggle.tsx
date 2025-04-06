
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface FocusToggleProps {
  isFocused: boolean;
  onToggle: (value: boolean) => void;
}

const FocusToggle: React.FC<FocusToggleProps> = ({ isFocused, onToggle }) => {
  const { toast } = useToast();
  
  const handleToggle = (checked: boolean) => {
    onToggle(checked);
    toast({
      title: checked ? "Mode Focus activé" : "Mode Focus désactivé",
      description: checked 
        ? "Vous voyez uniquement les tâches essentielles" 
        : "Affichage de toutes les tâches",
      duration: 3000,
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch 
        checked={isFocused} 
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-primary"
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">
        {isFocused ? 'Focus' : 'Complet'}
      </span>
    </div>
  );
};

export default FocusToggle;
