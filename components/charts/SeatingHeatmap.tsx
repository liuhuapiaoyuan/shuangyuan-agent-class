import React from 'react';
import { STUDENT_SEATS } from '../../constants';

export const SeatingMasteryMap: React.FC = () => {
  const getColor = (status: string, score: number) => {
     if (status === 'at-risk') return `rgba(239, 68, 68, ${1})`; // Red
     if (status === 'passing') return `rgba(59, 130, 246, ${score/100})`; // Blue
     return `rgba(0, 205, 156, ${score/100})`; // Green
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="grid grid-cols-8 gap-2 mb-6">
        {STUDENT_SEATS.map((seat) => (
          <div
            key={seat.id}
            className="w-8 h-8 rounded-md transition-all duration-300 hover:scale-110 cursor-pointer flex items-center justify-center text-[8px] text-white font-medium shadow-sm"
            style={{ 
              backgroundColor: getColor(seat.status, seat.masteryScore)
            }}
            title={`${seat.name}: ${Math.round(seat.masteryScore)}分`}
          >
            {Math.round(seat.masteryScore)}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>掌握</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div>及格</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm"></div>待加强</div>
      </div>

      <div className="w-32 h-6 bg-gray-200 rounded-t-lg border-b-4 border-gray-300 text-[10px] flex items-center justify-center text-gray-400">讲台 (Teacher)</div>
    </div>
  );
};
