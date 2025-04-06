
import React from 'react';
import DashboardWidget from '../dashboard/DashboardWidget';
import WidgetContent from '../dashboard/WidgetContent';
import { useDashboardManager } from './DashboardManagerProvider';

const MaximizedWidget: React.FC = () => {
  const { 
    widgetConfigs, 
    maximizedWidget, 
    handleRemoveWidget, 
    handleMaximizeWidget,
    widgetData
  } = useDashboardManager();

  if (!maximizedWidget) return null;

  const widget = widgetConfigs.find(w => w.id === maximizedWidget && w.isVisible);
  if (!widget) return null;

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <DashboardWidget
        id={widget.id}
        title={widget.title}
        description={widget.description}
        onRemove={handleRemoveWidget}
        onMaximize={handleMaximizeWidget}
        isMaximized={true}
        className="h-[calc(100vh-160px)] shadow-md"
      >
        <WidgetContent
          type={widget.type}
          data={{
            tasks: 
              widget.type === 'today-tasks' ? widgetData['today-tasksTasks'] :
              widget.type === 'urgent-tasks' ? widgetData['urgent-tasksTasks'] :
              widget.type === 'overdue-tasks' ? widgetData['overdue-tasksTasks'] : 
              undefined,
            stats: widgetData.stats
          }}
        />
      </DashboardWidget>
    </div>
  );
};

export default MaximizedWidget;
