
import React from 'react';
import DashboardWidget from './DashboardWidget';
import WidgetContent from './WidgetContent';
import { WidgetConfig } from './widgetUtils';

interface MaximizedWidgetProps {
  widgetId: string;
  widgetConfigs: WidgetConfig[];
  widgetData: any;
  onRemoveWidget: (id: string) => void;
  onMaximizeWidget: (id: string) => void;
  onRefreshWidget?: (id: string) => void;
}

const MaximizedWidget: React.FC<MaximizedWidgetProps> = ({
  widgetId,
  widgetConfigs,
  widgetData,
  onRemoveWidget,
  onMaximizeWidget,
  onRefreshWidget
}) => {
  const widget = widgetConfigs.find(w => w.id === widgetId);
  
  if (!widget) {
    return null;
  }
  
  return (
    <div className="animate-fade-in">
      <DashboardWidget
        id={widget.id}
        title={widget.title}
        description={widget.description}
        onRemove={onRemoveWidget}
        onMaximize={onMaximizeWidget}
        onRefresh={onRefreshWidget}
        isMaximized={true}
        className="min-h-[calc(100vh-200px)]"
      >
        <WidgetContent
          type={widget.type}
          data={{
            tasks: widgetData[`${widget.type}Tasks`],
            stats: widgetData.stats
          }}
        />
      </DashboardWidget>
    </div>
  );
};

export default MaximizedWidget;
