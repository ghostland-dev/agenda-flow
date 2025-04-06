
import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import DashboardLayout from './DashboardLayout';
import { WidgetConfig } from './widgetUtils';

interface DashboardContentProps {
  layout: 'grid' | 'list';
  widgetConfigs: WidgetConfig[];
  isEditMode: boolean;
  widgetData: any;
  onRemoveWidget: (id: string) => void;
  onMaximizeWidget: (id: string) => void;
  onRefreshWidget?: (id: string) => void;
  onPanelResize: (id: string, size: number) => void;
  onSortEnd: (newOrder: WidgetConfig[]) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  layout,
  widgetConfigs,
  isEditMode,
  widgetData,
  onRemoveWidget,
  onMaximizeWidget,
  onRefreshWidget,
  onPanelResize,
  onSortEnd
}) => {
  const visibleWidgets = widgetConfigs.filter(w => w.isVisible);

  if (isEditMode) {
    return (
      <ReactSortable 
        list={visibleWidgets} 
        setList={onSortEnd as any}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        handle=".drag-handle"
      >
        {visibleWidgets.map(widget => (
          <div key={widget.id} className="widget-item" data-id={widget.id}>
            <DashboardLayout
              layout="grid"
              widgetConfigs={[widget]}
              isEditMode={isEditMode}
              widgetData={widgetData}
              onRemoveWidget={onRemoveWidget}
              onMaximizeWidget={onMaximizeWidget}
              onRefreshWidget={onRefreshWidget}
              onPanelResize={onPanelResize}
            />
          </div>
        ))}
      </ReactSortable>
    );
  }
  
  return (
    <DashboardLayout
      layout={layout}
      widgetConfigs={visibleWidgets}
      isEditMode={isEditMode}
      widgetData={widgetData}
      onRemoveWidget={onRemoveWidget}
      onMaximizeWidget={onMaximizeWidget}
      onRefreshWidget={onRefreshWidget}
      onPanelResize={onPanelResize}
    />
  );
};

export default DashboardContent;
