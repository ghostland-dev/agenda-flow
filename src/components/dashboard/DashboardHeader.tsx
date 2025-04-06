
import React from 'react';
import WidgetControls from './WidgetControls';
import { WidgetConfig } from './widgetUtils';

interface DashboardHeaderProps {
  title: string;
  description: string;
  focusMode?: boolean;
  widgetConfigs: WidgetConfig[];
  layout: 'grid' | 'list';
  widgetsPerRow: number;
  isEditMode: boolean;
  onAddWidget: (type: string) => void;
  onToggleLayout: () => void;
  onToggleEditMode: () => void;
  onChangeWidgetsPerRow: (count: number) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
  focusMode = false,
  widgetConfigs,
  layout,
  widgetsPerRow,
  isEditMode,
  onAddWidget,
  onToggleLayout,
  onToggleEditMode,
  onChangeWidgetsPerRow
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      {!focusMode && (
        <WidgetControls 
          widgetConfigs={widgetConfigs}
          layout={layout}
          widgetsPerRow={widgetsPerRow}
          isEditMode={isEditMode}
          onAddWidget={onAddWidget}
          onToggleLayout={onToggleLayout}
          onToggleEditMode={onToggleEditMode}
          onChangeWidgetsPerRow={onChangeWidgetsPerRow}
        />
      )}
    </div>
  );
};

export default DashboardHeader;
