
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import DashboardWidget from './DashboardWidget';
import WidgetContent from './WidgetContent';
import { WidgetConfig } from './widgetUtils';

interface DashboardLayoutProps {
  layout: 'grid' | 'list';
  widgetConfigs: WidgetConfig[];
  isEditMode: boolean;
  widgetData: any;
  onRemoveWidget: (id: string) => void;
  onMaximizeWidget: (id: string) => void;
  onPanelResize: (id: string, size: number) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  layout,
  widgetConfigs,
  isEditMode,
  widgetData,
  onRemoveWidget,
  onMaximizeWidget,
  onPanelResize
}) => {
  const visibleWidgets = widgetConfigs.filter(widget => widget.isVisible);

  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleWidgets.map(widget => (
          <DashboardWidget
            key={widget.id}
            id={widget.id}
            title={widget.title}
            description={widget.description}
            onRemove={onRemoveWidget}
            onMaximize={onMaximizeWidget}
            className={isEditMode ? "border-dashed border-2" : ""}
          >
            <WidgetContent
              type={widget.type}
              data={{
                tasks: widgetData[`${widget.type}Tasks`],
                stats: widgetData.stats
              }}
            />
          </DashboardWidget>
        ))}
      </div>
    );
  } else {
    return (
      <ResizablePanelGroup 
        direction="vertical" 
        className="min-h-[200px]"
      >
        {visibleWidgets.map((widget, index, array) => (
          <React.Fragment key={widget.id}>
            <ResizablePanel
              defaultSize={widget.size}
              onResize={(size) => onPanelResize(widget.id, size)}
              className="min-h-[200px]"
            >
              <DashboardWidget
                id={widget.id}
                title={widget.title}
                description={widget.description}
                onRemove={onRemoveWidget}
                onMaximize={onMaximizeWidget}
                className={isEditMode ? "border-dashed border-2" : ""}
              >
                <WidgetContent
                  type={widget.type}
                  data={{
                    tasks: widgetData[`${widget.type}Tasks`],
                    stats: widgetData.stats
                  }}
                />
              </DashboardWidget>
            </ResizablePanel>
            {index < array.length - 1 && (
              <ResizableHandle withHandle />
            )}
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
    );
  }
};

export default DashboardLayout;
