
import { useState, useEffect } from 'react';

export function useDashboardLayout() {
  const [layout, setLayout] = useState<'grid' | 'list'>(() => {
    try {
      const savedLayout = localStorage.getItem('dashboard-layout');
      // Check if savedLayout exists and is a valid value
      if (savedLayout && (savedLayout === 'grid' || savedLayout === 'list')) {
        return savedLayout as 'grid' | 'list';
      }
      return 'grid'; // Default value if not valid
    } catch (error) {
      console.error('Error loading layout from localStorage:', error);
      return 'grid'; // Default to grid on error
    }
  });
  
  const [widgetsPerRow, setWidgetsPerRow] = useState<number>(() => {
    try {
      const savedWidgetsPerRow = localStorage.getItem('dashboard-widgets-per-row');
      return savedWidgetsPerRow ? parseInt(savedWidgetsPerRow, 10) : 3; // Default to 3
    } catch (error) {
      console.error('Error loading widgets per row from localStorage:', error);
      return 3; // Default to 3 on error
    }
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [maximizedWidgetId, setMaximizedWidgetId] = useState<string | null>(null);
  
  // Save layout
  useEffect(() => {
    localStorage.setItem('dashboard-layout', layout);
  }, [layout]);
  
  // Save widgets per row
  useEffect(() => {
    localStorage.setItem('dashboard-widgets-per-row', widgetsPerRow.toString());
  }, [widgetsPerRow]);
  
  const handleMaximizeWidget = (id: string) => {
    setMaximizedWidgetId(prev => prev === id ? null : id);
  };
  
  const handleToggleLayout = () => {
    setLayout(prev => prev === 'grid' ? 'list' : 'grid');
  };
  
  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
    
    // Disable maximization when entering edit mode
    if (!isEditMode) {
      setMaximizedWidgetId(null);
    }
  };
  
  const handleChangeWidgetsPerRow = (count: number) => {
    setWidgetsPerRow(count);
  };

  return {
    layout,
    isEditMode,
    maximizedWidgetId,
    widgetsPerRow,
    handleMaximizeWidget,
    handleToggleLayout,
    handleToggleEditMode,
    handleChangeWidgetsPerRow
  };
}
