
import React, { useState } from 'react';
import { Header } from './components/Header';
import { 
  PRE_CLASS_METRICS, PRE_CLASS_ANALYSIS, IN_CLASS_ANALYSIS, 
  OVERALL_SUMMARY, REPORT_DETAILS, PRE_CLASS_STUDENT_RESULTS, 
  KNOWLEDGE_POINTS, IMPROVED_STUDENTS 
} from './constants';
import { StudentResult } from './types';
import { AIAnalysisBox } from './components/ui/AIAnalysisBox';
import { KnowledgeRadarChart } from './components/charts/KnowledgeRadarChart';
import { ScoreDistributionChart } from './components/charts/ResponseDonutChart';
import { ScoreTrendChart } from './components/charts/ScoreTrendChart';
import { SeatingMasteryMap } from './components/charts/SeatingHeatmap';
import { QuizTimeline } from './components/Timeline';
import { HomeworkGenerator } from './components/HomeworkGenerator';
import { PreparationStudio } from './components/PreparationStudio';
import { StudentDetailModal } from './components/StudentDetailModal';
import { AIClassroomSummary } from './components/AIClassroomSummary';
import { StudentCenter } from './components/StudentCenter';
import { 
  FileText, LayoutDashboard, Presentation, CheckCircle, Users, Sparkles,
  TrendingUp, Target, AlertCircle, Brain
} from './components/ui/Icons';

