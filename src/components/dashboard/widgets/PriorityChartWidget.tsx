
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PriorityChartWidgetProps {
  stats?: any;
}

const PriorityChartWidget: React.FC<PriorityChartWidgetProps> = ({ stats }) => {
  if (!stats) return <p>Chargement...</p>;
  
  const priorityData = [
    { name: 'Haute', value: stats.priorityCounts.high || 0, color: '#FF5252' },
    { name: 'Moyenne', value: stats.priorityCounts.medium || 0, color: '#FFCA28' },
    { name: 'Basse', value: stats.priorityCounts.low || 0, color: '#4CAF50' },
  ];
  
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={priorityData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {priorityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [value, name]} 
            labelFormatter={() => ''} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriorityChartWidget;
