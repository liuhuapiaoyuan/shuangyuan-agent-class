
import React from 'react';
import { XCircle, User, Award, TrendingUp } from './ui/Icons';
import { StudentResult } from '../types';
import { KnowledgeRadarChart } from './charts/KnowledgeRadarChart';
import { Badge } from './ui/Badge';
import { KNOWLEDGE_POINTS } from '../constants';

interface StudentDetailModalProps {
  student: StudentResult | null;
  isOpen: boolean;
  onClose: () => void;
  avgData?: Record<string, number>; // KP ID -> Avg Score
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, isOpen, onClose, avgData }) => {
  if (!isOpen || !student) return null;

  // Prepare data for radar chart comparison
  const chartData = KNOWLEDGE_POINTS.map(kp => ({
    subject: kp.id,
    fullText: kp.statement,
    fullMark: 100,
    A: avgData ? avgData[kp.id] || 75 : 75, // Class Avg
    B: student.kpMastery[kp.id] || 0       // Student Score
  }));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center text-2xl font-bold text-gray-400">
               <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                 {student.name}
                 <Badge className={`
                    ${student.status === 'mastered' ? 'bg-emerald-100 text-emerald-600' : 
                      student.status === 'passing' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}
                 `}>
                    {student.status === 'mastered' ? '优秀' : student.status === 'passing' ? '及格' : '需关注'}
                 </Badge>
              </h2>
              <p className="text-sm text-gray-500 mt-1">学号: 20230{student.id + 100}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XCircle className="w-8 h-8" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col md:flex-row gap-8">
           
           {/* Left: Score & Stats */}
           <div className="w-full md:w-1/3 space-y-6">
              <div className="bg-seewo-light/30 p-4 rounded-xl border border-emerald-100 text-center">
                 <div className="text-sm text-gray-500 mb-1">综合得分</div>
                 <div className="text-4xl font-bold text-seewo-green">{student.preClassScore}</div>
                 <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 mt-2 font-medium">
                    <Award className="w-3 h-3" /> 击败了 78% 的同学
                 </div>
              </div>
              
              <div className="space-y-3">
                 <h4 className="font-bold text-gray-700 text-sm">知识点详情</h4>
                 {KNOWLEDGE_POINTS.map(kp => (
                   <div key={kp.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{kp.id}</span>
                      <div className="flex-1 mx-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                         <div 
                           className={`h-full rounded-full ${student.kpMastery[kp.id] >= 80 ? 'bg-emerald-400' : 'bg-yellow-400'}`} 
                           style={{ width: `${student.kpMastery[kp.id]}%` }}
                         ></div>
                      </div>
                      <span className="font-bold text-gray-700">{student.kpMastery[kp.id]}%</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Right: Radar Chart */}
           <div className="w-full md:w-2/3 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                 <TrendingUp className="w-4 h-4" /> 个人 vs 班级平均
              </h4>
              <KnowledgeRadarChart 
                customData={chartData} 
                compareMode={true}
                legendLabels={{ A: '班级平均', B: '学生个人' }}
              />
              <p className="text-xs text-gray-400 mt-2 text-center">
                 蓝色区域为该学生掌握情况，绿色边框为班级平均水平
              </p>
           </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
           <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              关闭
           </button>
        </div>
      </div>
    </div>
  );
};