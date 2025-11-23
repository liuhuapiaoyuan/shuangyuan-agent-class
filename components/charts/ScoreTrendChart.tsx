
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SCORE_TREND_DATA } from '../../constants';

export const ScoreTrendChart: React.FC = () => {
  return (
    <div className="h-64 w-full relative">
       <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={SCORE_TREND_DATA}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorClass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00cd9c" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#00cd9c" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorGrade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#666' }} 
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#999' }} 
            axisLine={false}
            tickLine={false}
            domain={[60, 100]}
          />
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend 
             verticalAlign="top" 
             height={36} 
             iconType="circle"
             wrapperStyle={{ fontSize: '12px' }}
          />
          <Area 
            type="monotone" 
            dataKey="gradeAvg" 
            name="年级平均"
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorGrade)" 
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Area 
            type="monotone" 
            dataKey="classAvg" 
            name="本班平均"
            stroke="#00cd9c" 
            fillOpacity={1} 
            fill="url(#colorClass)" 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
