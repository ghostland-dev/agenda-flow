
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
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
  onRefreshWidget?: (id: string) => void;
  onPanelResize: (id: string, size: number) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  layout,
  widgetConfigs,
  isEditMode,
  widgetData,
  onRemoveWidget,
  onMaximizeWidget,
  onRefreshWidget,
  onPanelResize
}) => {
  const isMobile = useIsMobile();
  const visibleWidgets = widgetConfigs.filter(widget => widget.isVisible);

  // Sur mobile, toujours utiliser une disposition en liste simple
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {visibleWidgets.map(widget => (
          <DashboardWidget
            key={widget.id}
            id={widget.id}
            title={widget.title}
            description={widget.description}
            onRemove={onRemoveWidget}
            onMaximize={onMaximizeWidget}
            onRefresh={onRefreshWidget}
            className={isEditMode ? "border-dashed border-2 shadow-sm" : "shadow-sm"}
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
  }

  // Mode grille - organisation en colonnes avec redimensionnement horizontal
  if (layout === 'grid') {
    // Diviser les widgets en rangées de 3 (ou moins si nécessaire)
    const rows = [];
    for (let i = 0; i < visibleWidgets.length; i += 3) {
      rows.push(visibleWidgets.slice(i, i + 3));
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
                  <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={100} minSize={100}>
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
                  </ResizablePanelGroup>
                </ResizablePanel>
              </React.Fragment>
            ))}
          </ResizablePanelGroup>
        ))}
      </div>
    );
  } else {
    // Mode liste - avec redimensionnement vertical
    return (
      <ResizablePanelGroup 
        direction="vertical" 
        className="min-h-[200px] w-full rounded-lg border"
      >
        {visibleWidgets.map((widget, index) => (
          <React.Fragment key={widget.id}>
            <ResizablePanel
              defaultSize={widget.size || Math.floor(100 / visibleWidgets.length)}
              minSize={15}
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
            {index < visibleWidgets.length - 1 && (
              <ResizableHandle withHandle />
            )}
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
    );
  }
};

export default DashboardLayout;