type ViewMode = 'teacher' | 'student';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('teacher');
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [isPreparationOpen, setIsPreparationOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);

  // Prepare data for Pre-class radar (Aggregate)
  // Calculate averages from student results
  const preClassAvgKP: Record<string, number> = {};
  KNOWLEDGE_POINTS.forEach(kp => {
    const sum = PRE_CLASS_STUDENT_RESULTS.reduce((acc, s) => acc + (s.kpMastery[kp.id] || 0), 0);
    preClassAvgKP[kp.id] = Math.round(sum / PRE_CLASS_STUDENT_RESULTS.length);
  });

  const preClassRadarData = KNOWLEDGE_POINTS.map(kp => ({
    subject: kp.id,
    fullText: kp.statement,
    A: preClassAvgKP[kp.id],
    fullMark: 100
  }));

  // Student Center View
  if (viewMode === 'student') {
    return (
      <>
        <Header 
          onOpenPreparation={() => {}} 
          viewMode={viewMode} 
          onSwitchRole={() => setViewMode('teacher')} 
        />
        <StudentCenter onLogout={() => setViewMode('teacher')} />
      </>
    );
  }

  // Teacher Dashboard View
  return (
    <div className="min-h-screen bg-[#f5f7fa] pb-12">
      <Header 
        onOpenPreparation={() => setIsPreparationOpen(true)} 
        viewMode={viewMode}
        onSwitchRole={() => setViewMode('student')}
      />

      <main className="p-6 max-w-[1400px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end">
           <div>
              <h1 className="text-2xl font-bold text-gray-800">沉淀溶解平衡 - 随堂测验分析</h1>
              <p className="text-sm text-gray-500 mt-1">班级: 高二(3)班 | 教师: 王老师 | 日期: 2023-10-24</p>
           </div>
        </div>

        {/* SECTION 1: PRE-CLASS ANALYSIS (堂前分析) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
             <h2 className="text-lg font-bold text-gray-800">1. 堂前学情分析</h2>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             {/* Top Row: Metrics & AI */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                {PRE_CLASS_METRICS.map((metric, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm
                        ${metric.status === 'good' ? 'bg-emerald-400' : (metric.status === 'warning' ? 'bg-orange-400' : 'bg-gray-400')}
                     `}>
                        {idx + 1}
                     </div>
                     <div>
                        <div className="text-sm text-gray-500">{metric.label}</div>
                        <div className="text-2xl font-bold text-gray-800">{metric.value}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{metric.subtext}</div>
                     </div>
                  </div>
                ))}
             </div>
             
             <AIAnalysisBox content={PRE_CLASS_ANALYSIS} />

             {/* Bottom Row: Knowledge Radar & Student Grid */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Radar */}
                <div className="border border-gray-100 rounded-xl p-4">
                   <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <Brain className="w-4 h-4" /> 课前知识掌握情况 (平均)
                   </h3>
                   <KnowledgeRadarChart customData={preClassRadarData} />
                </div>
                
                {/* Student Grid */}
                <div className="border border-gray-100 rounded-xl p-4 flex flex-col">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-700 flex items-center gap-2">
                         <Users className="w-4 h-4" /> 学生完成情况
                      </h3>
                      <span className="text-xs text-gray-400">点击学生查看详情</span>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto max-h-[300px] pr-1">
                      <div className="grid grid-cols-6 gap-2">
                         {PRE_CLASS_STUDENT_RESULTS.map(student => (
                            <button 
                               key={student.id}
                               onClick={() => setSelectedStudent(student)}
                               className={`
                                 p-2 rounded-lg text-center border transition-all hover:scale-105
                                 ${student.status === 'mastered' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 
                                   student.status === 'passing' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-red-50 border-red-100 text-red-700'}
                               `}
                            >
                               <div className="text-xs font-bold mb-1">{student.name}</div>
                               <div className="text-[10px] opacity-80">{student.masteryScore}分</div>
                            </button>
                         ))}
                      </div>
                   </div>
                   <div className="mt-3 flex gap-4 text-xs text-gray-400 justify-center">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full"></span> 优秀</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full"></span> 及格</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full"></span> 需关注</span>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* SECTION 2: IN-CLASS ANALYSIS (课中测验实况 & 趋势) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
             <h2 className="text-lg font-bold text-gray-800">2. 课中测验实况</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Left: Timeline of Questions */}
             <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                   <Presentation className="w-4 h-4" /> 测验题目流
                </h3>
                <QuizTimeline />
             </div>

             {/* Right: Charts (Trend & Distribution) */}
             <div className="space-y-6">
                {/* Score Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                       <TrendingUp className="w-4 h-4" /> 分数成长对比
                    </h3>
                    <ScoreTrendChart />
                </div>

                {/* Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                   <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> 本次成绩分布
                   </h3>
                   <ScoreDistributionChart />
                </div>
             </div>
          </div>
          
          <AIAnalysisBox content={IN_CLASS_ANALYSIS} />
        </section>

        {/* SECTION 3: KNOWLEDGE MASTERY (课中 - 知识点掌握 Radar) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
             <h2 className="text-lg font-bold text-gray-800">3. 课堂知识点掌握情况</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Knowledge Radar (In-class) */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                   <Target className="w-4 h-4" /> 知识点掌握雷达 (课中)
                </h3>
                <KnowledgeRadarChart /> 
                <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-500 leading-relaxed">
                   <strong className="text-gray-700">分析：</strong> 经过课堂教学，KP2(计算)掌握率相比课前有显著提升。但KP3(应用)仍需通过课后作业巩固。
                </div>
             </div>

             {/* Seating Map / At Risk Students */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-700 flex items-center gap-2">
                      <Users className="w-4 h-4" /> 课中实时掌握分布
                   </h3>
                   <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded border border-red-100">
                      需关注: 5人
                   </span>
                </div>
                <SeatingMasteryMap />
             </div>
          </div>
        </section>

        {/* SECTION 4: STUDENT GROWTH HIGHLIGHTS (New) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1 h-6 bg-pink-500 rounded-full"></div>
             <h2 className="text-lg font-bold text-gray-800">4. 课堂成长之星</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {IMPROVED_STUDENTS.map(student => (
              <div key={student.id} className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
                  {/* Badge */}
                  <div className="absolute top-0 right-0 bg-gradient-to-bl from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-sm">
                    +{student.growth}分
                  </div>
                  
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <img 
                          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${student.avatarSeed}`} 
                          alt="avatar" 
                          className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="font-bold text-gray-800 text-lg">{student.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded">课前 {student.preScore}</span>
                          <TrendingUp className="w-3 h-3 text-red-500"/>
                          <span className="bg-seewo-light text-seewo-green px-1.5 py-0.5 rounded font-bold">课后 {student.postScore}</span>
                        </div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="h-44 -ml-2 -mr-2">
                    <KnowledgeRadarChart 
                        customData={student.radarData} 
                        compareMode={true} 
                        legendLabels={{A: '课后', B: '课前'}}
                        className="h-full"
                    />
                  </div>

                  {/* AI Comment */}
                  <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100 text-xs text-gray-600 relative">
                    <div className="absolute -top-2.5 -left-1 bg-white rounded-full p-1 shadow-sm border border-purple-100">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                    </div>
                    <span className="font-bold text-purple-700 block mb-1 pl-5">AI 评语:</span>
                    <p className="leading-relaxed text-justify">{student.aiComment}</p>
                  </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: COMPREHENSIVE REPORT (完善的报告) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
             <h2 className="text-lg font-bold text-gray-800">5. 课堂综合诊断报告</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             {/* Report Header - REPLACED WITH AI CLASSROOM SUMMARY */}
             <AIClassroomSummary />

             {/* Report Details Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x divide-gray-100">
                
                {/* Strengths */}
                <div className="p-6">
                   <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4">
                      <CheckCircle className="w-5 h-5" /> 核心亮点
                   </div>
                   <ul className="space-y-3">
                      {REPORT_DETAILS.strengths.map((item, i) => (
                         <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0"></span>
                            {item}
                         </li>
                      ))}
                   </ul>
                </div>

                {/* Weaknesses */}
                <div className="p-6 bg-orange-50/30">
                   <div className="flex items-center gap-2 text-orange-500 font-bold mb-4">
                      <AlertCircle className="w-5 h-5" /> 待改进点
                   </div>
                   <ul className="space-y-3">
                      {REPORT_DETAILS.weaknesses.map((item, i) => (
                         <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 shrink-0"></span>
                            {item}
                         </li>
                      ))}
                   </ul>
                </div>

                {/* Strategies */}
                <div className="p-6">
                   <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
                      <Brain className="w-5 h-5" /> 干预策略
                   </div>
                   <ul className="space-y-3">
                      {REPORT_DETAILS.strategies.map((item, i) => (
                         <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                               {i+1}
                            </div>
                            {item}
                         </li>
                      ))}
                   </ul>
                </div>
             </div>

             {/* Actions */}
             <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                <button 
                  onClick={() => setIsHomeworkModalOpen(true)}
                  className="px-6 py-2 bg-white border border-emerald-200 text-seewo-green rounded-lg text-sm font-bold hover:bg-emerald-50 transition-all shadow-sm flex items-center gap-2"
                >
                   <Sparkles className="w-4 h-4" />
                   生成针对性作业
                </button>
                <button className="px-6 py-2 bg-seewo-green text-white rounded-lg text-sm font-bold hover:bg-seewo-dark transition-colors shadow-md shadow-emerald-100 flex items-center gap-2">
                   <FileText className="w-4 h-4" />
                   导出完整报告 PDF
                </button>
             </div>
          </div>
        </section>
      </main>

      {/* MODAL COMPONENTS */}
      <HomeworkGenerator 
        isOpen={isHomeworkModalOpen} 
        onClose={() => setIsHomeworkModalOpen(false)} 
      />

      <PreparationStudio
        isOpen={isPreparationOpen}
        onClose={() => setIsPreparationOpen(false)}
      />

      <StudentDetailModal 
        isOpen={!!selectedStudent}
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        avgData={preClassAvgKP}
      />
    </div>
  );
};

export default App;
