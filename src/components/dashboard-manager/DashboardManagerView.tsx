
import React from 'react';
import { useDashboardManager } from '@/contexts/dashboard-manager-context';
import MaximizedWidget from './MaximizedWidget';
import DashboardControls from './DashboardControls';
import DashboardLayout from '../dashboard/DashboardLayout';

interface DashboardManagerViewProps {
  searchQuery?: string;
  focusMode?: boolean;
}

const DashboardManagerView: React.FC<DashboardManagerViewProps> = ({ searchQuery, focusMode }) => {
  const { 
    stats, 
    widgetConfigs, 
    isEditMode, 
    layout, 
    widgetsPerRow,
    maximizedWidget,
    widgetData,
    handleRemoveWidget,
    handleMaximizeWidget,
    handleRefreshWidget,
    handlePanelResize
  } = useDashboardManager();

  if (!stats) {
    return <div className="p-8 text-center">Chargement des données...</div>;
  }

  if (maximizedWidget) {
    return <MaximizedWidget />;
  }

  // Filtrer les widgets si en mode focus
  const displayWidgets = focusMode 
    ? widgetConfigs.filter(widget => ['urgent-tasks', 'today-tasks'].includes(widget.type))
    : widgetConfigs;

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <DashboardControls />
      </div>
      
      {/* Add a container with specific height for list view to ensure proper layout */}
      <div className={layout === 'list' ? 'h-[calc(100vh-200px)]' : ''}>
        <DashboardLayout
          layout={layout}
          widgetConfigs={displayWidgets}
          isEditMode={isEditMode}
          widgetData={widgetData}
          onRemoveWidget={handleRemoveWidget}
          onMaximizeWidget={handleMaximizeWidget}
          onRefreshWidget={handleRefreshWidget}
          onPanelResize={handlePanelResize}
          widgetsPerRow={widgetsPerRow || 3}
        />
      </div>
    </div>
  );
};

export default DashboardManagerView;
