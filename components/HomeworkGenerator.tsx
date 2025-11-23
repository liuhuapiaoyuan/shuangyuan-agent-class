
import React, { useState, useEffect, useRef } from 'react';
import { XCircle, CheckCircle, FileText, Sparkles, Brain, ChevronRight, Loader2 } from 'lucide-react';
import { STUDENT_SEATS, HOMEWORK_POOL } from '../constants';
import { StudentHomework, HomeworkQuestion } from '../types';
import { Badge } from './ui/Badge';

interface HomeworkGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HomeworkGenerator: React.FC<HomeworkGeneratorProps> = ({ isOpen, onClose }) => {
  const [generatedData, setGeneratedData] = useState<Map<number, StudentHomework>>(new Map());
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentHomework | null>(null);
  
  // Animation refs
  const generationInterval = useRef<number | null>(null);

  // Logic to select questions based on mastery
  const generateForStudent = (studentId: number): StudentHomework => {
    const student = STUDENT_SEATS.find(s => s.id === studentId)!;
    let questions: HomeworkQuestion[] = [];
    let comment = "";

    if (student.status === 'at-risk') {
      // Give Basics
      questions = HOMEWORK_POOL.filter(q => q.difficulty === '基础巩固').slice(0, 3);
      comment = "检测到基础薄弱，重点加强沉淀溶解平衡定义的理解和基础 Ksp 表达式书写。";
    } else if (student.status === 'passing') {
      // Mix Basic and Intermediate
      questions = [
        ...HOMEWORK_POOL.filter(q => q.difficulty === '基础巩固').slice(0, 1),
        ...HOMEWORK_POOL.filter(q => q.difficulty === '能力提升').slice(0, 2)
      ];
      comment = "基础较好，建议加强溶度积规则的应用计算，并尝试解释生活中的化学现象。";
    } else {
      // Advanced
      questions = [
        ...HOMEWORK_POOL.filter(q => q.difficulty === '能力提升').slice(0, 1),
        ...HOMEWORK_POOL.filter(q => q.difficulty === '拓展探究')
      ];
      comment = "掌握情况优秀，推荐挑战沉淀转化与综合平衡移动的复杂计算题。";
    }

    return {
      studentId: student.id,
      studentName: student.name,
      questions,
      aiComment: comment
    };
  };

