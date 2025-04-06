
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Maximize, Minimize, Move, Settings, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface WidgetProps {
  id: string;
  title: string;
  description?: string;
  onRemove: (id: string) => void;
  onMaximize?: (id: string) => void;
  onRefresh?: (id: string) => void;
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
  onRefresh,
  isMaximized,
  className,
  children
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) {
      onRefresh(id);
    }
    // Simulation du rafraîchissement
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <Card className={cn("h-full transition-all duration-300 hover:border-primary/20 overflow-hidden", 
      isMaximized && "fixed top-0 left-0 right-0 bottom-0 z-50 m-4 rounded-lg shadow-2xl",
      className)}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0 bg-card/60">
        <div className="space-y-1 flex items-center">
          <Move className="h-4 w-4 mr-2 text-muted-foreground drag-handle cursor-move" />
          <div>
            <CardTitle className="text-md font-medium">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-7 w-7", isRefreshing && "animate-spin")} 
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onMaximize && (
                <DropdownMenuItem onClick={() => onMaximize(id)}>
                  {isMaximized ? (
                    <>
                      <Minimize className="h-4 w-4 mr-2" />
                      Réduire
                    </>
                  ) : (
                    <>
                      <Maximize className="h-4 w-4 mr-2" />
                      Agrandir
                    </>
                  )}
                </DropdownMenuItem>
              )}
              {onRefresh && (
                <DropdownMenuItem onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onRemove(id)}
                className="text-destructive focus:text-destructive"
              >
                <X className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className={cn(
        "p-4 pt-2 h-[calc(100%-48px)] overflow-auto",
        isRefreshing && "opacity-60"
      )}>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardWidget;
