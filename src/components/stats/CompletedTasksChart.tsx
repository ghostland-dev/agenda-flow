
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CompletedTasksChartProps {
  data: {
    months: Array<{ name: string; value: number }>;
    weeks: Array<{ name: string; value: number }>;
  };
}

const CompletedTasksChart: React.FC<CompletedTasksChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tâches Terminées au Fil du Temps</CardTitle>
        <CardDescription>Nombre de tâches terminées par période</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="months" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="months">Par Mois</TabsTrigger>
            <TabsTrigger value="weeks">Par Semaine</TabsTrigger>
          </TabsList>
          
          <TabsContent value="months" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.months}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Tâches terminées" 
                  stroke="#5C6BC0" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="weeks" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.weeks}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Tâches terminées" 
                  stroke="#26A69A" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CompletedTasksChart;