  useEffect(() => {
    if (isOpen && !isComplete) {
      // Reset state on open
      setGeneratedData(new Map());
      setProgress(0);
      setSelectedStudent(null);
      
      let currentIdx = 0;
      const totalStudents = STUDENT_SEATS.length;

      generationInterval.current = window.setInterval(() => {
        if (currentIdx >= totalStudents) {
          if (generationInterval.current) clearInterval(generationInterval.current);
          setIsComplete(true);
          return;
        }

        const student = STUDENT_SEATS[currentIdx];
        const homework = generateForStudent(student.id);
        
        setGeneratedData(prev => {
          const newMap = new Map(prev);
          newMap.set(student.id, homework);
          return newMap;
        });
        
        currentIdx++;
        setProgress(Math.round((currentIdx / totalStudents) * 100));

      }, 50); // Speed of generation
    }

    return () => {
      if (generationInterval.current) clearInterval(generationInterval.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
      
      {/* Main Modal Container */}
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-gray-50">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-seewo-light rounded-lg text-seewo-green">
               <Sparkles className="w-5 h-5" />
             </div>
             <div>
               <h2 className="text-lg font-bold text-gray-800">AI 个性化作业生成引擎</h2>
               <p className="text-xs text-gray-500">基于课堂测验数据 • 知识点图谱关联</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel: Class Grid Visualization */}
          <div className={`flex-1 p-6 overflow-y-auto transition-all duration-500 ${selectedStudent ? 'w-1/2' : 'w-full'}`}>
            
            {/* Progress Bar */}
            <div className="mb-8">
               <div className="flex justify-between text-sm font-medium mb-2 text-gray-600">
                  <span>{isComplete ? '生成完毕' : '正在分析学生知识盲区...'}</span>
                  <span>{progress}%</span>
               </div>
               <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-seewo-green to-emerald-400 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
               </div>
            </div>

            {/* Student Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
               {STUDENT_SEATS.map((seat) => {
                 const isGenerated = generatedData.has(seat.id);
                 const isSelected = selectedStudent?.studentId === seat.id;
                 
                 return (
                   <div 
                     key={seat.id}
                     onClick={() => isGenerated && setSelectedStudent(generatedData.get(seat.id)!)}
                     className={`
                       aspect-square rounded-xl flex flex-col items-center justify-center text-xs cursor-pointer transition-all duration-300 border-2 relative group
                       ${isSelected 
                          ? 'border-seewo-green bg-emerald-50 scale-110 shadow-lg z-10' 
                          : (isGenerated 
                              ? 'border-transparent bg-gray-50 hover:bg-white hover:shadow-md hover:scale-105' 
                              : 'border-gray-100 bg-gray-50 opacity-50')
                       }
                     `}
                   >
                     {isGenerated ? (
                       <>
                         <div className={`w-2 h-2 rounded-full absolute top-2 right-2 ${
                           seat.status === 'at-risk' ? 'bg-red-400' : (seat.status === 'passing' ? 'bg-blue-400' : 'bg-emerald-400')
                         }`}></div>
                         <span className="font-bold text-gray-700 text-lg">{seat.id + 1}</span>
                         <span className="text-[10px] text-gray-400 scale-90">{seat.name}</span>
                         <div className="absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <FileText className="w-4 h-4 text-seewo-green" />
                         </div>
                       </>
                     ) : (
                       <Loader2 className="w-4 h-4 animate-spin text-gray-300" />
                     )}
                   </div>
                 )
               })}
            </div>
          </div>

          {/* Right Panel: Detail View (Sliding Panel) */}
          {selectedStudent && (
            <div className="w-[400px] md:w-[450px] border-l border-gray-200 bg-white shadow-xl overflow-y-auto p-6 animate-in slide-in-from-right duration-300">
               <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedStudent.studentName} 的作业方案</h3>
                    <Badge className={`mt-2 ${
                      selectedStudent.questions[0].difficulty === '基础巩固' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {selectedStudent.questions[0].difficulty === '基础巩固' ? '基础强化型' : '能力拓展型'}
                    </Badge>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-400">
                     {selectedStudent.studentId + 1}
                  </div>
               </div>

               <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-2">
                     <Brain className="w-4 h-4" /> AI 诊断建议
                  </div>
                  <p className="text-sm text-blue-900 leading-relaxed">
                     {selectedStudent.aiComment}
                  </p>
               </div>

               <div className="space-y-4">
                  <h4 className="font-bold text-gray-700 flex items-center gap-2">
                     <FileText className="w-4 h-4" /> 推荐题目 ({selectedStudent.questions.length})
                  </h4>
                  
                  {selectedStudent.questions.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-lg border border-gray-200 hover:border-seewo-green hover:bg-seewo-light/20 transition-colors group">
                       <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded border ${
                             q.difficulty === '基础巩固' ? 'bg-gray-100 border-gray-200 text-gray-600' : 
                             (q.difficulty === '能力提升' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-purple-50 border-purple-100 text-purple-600')
                          }`}>
                             {q.difficulty}
                          </span>
                          <span className="text-xs text-gray-400">{q.type}</span>
                       </div>
                       <p className="text-sm text-gray-800 leading-snug font-medium">
                          {idx + 1}. {q.content}
                       </p>
                       <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-xs text-seewo-green font-medium flex items-center gap-1 hover:underline">
                             查看解析 <ChevronRight className="w-3 h-3" />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-8 pt-6 border-t border-gray-100">
                  <button className="w-full py-3 bg-seewo-green text-white rounded-lg font-medium hover:bg-seewo-dark shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2">
                     <CheckCircle className="w-4 h-4" /> 确认并推送作业
                  </button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
