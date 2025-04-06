
import React from 'react';
import DashboardState from './dashboard/DashboardState';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardContent from './dashboard/DashboardContent';
import MaximizedWidget from './dashboard/MaximizedWidget';

const Dashboard: React.FC<{ focusMode?: boolean }> = ({ focusMode = false }) => {
  return (
    <DashboardState focusMode={focusMode}>
      {({
        layout,
        widgetConfigs,
        isEditMode,
        widgetData,
        maximizedWidgetId,
        widgetsPerRow,
        handleAddWidget,
        handleRemoveWidget,
        handleMaximizeWidget,
        handleRefreshWidget,
        handlePanelResize,
        handleSortEnd,
        handleToggleLayout,
        handleToggleEditMode,
        handleChangeWidgetsPerRow
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
            widgetsPerRow={widgetsPerRow}
            isEditMode={isEditMode}
            onAddWidget={handleAddWidget}
            onToggleLayout={handleToggleLayout}
            onToggleEditMode={handleToggleEditMode}
            onChangeWidgetsPerRow={handleChangeWidgetsPerRow}
          />
          
          {maximizedWidgetId ? (
            <MaximizedWidget 
              widgetId={maximizedWidgetId}
              widgetConfigs={widgetConfigs}
              widgetData={widgetData}
              onRemoveWidget={handleRemoveWidget}
              onMaximizeWidget={handleMaximizeWidget}
              onRefreshWidget={handleRefreshWidget}
            />
          ) : (
            <DashboardContent 
              layout={layout}
              widgetConfigs={widgetConfigs}
              isEditMode={isEditMode}
              widgetData={widgetData}
              widgetsPerRow={widgetsPerRow}
              onRemoveWidget={handleRemoveWidget}
              onMaximizeWidget={handleMaximizeWidget}
              onRefreshWidget={handleRefreshWidget}
              onPanelResize={handlePanelResize}
              onSortEnd={handleSortEnd}
            />
          )}
        </div>
      )}
    </DashboardState>
  );
};

export default Dashboard;
