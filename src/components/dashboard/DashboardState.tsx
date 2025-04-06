
import React from 'react';
import { useDashboardState, DashboardStateResult } from '@/hooks/use-dashboard-state';

export interface DashboardStateProps {
  focusMode?: boolean;
  children: (props: DashboardStateResult) => React.ReactNode;
}

const DashboardState: React.FC<DashboardStateProps> = ({ focusMode = false, children }) => {
  const dashboardState = useDashboardState(focusMode);
  return children(dashboardState);
};

export type { DashboardStateResult as DashboardStateData };
export default DashboardState;
