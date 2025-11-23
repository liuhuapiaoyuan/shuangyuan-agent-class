import React from 'react';
import { Sun } from './Icons';

interface AIAnalysisBoxProps {
  content: string;
}

export const AIAnalysisBox: React.FC<AIAnalysisBoxProps> = ({ content }) => {
  return (
    <div className="mt-4 p-4 bg-seewo-light rounded-lg border border-emerald-100 flex gap-3">
      <div className="shrink-0 mt-0.5">
         <div className="flex items-center text-seewo-green font-bold text-sm mb-1">
            <Sun className="w-4 h-4 mr-1 animate-pulse" />
            AI 分析
         </div>
         <p className="text-gray-600 text-xs leading-relaxed text-justify">
            {content}
         </p>
      </div>
    </div>
  );
};