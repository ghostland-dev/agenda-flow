
import { useState, useEffect } from 'react';
import { WidgetConfig, getDefaultWidgetConfigs } from '@/components/dashboard/widgetUtils';
import { useToast } from '@/hooks/use-toast';

export function useWidgetConfigs(focusMode = false) {
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>(() => {
    try {
      const savedConfigs = localStorage.getItem('dashboard-widgets');
      return savedConfigs ? JSON.parse(savedConfigs) : getDefaultWidgetConfigs();
    } catch (error) {
      console.error('Error loading widget configs from localStorage:', error);
      return getDefaultWidgetConfigs(); // Default widgets on error
    }
  });
  
  const { toast } = useToast();

  // Save widget configurations
  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgetConfigs));
  }, [widgetConfigs]);
  
  const handleAddWidget = (type: string) => {
    const widgetToAdd = widgetConfigs.find(w => w.type === type && !w.isVisible);
    
    if (widgetToAdd) {
      setWidgetConfigs(prev => 
        prev.map(widget => 
          widget.id === widgetToAdd.id 
            ? { ...widget, isVisible: true } 
            : widget
        )
      );
      
      toast({
        title: "Widget ajouté",
        description: `Le widget "${widgetToAdd.title}" a été ajouté au tableau de bord`,
      });
    }
  };
  
  const handleRemoveWidget = (id: string) => {
    setWidgetConfigs(prev => 
      prev.map(widget => 
        widget.id === id 
          ? { ...widget, isVisible: false } 
          : widget
      )
    );
    
    toast({
      title: "Widget supprimé",
      description: "Le widget a été retiré du tableau de bord",
    });
  };
  
  const handlePanelResize = (id: string, size: number) => {
    setWidgetConfigs(prev => 
      prev.map(widget => 
        widget.id === id 
          ? { ...widget, size } 
          : widget
      )
    );
  };
  
  const handleSortEnd = (newOrder: WidgetConfig[]) => {
    setWidgetConfigs(newOrder);
  };

  return {
    widgetConfigs,
    handleAddWidget,
    handleRemoveWidget,
    handlePanelResize,
    handleSortEnd
  };
}
