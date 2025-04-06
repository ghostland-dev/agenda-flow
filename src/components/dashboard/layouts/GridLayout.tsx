
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import DashboardWidget from '../DashboardWidget';
import WidgetContent from '../WidgetContent';
import { WidgetConfig } from '../widgetUtils';

interface GridLayoutProps {
  widgetConfigs: WidgetConfig[];
  isEditMode: boolean;
  widgetData: any;
  onRemoveWidget: (id: string) => void;
  onMaximizeWidget: (id: string) => void;
  onRefreshWidget?: (id: string) => void;
  onPanelResize: (id: string, size: number) => void;
}

const GridLayout: React.FC<GridLayoutProps> = ({
  widgetConfigs,
  isEditMode,
  widgetData,
  onRemoveWidget,
  onMaximizeWidget,
  onRefreshWidget,
  onPanelResize
}) => {
  // Diviser les widgets en rangées de 3 (ou moins si nécessaire)
  const rows = [];
  for (let i = 0; i < widgetConfigs.length; i += 3) {
    rows.push(widgetConfigs.slice(i, i + 3));
  }

  return (
    <div className="space-y-4">
      {rows.map((row, rowIndex) => (
        <ResizablePanelGroup 
          key={`row-${rowIndex}`}
          direction="horizontal" 
          className="min-h-[300px] w-full rounded-lg border"
        >
          {row.map((widget, colIndex) => (
            <React.Fragment key={widget.id}>
              {colIndex > 0 && (
                <ResizableHandle withHandle />
              )}
              <ResizablePanel
                defaultSize={widget.size || Math.floor(100 / row.length)}
                minSize={20}
                onResize={(size) => onPanelResize(widget.id, size)}
              >
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
              </ResizablePanel>
            </React.Fragment>
          ))}
        </ResizablePanelGroup>
      ))}
    </div>
  );
};

export default GridLayout;
