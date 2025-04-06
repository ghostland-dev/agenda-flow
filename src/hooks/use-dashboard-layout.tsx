
import { useState, useEffect } from 'react';

export function useDashboardLayout() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'list'>(() => {
    try {
      const savedLayout = localStorage.getItem('dashboard-layout');
      return savedLayout === 'list' ? 'list' : 'grid';
    } catch (error) {
      console.error('Error loading layout:', error);
      return 'grid';
    }
  });
  const [maximizedWidget, setMaximizedWidget] = useState<string | null>(null);
  
  // Persist layout when it changes
  useEffect(() => {
    localStorage.setItem('dashboard-layout', layout);
  }, [layout]);
  
  const handleMaximizeWidget = (id: string) => {
    setMaximizedWidget(maximizedWidget === id ? null : id);
  };

  const toggleLayout = () => {
    setLayout(layout === 'grid' ? 'list' : 'grid');
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return {
    isEditMode,
    layout,
    maximizedWidget,
    handleMaximizeWidget,
    toggleLayout,
    toggleEditMode
  };
}
