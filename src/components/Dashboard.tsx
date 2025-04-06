
import React from 'react';
import DashboardManager from './DashboardManager';

interface DashboardProps {
  focusMode?: boolean;
  searchQuery?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ focusMode = false, searchQuery }) => {
  return <DashboardManager focusMode={focusMode} />;
};

export default Dashboard;
