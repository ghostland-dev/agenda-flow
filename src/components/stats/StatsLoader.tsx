
import React from 'react';

const StatsLoader: React.FC = () => {
  return (
    <div className="container py-8">
      <div className="text-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Chargement des statistiques...</p>
      </div>
    </div>
  );
};

export default StatsLoader;
