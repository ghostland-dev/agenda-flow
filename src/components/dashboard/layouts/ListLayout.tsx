
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import DashboardWidget from '../DashboardWidget';
import WidgetContent from '../WidgetContent';
import { WidgetConfig } from '../widgetUtils';

interface ListLayoutProps {
  widgetConfigs: WidgetConfig[];
  isEditMode: boolean;
  widgetData: any;
  onRemoveWidget: (id: string) => void;
  onMaximizeWidget: (id: string) => void;
  onRefreshWidget?: (id: string) => void;
  onPanelResize: (id: string, size: number) => void;
}

const ListLayout: React.FC<ListLayoutProps> = ({
  widgetConfigs,
  isEditMode,
  widgetData,
  onRemoveWidget,
  onMaximizeWidget,
  onRefreshWidget,
  onPanelResize
}) => {
  // Calculate minimum size based on widget count
  const widgetCount = widgetConfigs.length;
  const minSize = Math.max(10, Math.floor(100 / (widgetCount * 2))); // At least 10% height
  
  // If no widgets, display a message
  if (widgetConfigs.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted/20 rounded-lg border border-dashed">
        <p className="text-muted-foreground">Aucun widget à afficher</p>
      </div>
    );
  }

  return (
    <ResizablePanelGroup 
      direction="vertical" 
      className="min-h-[500px] w-full rounded-lg border"
    >
      {widgetConfigs.map((widget, index) => (
        <React.Fragment key={widget.id}>
          {index > 0 && (
            <ResizableHandle withHandle />
          )}
          <ResizablePanel
            defaultSize={widget.size || Math.floor(100 / widgetConfigs.length)}
            minSize={minSize}
            collapsible={false}
            onResize={(size) => onPanelResize(widget.id, size)}
            className="min-h-[200px]"
          >
            <div className="h-full w-full p-2">
              <DashboardWidget
                id={widget.id}
                title={widget.title}
                description={widget.description}
                onRemove={onRemoveWidget}
                onMaximize={onMaximizeWidget}
                onRefresh={onRefreshWidget}
                className={isEditMode ? "border-dashed border-2 h-full" : "h-full"}
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
          </ResizablePanel>
        </React.Fragment>
      ))}
    </ResizablePanelGroup>
  );
};

export default ListLayout;
