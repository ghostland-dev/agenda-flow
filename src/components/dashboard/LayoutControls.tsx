
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, LayoutList, GripHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LayoutControlsProps {
  layout: 'grid' | 'list';
  widgetsPerRow: number;
  onToggleLayout: () => void;
  onChangeWidgetsPerRow: (count: number) => void;
}

const LayoutControls: React.FC<LayoutControlsProps> = ({
  layout,
  widgetsPerRow = 3,
  onToggleLayout,
  onChangeWidgetsPerRow
}) => {
  // Add a fallback default value in case widgetsPerRow is undefined
  const safeWidgetsPerRow = widgetsPerRow || 3;
  
  return (
    <div className="flex items-center gap-2">
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
      
      {layout === 'grid' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroup 
                type="single" 
                value={safeWidgetsPerRow.toString()} 
                onValueChange={(value) => {
                  if (value) onChangeWidgetsPerRow(parseInt(value, 10));
                }}
                className="border rounded-md"
              >
                <ToggleGroupItem value="2" aria-label="2 widgets par ligne" className="px-3 py-1">
                  <GripHorizontal className="h-4 w-4 mr-1" />
                  2
                </ToggleGroupItem>
                <ToggleGroupItem value="3" aria-label="3 widgets par ligne" className="px-3 py-1">
                  <GripHorizontal className="h-4 w-4 mr-1" />
                  3
                </ToggleGroupItem>
                <ToggleGroupItem value="4" aria-label="4 widgets par ligne" className="px-3 py-1">
                  <GripHorizontal className="h-4 w-4 mr-1" />
                  4
                </ToggleGroupItem>
              </ToggleGroup>
            </TooltipTrigger>
            <TooltipContent>
              <p>Widgets par ligne</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default LayoutControls;
