
import React, { useState } from 'react';
import { 
  BookOpen, Video, FileText, Camera, CheckCircle, 
  ArrowLeft, Sparkles, Brain, Clock, Calendar, 
  User, Activity, ChevronRight, LogOut, Loader2, Play, Award,
  FileDown, UploadCloud, RefreshCcw, Layers, Target
} from './ui/Icons';
import { StudentCourse } from '../types';
import { KnowledgeRadarChart } from './charts/KnowledgeRadarChart';
import { AIAnalysisBox } from './ui/AIAnalysisBox';
import { Badge } from './ui/Badge';

interface StudentCenterProps {
  onLogout: () => void;
}

const MOCK_COURSES: StudentCourse[] = [
  {
    id: 'c1',
    title: '第三章 函数与方程',
    teacher: '王老师',
    time: '今天 10:00 - 10:45',
    status: 'ongoing',
    progress: 45
  },
  {
    id: 'c2',
    title: '沉淀溶解平衡原理及应用',
    teacher: '李老师',
    time: '明天 09:00 - 09:45',
    status: 'upcoming',
    progress: 0
  },
  {
    id: 'c3',
    title: '化学反应速率与平衡',
    teacher: '张老师',
    time: '2023-10-20',
    status: 'completed',
    progress: 100
  }
];

// Mock Data for Post-class Questions
const POST_CLASS_QUESTIONS = [
  { id: 1, type: '选择题', content: '下列关于 Ksp 的说法正确的是？', difficulty: '基础' },
  { id: 2, type: '计算题', content: '计算 25℃ 时 BaSO4 在 0.01mol/L Na2SO4 溶液中的溶解度。', difficulty: '提升' },
  { id: 3, type: '简答题', content: '请解释为何龋齿的形成与沉淀溶解平衡有关？', difficulty: '拓展' }
];

