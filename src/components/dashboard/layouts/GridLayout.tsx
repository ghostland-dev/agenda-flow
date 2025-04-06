
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
  // Group widgets into rows of 3 (or fewer if necessary)
  const rows: WidgetConfig[][] = [];
  for (let i = 0; i < widgetConfigs.length; i += 3) {
    rows.push(widgetConfigs.slice(i, i + 3));
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
