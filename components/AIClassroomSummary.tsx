import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { subject: '教学态度', A: 99, B: 95, C: 90, fullMark: 100 },
  { subject: '教学内容', A: 98, B: 90, C: 85, fullMark: 100 },
  { subject: '教学方法', A: 90, B: 85, C: 80, fullMark: 100 },
  { subject: '课堂素养', A: 95, B: 88, C: 82, fullMark: 100 },
  { subject: '课堂效果', A: 96, B: 92, C: 88, fullMark: 100 },
];

export const AIClassroomSummary: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-br from-[#4f46e5] to-[#3b82f6] p-8 text-white flex flex-col lg:flex-row gap-10 items-center relative overflow-hidden">
       {/* Background decoration */}
       <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-900 opacity-20 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl pointer-events-none"></div>

      {/* Left Text Content */}
      <div className="flex-1 space-y-6 z-10">
        <div className="flex items-baseline gap-3">
          <h2 className="text-3xl font-bold tracking-wide">AI总结:</h2>
          <span className="text-7xl font-bold text-white drop-shadow-md">96</span>
          <span className="text-2xl opacity-80 font-medium">分</span>
        </div>
        <p className="text-sm lg:text-[15px] leading-7 opacity-95 text-justify font-light tracking-wide border-t border-white/10 pt-6">
          本次课程的教学质量非常高，教师出勤准时，多次询问学生掌握情况，学生出勤率和前排就座率均为100%。教学内容详实，涵盖了人工智能的发展历程、核心理论、跨学科联系及前沿技术，特别是对知识驱动和数据驱动的区别进行了深入讲解。教学方法多样，教师多次对学生的汇报和回答进行深度评价反馈，并布置了明确的课后任务，提供了丰富的扩展资源。课堂素养方面，教师通过小组研讨和分享，有效培养了学生的审辩思维、表达能力和合作能力，同时强调了人工智能作为基本素养的重要性，培养了学生的专业认同感和国家自豪感。
        </p>
      </div>

      {/* Right Radar Chart */}
      <div className="w-full lg:w-[480px] h-[340px] relative z-10 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.2)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#fff', fontSize: 13, fontWeight: 500 }}
            />
            {/* School Average - Grey/Purple */}
            <Radar
              name="全校课程"
              dataKey="C"
              stroke="#a5b4fc" 
              strokeOpacity={0.6}
              fill="#a5b4fc"
              fillOpacity={0.1}
            />
            {/* This Course - Light Blue */}
            <Radar
              name="本课程"
              dataKey="B"
              stroke="#93c5fd"
              strokeOpacity={0.8}
              fill="#93c5fd"
              fillOpacity={0.2}
            />
            {/* This Lesson - Orange (Highlight) */}
            <Radar
              name="本课节"
              dataKey="A"
              stroke="#fb923c"
              strokeWidth={3}
              fill="#fb923c"
              fillOpacity={0.15}
              activeDot={{ r: 6, fill: '#fb923c', stroke: '#fff' }}
            />
            <Legend
               wrapperStyle={{ paddingTop: '10px', color: '#fff' }}
               iconType="circle"
               formatter={(value) => <span className="text-white/90 text-xs ml-1 mr-4 font-medium">{value}</span>}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};