export const StudentCenter: React.FC<StudentCenterProps> = ({ onLogout }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  // States for the detail view
  const [previewStatus, setPreviewStatus] = useState<'pending' | 'uploading' | 'submitted'>('pending');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [postStatus, setPostStatus] = useState<'pending' | 'uploading' | 'submitted'>('pending');
  const [postImage, setPostImage] = useState<string | null>(null);
  
  const [compareMode, setCompareMode] = useState<'student' | 'ai'>('student');

  const selectedCourse = MOCK_COURSES.find(c => c.id === selectedCourseId);

  // Handlers
  const handleUploadPreview = () => {
    setPreviewStatus('uploading');
    setTimeout(() => {
      setPreviewStatus('submitted');
      setPreviewImage('https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'); 
    }, 1500);
  };

  const handleUploadPost = () => {
    setPostStatus('uploading');
    setTimeout(() => {
      setPostStatus('submitted');
      setPostImage('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80');
    }, 2000);
  };

  const handleExportWord = () => {
    alert("正在导出《沉淀溶解平衡-课后巩固作业.docx》...");
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      {/* Banner - Clean Style */}
      <div className="bg-white rounded-2xl p-8 border-l-8 border-seewo-green shadow-sm relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10">
           <h1 className="text-3xl font-bold text-gray-800 mb-2">你好，测试学生9！</h1>
           <p className="text-gray-500">学号：S202401009 | 所有的努力都将开花结果</p>
        </div>
        <div className="flex flex-col items-end gap-3 z-10">
           <div className="text-right">
              <div className="text-xs text-gray-400">本周学习时长</div>
              <div className="text-xl font-bold text-seewo-green">12.5 小时</div>
           </div>
           <button onClick={onLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 px-4 py-2 rounded-lg">
              <LogOut className="w-4 h-4" /> 退出登录
           </button>
        </div>
        {/* Background Decor */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-50 to-transparent pointer-events-none"></div>
      </div>

      {/* Stats Cards - Minimalist */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { icon: <User className="w-5 h-5" />, label: '互动次数', value: '12', color: 'text-blue-600', bg: 'bg-blue-50' },
           { icon: <FileText className="w-5 h-5" />, label: '完成测验', value: '8', color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { icon: <Award className="w-5 h-5" />, label: '获得成就', value: '3', color: 'text-yellow-600', bg: 'bg-yellow-50' },
           { icon: <Activity className="w-5 h-5" />, label: '活跃度', value: '92%', color: 'text-purple-600', bg: 'bg-purple-50' },
         ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
               <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                  {stat.icon}
               </div>
               <div>
                  <div className="text-xs text-gray-400 mb-0.5">{stat.label}</div>
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
               </div>
            </div>
         ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Course List */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-seewo-green" /> 我的课程
               </h2>
               <div className="flex gap-2 text-xs">
                  <span className="cursor-pointer px-3 py-1 bg-gray-800 text-white rounded-full">进行中</span>
                  <span className="cursor-pointer px-3 py-1 bg-white text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50">已完成</span>
               </div>
            </div>

            <div className="space-y-4">
               {/* Highlighted Active Course */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-seewo-green transition-all group">
                   <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <span className="text-xs font-bold text-seewo-green bg-emerald-50 px-2 py-0.5 rounded mb-2 inline-block">正在上课</span>
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-seewo-green transition-colors">沉淀溶解平衡原理及应用</h3>
                            <p className="text-sm text-gray-500 mt-1">高二化学(选修四) | 李老师</p>
                         </div>
                         <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-seewo-green group-hover:text-white transition-all">
                            <ChevronRight className="w-6 h-6" />
                         </div>
                      </div>
                      
                      {/* Agents Grid inside Course Card */}
                      <div className="grid grid-cols-3 gap-3 mt-6">
                          <button 
                             onClick={() => setSelectedCourseId('c2')}
                             className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 hover:border-indigo-100 border border-transparent transition-all"
                          >
                             <Activity className="w-6 h-6 text-indigo-500 mb-2" />
                             <span className="text-xs font-bold text-gray-700">Ksp计算助手</span>
                          </button>
                          <button 
                             onClick={() => setSelectedCourseId('c2')}
                             className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 hover:border-orange-100 border border-transparent transition-all"
                          >
                             <Brain className="w-6 h-6 text-orange-500 mb-2" />
                             <span className="text-xs font-bold text-gray-700">答疑智能体</span>
                          </button>
                          <button 
                             onClick={() => setSelectedCourseId('c2')}
                             className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 hover:border-emerald-100 border border-transparent transition-all"
                          >
                             <Play className="w-6 h-6 text-seewo-green mb-2" />
                             <span className="text-xs font-bold text-gray-700">进入课程</span>
                          </button>
                      </div>
                   </div>
                   <div className="bg-gray-50 px-6 py-2 text-xs text-gray-400 flex justify-between">
                      <span>上次学习：昨天 20:30</span>
                      <span>进度 15%</span>
                   </div>
               </div>

               {/* Other Courses */}
               {MOCK_COURSES.filter(c => c.id !== 'c2').map(course => (
                 <div key={course.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity">
                    <div>
                       <h4 className="font-bold text-gray-800">{course.title}</h4>
                       <p className="text-xs text-gray-500">{course.teacher} | {course.time}</p>
                    </div>
                    <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg">查看回放</button>
                 </div>
               ))}
            </div>
         </div>

         {/* Sidebar: Suggestions & Schedule */}
         <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> 学习建议
               </h3>
               <div className="space-y-3 text-sm opacity-90">
                  <div className="flex items-start gap-2 bg-white/10 p-2 rounded-lg">
                     <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                     <p>化学平衡常数计算薄弱，建议复习第二章相关视频。</p>
                  </div>
                  <div className="flex items-start gap-2 bg-white/10 p-2 rounded-lg">
                     <Activity className="w-4 h-4 mt-0.5 shrink-0" />
                     <p>课堂互动积极，保持当前提问频率。</p>
                  </div>
                  <div className="flex items-start gap-2 bg-white/10 p-2 rounded-lg">
                     <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                     <p>记得今晚 20:00 前提交预习作业。</p>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
               <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" /> 近期日程
               </h3>
               <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  <div className="relative pl-6">
                     <div className="absolute left-0 top-1.5 w-4 h-4 bg-emerald-100 border-2 border-seewo-green rounded-full z-10"></div>
                     <div className="text-xs text-gray-400 mb-1">今天 10:00</div>
                     <div className="text-sm font-bold text-gray-800">数学 - 函数与方程</div>
                  </div>
                  <div className="relative pl-6">
                     <div className="absolute left-0 top-1.5 w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded-full z-10"></div>
                     <div className="text-xs text-gray-400 mb-1">明天 09:00</div>
                     <div className="text-sm font-bold text-gray-800">化学 - 沉淀溶解平衡</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const renderDetail = () => (
    <div className="max-w-6xl mx-auto animate-in slide-in-from-right-4 duration-300">
       <button 
         onClick={() => setSelectedCourseId(null)}
         className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors bg-white px-4 py-2 rounded-full shadow-sm"
       >
          <ArrowLeft className="w-4 h-4" /> 返回课程列表
       </button>

       {/* Course Header */}
       <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-emerald-100 text-emerald-700">进行中</Badge>
                <span className="text-sm text-gray-400">上次更新：10分钟前</span>
             </div>
             <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedCourse?.title}</h1>
             <div className="flex gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {selectedCourse?.teacher}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedCourse?.time}</span>
             </div>
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2">
                <Activity className="w-4 h-4" /> 知识点图谱
             </button>
             <button className="px-4 py-2 bg-seewo-green text-white rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-200 flex items-center gap-2">
                <Video className="w-4 h-4" /> 进入直播教室
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content (Tabs) */}
          <div className="lg:col-span-8 space-y-8">
             
             {/* SECTION 1: PRE-CLASS PREVIEW */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                   <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                         <BookOpen className="w-5 h-5" />
                      </div>
                      今日预习任务
                   </h2>
                   <span className="text-xs text-gray-400">完成度 1/2</span>
                </div>
                
                <div className="p-6 space-y-4">
                   {/* Resource List */}
                   <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                               <Play className="w-5 h-5 fill-current" />
                            </div>
                            <div>
                               <div className="font-bold text-gray-700 group-hover:text-blue-600">预习视频：Barium Meal Principle</div>
                               <div className="text-xs text-gray-400 mt-0.5">08:42 • 视频 • 必修</div>
                            </div>
                         </div>
                         <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            开始观看
                         </button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer group">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 shrink-0">
                               <FileText className="w-5 h-5" />
                            </div>
                            <div>
                               <div className="font-bold text-gray-700 group-hover:text-orange-600">课件：沉淀溶解平衡导学案.pdf</div>
                               <div className="text-xs text-gray-400 mt-0.5">2.4 MB • 文档 • 选修</div>
                            </div>
                         </div>
                         <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full group-hover:bg-orange-100 group-hover:text-orange-600">
                            下载
                         </button>
                      </div>
                   </div>

                   {/* Homework Submission Area */}
                   <div className="mt-6">
                      <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                            <Camera className="w-4 h-4 text-seewo-green" /> 提交预习笔记
                         </h3>
                         {previewStatus === 'submitted' && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">已批改</span>
                         )}
                      </div>

                      {previewStatus === 'submitted' ? (
                         <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                            {/* Comparison View Tabs */}
                            <div className="flex border-b border-gray-200">
                               <button 
                                 onClick={() => setCompareMode('student')}
                                 className={`flex-1 py-3 text-sm font-bold transition-colors ${compareMode === 'student' ? 'bg-white text-seewo-green border-b-2 border-seewo-green' : 'text-gray-500 hover:bg-gray-100'}`}
                               >
                                  我的提交
                               </button>
                               <button 
                                 onClick={() => setCompareMode('ai')}
                                 className={`flex-1 py-3 text-sm font-bold transition-colors ${compareMode === 'ai' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                               >
                                  AI 优化建议
                               </button>
                            </div>
                            
                            <div className="p-4 bg-white min-h-[300px] flex items-center justify-center relative">
                               {compareMode === 'student' ? (
                                  <img src={previewImage!} alt="My Homework" className="max-h-64 rounded-lg shadow-sm" />
                               ) : (
                                  <div className="flex flex-col items-center">
                                     <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200 text-blue-400 relative overflow-hidden group">
                                         <div className="absolute inset-0 bg-blue-50/50"></div>
                                         <div className="z-10 text-center p-6">
                                            <Sparkles className="w-8 h-8 mx-auto mb-2" />
                                            <h4 className="font-bold text-gray-700">AI 逻辑优化图谱</h4>
                                            <p className="text-xs text-gray-500 mt-2 max-w-xs">
                                               AI 已根据你的笔记，自动补充了"同离子效应"缺失的逻辑分支，并高亮了 Ksp 表达式的关键易错点。
                                            </p>
                                         </div>
                                     </div>
                                  </div>
                               )}
                            </div>
                            
                            {/* Comparison Feedback */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-t border-blue-100">
                               <div className="flex items-start gap-3">
                                  <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                                     <Layers className="w-5 h-5" />
                                  </div>
                                  <div>
                                     <h4 className="font-bold text-gray-800 text-sm mb-1">双向比对反馈</h4>
                                     <p className="text-xs text-gray-600 leading-relaxed text-justify">
                                        你的笔记在<span className="text-emerald-600 font-bold">"基本定义"</span>板块与标准逻辑高度一致（95%重合）。但在<span className="text-orange-500 font-bold">"平衡移动应用"</span>部分，你遗漏了"温度"这一关键变量，建议参考 AI 优化图谱中的红色分支进行补充。
                                     </p>
                                  </div>
                               </div>
                            </div>
                         </div>
                      ) : (
                         <div 
                           onClick={previewStatus === 'pending' ? handleUploadPreview : undefined}
                           className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-seewo-green cursor-pointer transition-all group"
                         >
                            {previewStatus === 'uploading' ? (
                               <div className="flex flex-col items-center text-seewo-green">
                                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                  <span className="text-sm font-medium">正在上传并进行双向比对...</span>
                               </div>
                            ) : (
                               <>
                                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                     <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-seewo-green" />
                                  </div>
                                  <span className="text-gray-600 font-bold text-sm">点击拍照 / 上传笔记</span>
                                  <span className="text-xs text-gray-400 mt-1">上传后即可获取 AI 双向比对反馈</span>
                               </>
                            )}
                         </div>
                      )}
                   </div>
                </div>
             </div>

             {/* SECTION 2: POST-CLASS CONSOLIDATION */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                   <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-seewo-green flex items-center justify-center">
                         <CheckCircle className="w-5 h-5" />
                      </div>
                      课后巩固作业
                   </h2>
                   <div className="flex gap-2">
                      <button onClick={handleExportWord} className="text-xs bg-white border border-gray-200 hover:border-seewo-green hover:text-seewo-green text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                         <FileDown className="w-3 h-3" /> 导出 Word
                      </button>
                   </div>
                </div>

                <div className="p-6">
                   {/* Question List Preview */}
                   <div className="space-y-4 mb-6">
                      {POST_CLASS_QUESTIONS.map((q, i) => (
                         <div key={q.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                               <span className="text-xs font-bold text-gray-500">第 {i+1} 题</span>
                               <span className={`text-[10px] px-2 py-0.5 rounded border ${q.difficulty === '基础' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-orange-50 border-orange-100 text-orange-600'}`}>{q.difficulty}</span>
                            </div>
                            <p className="text-sm text-gray-800 font-medium">{q.content}</p>
                         </div>
                      ))}
                   </div>
                   
                   {/* Upload Area */}
                   {postStatus === 'submitted' ? (
                      <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-6">
                         <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-emerald-700 font-bold">
                               <CheckCircle className="w-5 h-5" /> 作业已提交
                            </div>
                            <button onClick={() => setPostStatus('pending')} className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
                               <RefreshCcw className="w-3 h-3" /> 重新上传
                            </button>
                         </div>
                         
                         <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm flex gap-4">
                            <div className="w-1/3">
                               <h5 className="text-xs font-bold text-gray-500 mb-2">你的答案</h5>
                               <img src={postImage!} alt="Post homework" className="w-full h-32 object-cover rounded border border-gray-200" />
                            </div>
                            <div className="w-2/3 space-y-3">
                               <h5 className="text-xs font-bold text-gray-500">AI 批改反馈</h5>
                               <div className="flex items-center gap-2 text-sm">
                                  <span className="text-gray-600">准确率:</span>
                                  <span className="text-emerald-600 font-bold text-lg">85%</span>
                               </div>
                               <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2 rounded">
                                  第2题计算过程规范，但在最后单位换算时存在疏忽。建议参考标准答案的第三步推导过程。第3题关于"龋齿"的解释非常精彩，成功运用了平衡移动原理！
                               </p>
                            </div>
                         </div>
                      </div>
                   ) : (
                      <button 
                        onClick={handleUploadPost}
                        className="w-full py-4 border-2 border-dashed border-seewo-green/30 bg-emerald-50/30 text-seewo-green rounded-xl font-bold text-sm hover:bg-emerald-50 hover:border-seewo-green transition-all flex items-center justify-center gap-2"
                      >
                         {postStatus === 'uploading' ? <Loader2 className="w-4 h-4 animate-spin"/> : <Camera className="w-4 h-4" />}
                         {postStatus === 'uploading' ? '正在智能批改中...' : '拍照上传课后作业'}
                      </button>
                   )}
                </div>
             </div>
          </div>

          {/* Right Column: AI Analysis & Knowledge Radar */}
          <div className="lg:col-span-4 space-y-6">
             {/* Overall Mastery Radar */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <Target className="w-5 h-5 text-purple-500" /> 知识点掌握雷达
                </h3>
                <div className="h-64 -ml-4">
                   <KnowledgeRadarChart 
                      customData={[
                         { subject: '概念定义', A: 90, B: 70, fullMark: 100 },
                         { subject: '计算应用', A: 65, B: 60, fullMark: 100 },
                         { subject: '实验探究', A: 80, B: 75, fullMark: 100 },
                         { subject: '生活迁移', A: 85, B: 50, fullMark: 100 }
                      ]}
                      compareMode={true}
                      legendLabels={{ A: '当前状态', B: '课前基础' }}
                   />
                </div>
                <div className="mt-4 text-xs text-gray-500 text-center">
                   <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full mr-1"></span> 当前状态
                   <span className="inline-block w-2 h-2 bg-blue-400 rounded-full ml-4 mr-1"></span> 课前基础
                </div>
             </div>

             {/* Learning Suggestions */}
             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                   <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" /> 智能学习建议
                   </h3>
                   <ul className="space-y-4 text-sm">
                      <li className="flex gap-3">
                         <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                         <p className="leading-snug opacity-90">针对<span className="font-bold border-b border-white/40">计算应用</span>薄弱点，建议观看《Ksp计算专题突破》微课（03:45处）。</p>
                      </li>
                      <li className="flex gap-3">
                         <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                         <p className="leading-snug opacity-90">你的预习笔记逻辑性强，建议尝试将"沉淀转化"与"离子反应"建立思维导图链接。</p>
                      </li>
                      <li className="flex gap-3">
                         <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 font-bold text-xs">3</div>
                         <p className="leading-snug opacity-90">完成课后作业第2题后，可尝试向<span className="font-bold">答疑智能体</span>提问："如何利用Ksp判断沉淀转化的方向？"</p>
                      </li>
                   </ul>
                   
                   <button className="mt-6 w-full py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">
                      生成个性化练习计划
                   </button>
                </div>
                {/* Decor */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
             </div>
          </div>

       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-4 md:p-8 font-sans">
      {selectedCourseId ? renderDetail() : renderDashboard()}
    </div>
  );
};
