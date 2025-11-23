import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { SCORE_DISTRIBUTION_DATA } from '../../constants';

export const ScoreDistributionChart: React.FC = () => {
  return (
    <div className="h-64 w-full relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={SCORE_DISTRIBUTION_DATA}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {SCORE_DISTRIBUTION_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
         <span className="text-3xl font-bold text-gray-800">48</span>
         <span className="text-xs text-gray-500">实考人数</span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-0 w-full flex flex-wrap justify-center gap-3 text-xs px-2">
         {SCORE_DISTRIBUTION_DATA.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1">
               <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
               <span className="text-gray-500">{item.name}</span>
            </div>
         ))}
      </div>
    </div>
  );
};
