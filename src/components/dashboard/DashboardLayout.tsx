
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

  // Mode grille adaptée avec redimensionnement dans les deux dimensions
  if (layout === 'grid') {
    // Sur mobile, on affiche une simple liste sans redimensionnement
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

    // Sur desktop/tablette, affichage en grille redimensionnable horizontalement et verticalement
    return (
      <ResizablePanelGroup 
        direction="horizontal" 
        className="min-h-[500px] w-full rounded-lg border"
      >
        {visibleWidgets.map((widget, index, array) => (
          <React.Fragment key={widget.id}>
            {index > 0 && (
              <ResizableHandle withHandle className="mx-1" />
            )}
            <ResizablePanel
              defaultSize={100 / array.length}
              minSize={20}
              onResize={(size) => onPanelResize(widget.id, size)}
              className="min-h-[200px]"
            >
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={100} minSize={20}>
                  <DashboardWidget
                    id={widget.id}
                    title={widget.title}
                    description={widget.description}
                    onRemove={onRemoveWidget}
                    onMaximize={onMaximizeWidget}
                    onRefresh={onRefreshWidget}
                    className={isEditMode ? "border-dashed border-2 shadow-sm h-full" : "shadow-sm h-full"}
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
    );
  } else {
    // Mode liste - redimensionnement vertical uniquement
    return (
      <ResizablePanelGroup 
        direction="vertical" 
        className="min-h-[200px] w-full"
      >
        {visibleWidgets.map((widget, index, array) => (
          <React.Fragment key={widget.id}>
            <ResizablePanel
              defaultSize={widget.size || 100 / array.length}
              minSize={20}
              onResize={(size) => onPanelResize(widget.id, size)}
              className="min-h-[200px]"
            >
              <DashboardWidget
                id={widget.id}
                title={widget.title}
                description={widget.description}
                onRemove={onRemoveWidget}
                onMaximize={onMaximizeWidget}
                onRefresh={onRefreshWidget}
                className={isEditMode ? "border-dashed border-2 shadow-sm h-full" : "shadow-sm h-full"}
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
              <ResizableHandle withHandle className="my-2" />
            )}
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
    );
  }
};

export default DashboardLayout;
