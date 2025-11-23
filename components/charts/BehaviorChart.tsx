import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KNOWLEDGE_POINTS } from '../../constants';

export const KnowledgeBarChart: React.FC = () => {
  // Transform data for chart
  const data = KNOWLEDGE_POINTS.map((kp, index) => ({
    name: `知识点 ${index + 1}`,
    fullText: kp.statement,
    value: kp.masteryRate,
    color: kp.masteryRate > 80 ? '#00cd9c' : (kp.masteryRate > 60 ? '#eab308' : '#ef4444')
  }));

  return (
    <div className="h-64 w-full relative">
       <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            tick={{ fontSize: 12, fill: '#666', fontWeight: 600 }} 
            width={60}
          />
          <Tooltip 
             cursor={{ fill: 'transparent' }}
             content={({ active, payload }) => {
               if (active && payload && payload.length) {
                 const data = payload[0].payload;
                 return (
                   <div className="bg-white p-3 shadow-xl rounded-lg border border-gray-100 max-w-[200px]">
                     <p className="text-xs text-gray-500 mb-1">{data.name}</p>
                     <p className="text-sm font-bold text-gray-800 mb-2">{data.value}% 掌握率</p>
                     <p className="text-xs text-gray-600 leading-tight">{data.fullText}</p>
                   </div>
                 );
               }
               return null;
             }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
