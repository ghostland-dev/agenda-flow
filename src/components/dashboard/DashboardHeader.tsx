
import React from 'react';
import WidgetControls from './WidgetControls';
import { WidgetConfig } from './widgetUtils';

interface DashboardHeaderProps {
  title: string;
  description: string;
  focusMode?: boolean;
  widgetConfigs: WidgetConfig[];
  layout: 'grid' | 'list';
  isEditMode: boolean;
  onAddWidget: (type: string) => void;
  onToggleLayout: () => void;
  onToggleEditMode: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
  focusMode = false,
  widgetConfigs,
  layout,
  isEditMode,
  onAddWidget,
  onToggleLayout,
  onToggleEditMode
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
          isEditMode={isEditMode}
          onAddWidget={onAddWidget}
          onToggleLayout={onToggleLayout}
          onToggleEditMode={onToggleEditMode}
        />
      )}
    </div>
  );
};

export default DashboardHeader;
