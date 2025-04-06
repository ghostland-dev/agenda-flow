
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Maximize, Minimize, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WidgetProps {
  id: string;
  title: string;
  description?: string;
  onRemove: (id: string) => void;
  onMaximize?: (id: string) => void;
  isMaximized?: boolean;
  className?: string;
  children: React.ReactNode;
}

const DashboardWidget: React.FC<WidgetProps> = ({
  id,
  title,
  description,
  onRemove,
  onMaximize,
  isMaximized,
  className,
  children
}) => {
  return (
    <Card className={cn("h-full transition-all hover:border-primary/20", className)}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-md font-medium flex items-center">
            <Move className="h-4 w-4 mr-2 text-muted-foreground drag-handle cursor-move" />
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="flex items-center gap-1">
          {onMaximize && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => onMaximize(id)}
            >
              {isMaximized ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-destructive hover:bg-destructive/10" 
            onClick={() => onRemove(id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 h-[calc(100%-48px)] overflow-auto">
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardWidget;
