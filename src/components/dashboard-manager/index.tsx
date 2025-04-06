
import React from 'react';
import { DashboardManagerProvider } from './DashboardManagerProvider';
import DashboardManagerView from './DashboardManagerView';

interface DashboardManagerProps {
  focusMode?: boolean;
  searchQuery?: string;
}

const DashboardManager: React.FC<DashboardManagerProps> = ({ focusMode = false, searchQuery }) => {
  return (
    <DashboardManagerProvider focusMode={focusMode}>
      <DashboardManagerView searchQuery={searchQuery} />
    </DashboardManagerProvider>
  );
};

export default DashboardManager;
