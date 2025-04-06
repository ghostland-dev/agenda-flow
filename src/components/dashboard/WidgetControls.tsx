
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LayoutGrid, LayoutList, Plus, Settings, ChevronDown } from 'lucide-react';
import { getAvailableWidgetTypes } from './widgetUtils';
import { WidgetConfig } from './widgetUtils';
import { Badge } from '@/components/ui/badge';

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

  const visibleWidgetsCount = widgetConfigs.filter(w => w.isVisible).length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleLayout}
        className="h-9 px-3"
      >
        {layout === 'grid' ? (
          <>
            <LayoutGrid className="h-4 w-4 mr-2" />
            Grille
          </>
        ) : (
          <>
            <LayoutList className="h-4 w-4 mr-2" />
            Liste
          </>
        )}
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="h-9">
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un widget
            <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <h4 className="text-sm font-medium mb-2 px-2">Widgets disponibles</h4>
          <div className="space-y-1 max-h-[300px] overflow-y-auto">
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
        className="h-9"
      >
        <Settings className="h-4 w-4 mr-1" />
        {isEditMode ? "Terminer" : "Personnaliser"}
      </Button>
      
      <Badge variant="outline" className="ml-2">
        {visibleWidgetsCount} widget{visibleWidgetsCount > 1 ? 's' : ''} visible{visibleWidgetsCount > 1 ? 's' : ''}
      </Badge>
    </div>
  );
};

export default WidgetControls;
