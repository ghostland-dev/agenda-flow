
import { useState, useEffect } from 'react';
import { WidgetConfig, getDefaultWidgets, getWidgetTitle, getWidgetDescription } from '@/components/dashboard/widgetUtils';
import { useToast } from '@/hooks/use-toast';

export function useWidgetConfigs(focusMode = false) {
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>(() => {
    try {
      const savedWidgets = localStorage.getItem('dashboard-widgets');
      if (savedWidgets) {
        return JSON.parse(savedWidgets);
      }
    } catch (e) {
      console.error('Failed to parse widgets', e);
    }
    
    // Default widgets
    return getDefaultWidgets(focusMode);
  });

  const { toast } = useToast();

  // Persist widget configs when they change
  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgetConfigs));
  }, [widgetConfigs]);

  // Apply focus mode changes
  useEffect(() => {
    if (focusMode) {
      setWidgetConfigs(prevWidgets => 
        prevWidgets.map(widget => ({
          ...widget,
          isVisible: ['today-tasks', 'habits', 'urgent-tasks'].includes(widget.type)
        }))
      );
    }
  }, [focusMode]);

  const handleRemoveWidget = (id: string) => {
    setWidgetConfigs(prevWidgets => 
      prevWidgets.map(widget => 
        widget.id === id ? { ...widget, isVisible: false } : widget
      )
    );
    
    toast({
      title: 'Widget supprimé',
      description: 'Le widget a été retiré du tableau de bord',
    });
  };

  const handleAddWidget = (type: string) => {
    const existingWidget = widgetConfigs.find(w => w.type === type && !w.isVisible);
    
    if (existingWidget) {
      setWidgetConfigs(prevWidgets => 
        prevWidgets.map(widget => 
          widget.id === existingWidget.id ? { ...widget, isVisible: true } : widget
        )
      );
    } else {
      const newId = `widget-${Date.now()}`;
      const title = getWidgetTitle(type);
      
      setWidgetConfigs(prevWidgets => [
        ...prevWidgets,
        {
          id: newId,
          title,
          type,
          size: 33,
          isVisible: true,
          description: getWidgetDescription(type)
        }
      ]);
    }
    
    toast({
      title: 'Widget ajouté',
      description: `Le widget ${getWidgetTitle(type)} a été ajouté au tableau de bord`,
    });
  };

  const handlePanelResize = (id: string, size: number) => {
    setWidgetConfigs(prevWidgets => 
      prevWidgets.map(widget => 
        widget.id === id ? { ...widget, size } : widget
      )
    );
  };

  return {
    widgetConfigs,
    handleRemoveWidget,
    handleAddWidget,
    handlePanelResize
  };
}
