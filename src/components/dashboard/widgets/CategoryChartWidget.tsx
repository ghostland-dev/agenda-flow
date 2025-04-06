
import React from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface CategoryChartWidgetProps {
  stats?: any;
}

const CategoryChartWidget: React.FC<CategoryChartWidgetProps> = ({ stats }) => {
  if (!stats) return <p>Chargement...</p>;
  
  const categoryData = [
    { name: 'Travail', value: stats.categoryCounts.work || 0, color: '#5C6BC0' },
    { name: 'Personnel', value: stats.categoryCounts.personal || 0, color: '#26A69A' },
    { name: 'Santé', value: stats.categoryCounts.health || 0, color: '#EC407A' },
    { name: 'Finance', value: stats.categoryCounts.finance || 0, color: '#66BB6A' },
    { name: 'Apprentissage', value: stats.categoryCounts.learning || 0, color: '#7E57C2' },
    { name: 'Autre', value: stats.categoryCounts.other || 0, color: '#78909C' },
  ];
  
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={categoryData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Tâches" radius={[0, 4, 4, 0]}>
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChartWidget;
