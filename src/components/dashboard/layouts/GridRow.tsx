
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { WidgetConfig } from '../widgetUtils';
import DashboardWidget from '../DashboardWidget';
import WidgetContent from '../WidgetContent';

interface GridRowProps {
  rowWidgets: WidgetConfig[];
  isEditMode: boolean;
  widgetData: any;
  onRemoveWidget: (id: string) => void;
  onMaximizeWidget: (id: string) => void;
  onRefreshWidget?: (id: string) => void;
  onPanelResize: (id: string, size: number) => void;
}

const GridRow: React.FC<GridRowProps> = ({
  rowWidgets,
  isEditMode,
  widgetData,
  onRemoveWidget,
  onMaximizeWidget,
  onRefreshWidget,
  onPanelResize
}) => {
  return (
    <ResizablePanelGroup 
      direction="horizontal" 
      className="min-h-[300px] w-full rounded-lg border"
    >
      {rowWidgets.map((widget, colIndex) => (
        <React.Fragment key={widget.id}>
          {colIndex > 0 && <ResizableHandle withHandle />}
          <ResizablePanel
            defaultSize={widget.size || Math.floor(100 / rowWidgets.length)}
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
  );
};

export default GridRow;
