
import React from 'react';
import DashboardWidget from '../DashboardWidget';
import WidgetContent from '../WidgetContent';
import { WidgetConfig } from '../widgetUtils';

interface MobileLayoutProps {
  widgetConfigs: WidgetConfig[];
  isEditMode: boolean;
  widgetData: any;
  onRemoveWidget: (id: string) => void;
  onMaximizeWidget: (id: string) => void;
  onRefreshWidget?: (id: string) => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  widgetConfigs,
  isEditMode,
  widgetData,
  onRemoveWidget,
  onMaximizeWidget,
  onRefreshWidget
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {widgetConfigs.map(widget => (
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
};

export default MobileLayout;
