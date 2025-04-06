
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { WidgetConfig } from './widgetUtils';
import GridLayout from './layouts/GridLayout';
import ListLayout from './layouts/ListLayout';
import MobileLayout from './layouts/MobileLayout';

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
      <MobileLayout
        widgetConfigs={visibleWidgets}
        isEditMode={isEditMode}
        widgetData={widgetData}
        onRemoveWidget={onRemoveWidget}
        onMaximizeWidget={onMaximizeWidget}
        onRefreshWidget={onRefreshWidget}
      />
    );
  }

  // Mode grille ou liste selon la configuration
  if (layout === 'grid') {
    return (
      <GridLayout
        widgetConfigs={visibleWidgets}
        isEditMode={isEditMode}
        widgetData={widgetData}
        onRemoveWidget={onRemoveWidget}
        onMaximizeWidget={onMaximizeWidget}
        onRefreshWidget={onRefreshWidget}
        onPanelResize={onPanelResize}
      />
    );
  } else {
    return (
      <ListLayout
        widgetConfigs={visibleWidgets}
        isEditMode={isEditMode}
        widgetData={widgetData}
        onRemoveWidget={onRemoveWidget}
        onMaximizeWidget={onMaximizeWidget}
        onRefreshWidget={onRefreshWidget}
        onPanelResize={onPanelResize}
      />
    );
  }
};

export default DashboardLayout;
