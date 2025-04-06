
import React from 'react';
import DashboardState from './dashboard/DashboardState';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardContent from './dashboard/DashboardContent';

const Dashboard: React.FC<{ focusMode?: boolean }> = ({ focusMode = false }) => {
  return (
    <DashboardState focusMode={focusMode}>
      {({
        layout,
        widgetConfigs,
        isEditMode,
        widgetData,
        handleAddWidget,
        handleRemoveWidget,
        handleMaximizeWidget,
        handlePanelResize,
        handleSortEnd,
        handleToggleLayout,
        handleToggleEditMode
      }) => (
        <div className="container py-6">
          <DashboardHeader 
            title="Tableau de bord"
            description={focusMode 
              ? "Vue concentrée sur vos tâches essentielles" 
              : "Bienvenue sur votre tableau de bord personnalisé"
            }
            focusMode={focusMode}
            widgetConfigs={widgetConfigs}
            layout={layout}
            isEditMode={isEditMode}
            onAddWidget={handleAddWidget}
            onToggleLayout={handleToggleLayout}
            onToggleEditMode={handleToggleEditMode}
          />
          
          <DashboardContent 
            layout={layout}
            widgetConfigs={widgetConfigs}
            isEditMode={isEditMode}
            widgetData={widgetData}
            onRemoveWidget={handleRemoveWidget}
            onMaximizeWidget={handleMaximizeWidget}
            onPanelResize={handlePanelResize}
            onSortEnd={handleSortEnd}
          />
        </div>
      )}
    </DashboardState>
  );
};

export default Dashboard;
