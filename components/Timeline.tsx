import React from 'react';
import { IN_CLASS_QUESTIONS } from '../constants';
import { ChevronRight, CheckCircle, XCircle, AlertCircle } from './ui/Icons';

export const QuizTimeline: React.FC = () => {
  return (
    <div className="space-y-6 pl-2 relative">
       {/* Vertical Line */}
       <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gray-200"></div>

      {IN_CLASS_QUESTIONS.map((q, idx) => (
        <div key={q.id} className="relative pl-8 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
          {/* Dot/Icon */}
          <div className={`absolute left-0 top-4 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 flex items-center justify-center
             ${q.correctRate > 80 ? 'bg-emerald-500' : (q.correctRate > 60 ? 'bg-yellow-500' : 'bg-red-500')}
          `}>
          </div>
          
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded border border-gray-200 font-medium uppercase">
                    {q.type === 'calculation' ? '计算' : (q.type === 'reasoning' ? '原理' : '应用')}
                </span>
                <span className="text-xs text-gray-400 font-medium">Question {idx + 1}</span>
             </div>
             <button className="text-xs text-seewo-green flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                题目详情 <ChevronRight className="w-3 h-3" />
             </button>
          </div>
          
          <p className="text-sm text-gray-800 mt-2 mb-3 font-medium leading-snug">
             {q.content}
          </p>
          
          <div className="flex items-center gap-6 bg-gray-50 p-2 rounded border border-gray-100">
             <div className="flex flex-col">
                <span className="text-[10px] text-gray-400">正确率</span>
                <span className={`text-sm font-bold ${q.correctRate < 65 ? 'text-red-500' : 'text-gray-700'}`}>
                    {q.correctRate}%
                </span>
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] text-gray-400">平均用时</span>
                <span className="text-sm font-bold text-gray-700">{q.avgTime}s</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] text-gray-400">关联知识</span>
                <span className="text-xs text-blue-600">{q.relatedKnowledgeId}</span>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};
