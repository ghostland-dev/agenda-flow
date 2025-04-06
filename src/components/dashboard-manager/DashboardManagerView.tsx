
import React from 'react';
import { useDashboardManager } from './DashboardManagerProvider';
import MaximizedWidget from './MaximizedWidget';
import DashboardControls from './DashboardControls';
import DashboardLayout from '../dashboard/DashboardLayout';

interface DashboardManagerViewProps {
  searchQuery?: string;
}

const DashboardManagerView: React.FC<DashboardManagerViewProps> = ({ searchQuery }) => {
  const { 
    stats, 
    widgetConfigs, 
    isEditMode, 
    layout, 
    maximizedWidget,
    widgetData,
    handleRemoveWidget,
    handleMaximizeWidget,
    handlePanelResize
  } = useDashboardManager();

  if (!stats) {
    return <div className="p-8 text-center">Chargement des données...</div>;
  }

  if (maximizedWidget) {
    return <MaximizedWidget />;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Tableau de bord</h1>
        <DashboardControls />
      </div>
      
      <DashboardLayout
        layout={layout}
        widgetConfigs={widgetConfigs}
        isEditMode={isEditMode}
        widgetData={widgetData}
        onRemoveWidget={handleRemoveWidget}
        onMaximizeWidget={handleMaximizeWidget}
        onPanelResize={handlePanelResize}
      />
    </div>
  );
};

export default DashboardManagerView;
