
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { KNOWLEDGE_POINTS } from '../../constants';

interface KnowledgeRadarChartProps {
  // Optional data to override default In-class data
  // Format: { subject: string, A: number, B?: number, fullMark: number }[]
  customData?: any[];
  compareMode?: boolean; // If true, shows two radar areas (e.g. Class Avg vs Student)
  legendLabels?: { A: string, B: string };
  className?: string;
}

export const KnowledgeRadarChart: React.FC<KnowledgeRadarChartProps> = ({ 
  customData, 
  compareMode = false,
  legendLabels = { A: '班级平均', B: '学生个人' },
  className = "h-72"
}) => {
  
  // Default Data (In-class Aggregate)
  const defaultData = KNOWLEDGE_POINTS.map((kp) => ({
    subject: kp.id,
    fullText: kp.statement,
    A: kp.masteryRate,
    fullMark: 100,
  }));

  const data = customData || defaultData;

  return (
    <div className={`${className} w-full relative`}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis 
             dataKey="subject" 
             tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          
          {/* Area A: Primary (e.g. Class Average or Post-test) */}
          <Radar
            name={legendLabels.A}
            dataKey="A"
            stroke="#00cd9c"
            strokeWidth={2}
            fill="#00cd9c"
            fillOpacity={compareMode ? 0.2 : 0.4}
          />

          {/* Area B: Secondary (e.g. Student Score or Pre-test) - Optional */}
          {compareMode && (
            <Radar
              name={legendLabels.B}
              dataKey="B"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="#3b82f6"
              fillOpacity={0.4}
            />
          )}

          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
             labelFormatter={(label) => {
                const kp = data.find((d: any) => d.subject === label);
                return kp && kp.fullText ? `${label}: ${kp.fullText.substring(0, 10)}...` : label;
             }}
          />
          {compareMode && <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />}
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Key for KPs */}
      {!compareMode && (
        <div className="absolute bottom-0 w-full flex justify-center">
           <div className="flex gap-4 text-xs text-gray-500">
              {data.map((d: any, i: number) => (
                 <div key={i} className="flex items-center gap-1">
                    <span className="font-bold text-seewo-green">{d.subject}</span>
                    <span className="text-gray-400 truncate max-w-[80px]">{d.fullText}</span>
                 </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};
