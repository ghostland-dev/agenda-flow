
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LayoutGrid, LayoutList, Plus, Settings } from 'lucide-react';
import { getAvailableWidgetTypes } from './widgetUtils';
import { WidgetConfig } from './widgetUtils';

interface WidgetControlsProps {
  widgetConfigs: WidgetConfig[];
  layout: 'grid' | 'list';
  isEditMode: boolean;
  onAddWidget: (type: string) => void;
  onToggleLayout: () => void;
  onToggleEditMode: () => void;
}

const WidgetControls: React.FC<WidgetControlsProps> = ({
  widgetConfigs,
  layout,
  isEditMode,
  onAddWidget,
  onToggleLayout,
  onToggleEditMode
}) => {
  const availableWidgets = getAvailableWidgetTypes().filter(
    w => !widgetConfigs.some(config => config.type === w.type && config.isVisible)
  );

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleLayout}
        className="h-8 w-8"
      >
        {layout === 'grid' ? (
          <LayoutList className="h-4 w-4" />
        ) : (
          <LayoutGrid className="h-4 w-4" />
        )}
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="h-8">
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un widget
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="space-y-1">
            {availableWidgets.length > 0 ? (
              availableWidgets.map(widget => (
                <Button
                  key={widget.type}
                  variant="ghost"
                  className="w-full justify-start text-sm h-8"
                  onClick={() => onAddWidget(widget.type)}
                >
                  {widget.label}
                </Button>
              ))
            ) : (
              <p className="text-xs text-muted-foreground p-2">
                Tous les widgets sont déjà visibles
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      <Button
        variant={isEditMode ? "default" : "outline"}
        size="sm"
        onClick={onToggleEditMode}
        className="h-8"
      >
        <Settings className="h-4 w-4 mr-1" />
        {isEditMode ? "Terminer" : "Personnaliser"}
      </Button>
    </div>
  );
};

export default WidgetControls;
