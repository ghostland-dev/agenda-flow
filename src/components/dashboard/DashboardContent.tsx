
import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardLayout from './DashboardLayout';
import DashboardWidget from './DashboardWidget';
import WidgetContent from './WidgetContent';
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
  widgetsPerRow?: number;
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
  onSortEnd,
  widgetsPerRow = 3
}) => {
  const isMobile = useIsMobile();
  const visibleWidgets = widgetConfigs.filter(w => w.isVisible);

  // Mode édition avec tri des widgets
  if (isEditMode) {
    // Dans tous les cas, on permet de réordonner les widgets
    const gridClassName = isMobile
      ? "grid grid-cols-1 gap-4"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

    return (
      <ReactSortable 
        list={visibleWidgets} 
        setList={onSortEnd as any}
        className={gridClassName}
        handle=".drag-handle"
        animation={200}
      >
        {visibleWidgets.map(widget => (
          <div key={widget.id} className="widget-item h-full min-h-[200px]" data-id={widget.id}>
            <DashboardWidget
              id={widget.id}
              title={widget.title}
              description={widget.description}
              onRemove={onRemoveWidget}
              onMaximize={onMaximizeWidget}
              onRefresh={onRefreshWidget}
              className="border-dashed border-2 shadow-sm h-full"
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
        ))}
      </ReactSortable>
    );
  }
  
  // Mode normal - on utilise le layout configurable
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
      widgetsPerRow={widgetsPerRow}
    />
  );
};

export default DashboardContent;
