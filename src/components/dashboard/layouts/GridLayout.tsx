
import React from 'react';
import { WidgetConfig } from '../widgetUtils';
import GridRow from './GridRow';

interface GridLayoutProps {
  widgetConfigs: WidgetConfig[];
  isEditMode: boolean;
  widgetData: any;
  onRemoveWidget: (id: string) => void;
  onMaximizeWidget: (id: string) => void;
  onRefreshWidget?: (id: string) => void;
  onPanelResize: (id: string, size: number) => void;
  widgetsPerRow?: number;
}

const GridLayout: React.FC<GridLayoutProps> = ({
  widgetConfigs,
  isEditMode,
  widgetData,
  onRemoveWidget,
  onMaximizeWidget,
  onRefreshWidget,
  onPanelResize,
  widgetsPerRow = 3
}) => {
  // Group widgets into rows based on widgetsPerRow
  const rows: WidgetConfig[][] = [];
  for (let i = 0; i < widgetConfigs.length; i += widgetsPerRow) {
    rows.push(widgetConfigs.slice(i, i + widgetsPerRow));
  }

  return (
    <div className="space-y-4">
      {rows.map((rowWidgets, rowIndex) => (
        <GridRow
          key={`row-${rowIndex}`}
          rowWidgets={rowWidgets}
          isEditMode={isEditMode}
          widgetData={widgetData}
          onRemoveWidget={onRemoveWidget}
          onMaximizeWidget={onMaximizeWidget}
          onRefreshWidget={onRefreshWidget}
          onPanelResize={onPanelResize}
        />
      ))}
    </div>
  );
};

export default GridLayout;
