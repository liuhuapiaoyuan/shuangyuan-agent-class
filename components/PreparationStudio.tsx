
import React, { useState } from 'react';
import { 
  XCircle, UploadCloud, Trash2, Plus, Target, Play, 
  Hexagon, Video, ImageIcon, File, Sparkles, Brain, 
  CheckCircle, ChevronRight, LayoutDashboard, FileText, Loader2,
  ListChecks, CheckSquare, CircleDot, AlignLeft, Save, Type,
  TrendingUp, Activity, Layers, AlertCircle,
  Tag, BookOpen, GraduationCap, Wand2, Sliders, School, Users,
  Workflow, GitBranch, Square, CheckSquare as CheckBoxIcon,
  RefreshCw, Table, Radar, PenTool
} from './ui/Icons';
import { KNOWLEDGE_POINTS, DEFAULT_DIMENSIONS, DEFAULT_PRE_CLASS_QUIZ, IN_CLASS_QUESTIONS } from '../constants';
import { ResourceItem, AssessmentDimension, KnowledgePoint, QuizQuestionConfig, QuestionType, AssessmentLevel } from '../types';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

interface PreparationStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'resources' | 'knowledge' | 'pre_quiz' | 'in_quiz' | 'student_model' | 'class_model';

// Mock data for simulation
const AI_GENERATED_KNOWLEDGE: KnowledgePoint[] = [
  { id: 'KP4', statement: '理解溶度积规则与离子积的关系(Qc vs Ksp)', masteryRate: 0, difficulty: 'Hard' },
  { id: 'KP5', statement: '掌握不同沉淀转化的本质与计算方法', masteryRate: 0, difficulty: 'Medium' },
  { id: 'KP6', statement: '探究温度对沉淀溶解平衡的影响', masteryRate: 0, difficulty: 'Easy' }
];

const AI_GENERATED_QUESTIONS: QuizQuestionConfig[] = [
  {
    id: 'AI_Q1', type: 'single_choice', score: 5, relatedKnowledgeIds: ['KP4'],
    content: '在一定温度下，某难溶电解质饱和溶液中，离子浓度幂之积（Qc）与溶度积（Ksp）的关系是？',
    options: ['Qc > Ksp', 'Qc = Ksp', 'Qc < Ksp', '与温度无关'],
    correctOptions: [1], analysis: '饱和溶液中，溶解速率等于沉淀速率，处于平衡状态，此时Qc=Ksp。'
  },
  {
    id: 'AI_Q2', type: 'multiple_choice', score: 8, relatedKnowledgeIds: ['KP5'],
    content: '下列关于沉淀转化的说法中，正确的是？',
    options: ['一般来说，溶解度小的沉淀容易转化为溶解度更小的沉淀', '沉淀转化不仅与Ksp有关，还与离子浓度有关', '溶解度大的沉淀绝对不能转化为溶解度小的沉淀', '沉淀转化是不可逆过程'],
    correctOptions: [0, 1], analysis: '沉淀转化遵循从易溶向难溶转化的趋势，但在特定浓度条件下，难溶也可转化为易溶。'
  }
];

const AVAILABLE_AGENTS = [
  { id: 'agent_chem', name: '化学实验助手', desc: '模拟实验现象，解答实验步骤疑问', icon: <Wand2 className="w-5 h-5 text-purple-500"/> },
  { id: 'agent_calc', name: 'Ksp计算专家', desc: '辅助进行复杂的沉淀平衡常数计算', icon: <Activity className="w-5 h-5 text-blue-500"/> },
  { id: 'agent_quiz', name: '苏格拉底导员', desc: '通过提问引导学生进行深度思考', icon: <Brain className="w-5 h-5 text-emerald-500"/> },
  { id: 'agent_vis', name: '微观可视化', desc: '生成分子/离子层面的微观运动动画', icon: <ImageIcon className="w-5 h-5 text-orange-500"/> },
];

export const PreparationStudio: React.FC<PreparationStudioProps> = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState<Step>('resources');
  
  // 1. Resources State
  const [courseTheme, setCourseTheme] = useState('沉淀溶解平衡原理及应用');
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['agent_chem']);
  const [resources, setResources] = useState<ResourceItem[]>([
    { id: '1', name: '钡餐造影原理.mp4', type: 'video', size: '45.2 MB', status: 'ready' },
    { id: '2', name: '沉淀溶解平衡.pptx', type: 'document', size: '12.5 MB', status: 'ready' }
  ]);
  const [metaData, setMetaData] = useState({ grade: '高二年级', subject: '化学', tags: ['沉淀溶解平衡', '选修四', '难溶电解质'] });

  // 2. Knowledge State
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>(KNOWLEDGE_POINTS);
  const [isParsingKP, setIsParsingKP] = useState(false);
  const [knowledgeViewMode, setKnowledgeViewMode] = useState<'list' | 'mindmap'>('list');

  // 3. Quiz State (Pre & In-class)
  const [preClassQuestions, setPreClassQuestions] = useState<QuizQuestionConfig[]>(DEFAULT_PRE_CLASS_QUIZ);
  const [inClassQuestions, setInClassQuestions] = useState<QuizQuestionConfig[]>(
    IN_CLASS_QUESTIONS.map(q => ({
      id: q.id, type: q.type === 'calculation' ? 'subjective' : 'single_choice', // Map types roughly
      content: q.content, options: ['A', 'B', 'C', 'D'], correctOptions: [0], score: 10,
      relatedKnowledgeIds: [q.relatedKnowledgeId], analysis: '解析略'
    }))
  );
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestionConfig | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // 4. Models State
  // Initializing with some default dimensions, but we will overwrite this with KP-based model
  const [studentDimensions, setStudentDimensions] = useState<AssessmentDimension[]>([]);
  const [selectedModelDimId, setSelectedModelDimId] = useState<string | null>(null);
  const [classDimensions, setClassDimensions] = useState<AssessmentDimension[]>(DEFAULT_DIMENSIONS);

  // Handlers
  const handleFileUpload = () => {
    const newRes: ResourceItem = {
      id: Date.now().toString(), name: '新建教学资源.pdf', type: 'document', size: '2.4 MB', status: 'ready'
    };
    setResources([...resources, newRes]);
  };

  const handleDeleteResource = (id: string) => setResources(resources.filter(r => r.id !== id));

  const toggleAgent = (id: string) => {
    setSelectedAgents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAIParseKnowledge = () => {
    setIsParsingKP(true);
    setTimeout(() => {
      setKnowledgePoints([...knowledgePoints, ...AI_GENERATED_KNOWLEDGE]);
      setIsParsingKP(false);
    }, 2000);
  };

  const handleAIGenerateQuiz = (type: 'pre' | 'in') => {
    setIsGeneratingQuiz(true);
    setTimeout(() => {
      const newQuestions = AI_GENERATED_QUESTIONS.map(q => ({ ...q, id: `AI_${type}_${Date.now()}_${Math.random()}` }));
      if (type === 'pre') setPreClassQuestions([...preClassQuestions, ...newQuestions]);
      else setInClassQuestions([...inClassQuestions, ...newQuestions]);
      setIsGeneratingQuiz(false);
    }, 1500);
  };

  const handleDeleteQuestion = (id: string, type: 'pre' | 'in') => {
    if (type === 'pre') setPreClassQuestions(preClassQuestions.filter(q => q.id !== id));
    else setInClassQuestions(inClassQuestions.filter(q => q.id !== id));
    if (currentQuestion?.id === id) setCurrentQuestion(null);
  };

  const handleAddQuestion = (type: 'pre' | 'in') => {
    const newQ: QuizQuestionConfig = {
      id: `NEW_${Date.now()}`, type: 'single_choice', content: '新题目...', options: ['选项A','选项B','选项C','选项D'], correctOptions: [0], score: 5, relatedKnowledgeIds: [], analysis: ''
    };
    if (type === 'pre') { setPreClassQuestions([...preClassQuestions, newQ]); setCurrentQuestion(newQ); }
    else { setInClassQuestions([...inClassQuestions, newQ]); setCurrentQuestion(newQ); }
  };

  const updateCurrentQuestion = (updates: Partial<QuizQuestionConfig>, type: 'pre' | 'in') => {
    if (!currentQuestion) return;
    const updated = { ...currentQuestion, ...updates };
    setCurrentQuestion(updated);
    if (type === 'pre') setPreClassQuestions(preClassQuestions.map(q => q.id === updated.id ? updated : q));
    else setInClassQuestions(inClassQuestions.map(q => q.id === updated.id ? updated : q));
  };

  const handleGenerateStudentModel = () => {
     // Generate assessment dimensions from Knowledge Points
     const newDimensions: AssessmentDimension[] = knowledgePoints.map(kp => ({
        id: `DIM_${kp.id}`,
        name: kp.id, // e.g., KP1
        description: kp.statement,
        maxScore: 100,
        weight: Number((1 / knowledgePoints.length).toFixed(2)),
        relatedKnowledgeIds: [kp.id],
        levels: [
           { grade: 'L5', label: '优秀', description: `能够深刻理解并灵活运用"${kp.statement}"解决复杂的跨学科或实际情境问题。`, scoreRange: [90, 100] },
           { grade: 'L4', label: '理解', description: `能够准确理解"${kp.statement}"的内涵，独立完成相关变式练习。`, scoreRange: [75, 89] },
           { grade: 'L3', label: '有概念', description: `基本记住"${kp.statement}"的概念，但在复杂情境下运用会有卡顿。`, scoreRange: [60, 74] },
           { grade: 'L2', label: '差', description: `对"${kp.statement}"仅有模糊印象，需要大量提示才能回忆。`, scoreRange: [40, 59] },
           { grade: 'L1', label: '完全不懂', description: `完全无法理解"${kp.statement}"，存在严重认知断层。`, scoreRange: [0, 39] },
        ]
     }));
     setStudentDimensions(newDimensions);
     if (newDimensions.length > 0) setSelectedModelDimId(newDimensions[0].id);
  };

  if (!isOpen) return null;

  const renderSidebarItem = (step: Step, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveStep(step)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        activeStep === step 
          ? 'bg-seewo-light text-seewo-green font-bold shadow-sm border border-emerald-100' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
      }`}
    >
      {icon}
      <span>{label}</span>
      {activeStep === step && <ChevronRight className="w-4 h-4 ml-auto" />}
    </button>
  );

  // --- Mind Map Component ---
  const KnowledgeMindMap = () => {
    return (
      <div className="w-full h-full bg-slate-50 relative overflow-hidden flex items-center justify-center p-10">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
             <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
               <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
             </marker>
          </defs>
          {knowledgePoints.map((kp, i) => {
             // Simple radial layout calculation
             const angle = (i / knowledgePoints.length) * 2 * Math.PI;
             const cx = 50 + 50 * Math.cos(angle); // % based
             const cy = 50 + 50 * Math.sin(angle); // % based
             return (
               <line 
                  key={`line-${i}`}
                  x1="50%" y1="50%" 
                  x2={`${cx}%`} y2={`${cy}%`} 
                  stroke="#cbd5e1" 
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
               />
             );
          })}
        </svg>

        {/* Center Node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
           <div className="w-32 h-32 bg-seewo-green rounded-full shadow-lg shadow-emerald-200 flex items-center justify-center text-white text-center font-bold p-4 border-4 border-white">
              沉淀溶解<br/>平衡
           </div>
        </div>

        {/* Leaf Nodes */}
        {knowledgePoints.map((kp, i) => {
           const angle = (i / knowledgePoints.length) * 2 * Math.PI;
           const radius = 280; // px distance
           const x = Math.cos(angle) * radius;
           const y = Math.sin(angle) * radius;
           
           return (
             <div 
                key={kp.id}
                className="absolute w-48 bg-white p-3 rounded-lg shadow-md border border-gray-100 text-sm transform transition-all hover:scale-105 hover:border-seewo-green group z-20"
                style={{ 
                  transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` 
                }}
             >
                <div className="font-bold text-gray-800 mb-1 flex justify-between">
                   {kp.id}
                   <span className={`text-[10px] px-1.5 py-0.5 rounded ${kp.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{kp.difficulty}</span>
                </div>
                <div className="text-gray-600 text-xs leading-snug line-clamp-3">
                   {kp.statement}
                </div>
             </div>
           );
        })}
      </div>
    );
  };

  // Reusable Quiz Editor Component Logic
  const renderQuizEditor = (questions: QuizQuestionConfig[], type: 'pre' | 'in') => (
    <div className="flex gap-6 h-full">
      {/* List */}
      <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
           <span className="font-bold text-gray-700">题目列表 ({questions.length})</span>
           <div className="flex gap-2">
             <button 
               onClick={() => handleAIGenerateQuiz(type)}
               className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded hover:bg-purple-200 transition-colors flex items-center gap-1 border border-purple-200"
             >
                {isGeneratingQuiz ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />} AI 生成
             </button>
             <button onClick={() => handleAddQuestion(type)} className="text-xs bg-seewo-green text-white px-2 py-1 rounded hover:bg-seewo-dark flex items-center gap-1">
                <Plus className="w-3 h-3" /> 新增
             </button>
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
           {questions.map((q, idx) => (
              <div key={q.id} onClick={() => setCurrentQuestion(q)} className={`p-3 rounded-lg border cursor-pointer transition-all group relative ${currentQuestion?.id === q.id ? 'bg-seewo-light border-seewo-green shadow-sm' : 'bg-white border-gray-100 hover:border-gray-300'}`}>
                 <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      q.type === 'single_choice' ? 'bg-blue-50 text-blue-600' : 
                      q.type === 'multiple_choice' ? 'bg-purple-50 text-purple-600' : 
                      q.type === 'subjective' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {q.type === 'single_choice' ? '单选' : q.type === 'multiple_choice' ? '多选' : q.type === 'subjective' ? '主观' : '判断'}
                    </span>
                    <span className="text-xs font-bold text-gray-400">{q.score}分</span>
                 </div>
                 <p className="text-xs text-gray-700 line-clamp-2 font-medium">{idx + 1}. {q.content}</p>
                 <button onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(q.id, type); }} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
              </div>
           ))}
        </div>
      </div>
      
      {/* Editor */}
      <div className="w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        {currentQuestion ? (
           <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
              {/* Type & Score Row */}
              <div className="flex gap-4">
                 <div className="w-1/2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">题目类型</label>
                    <div className="relative">
                       <Type className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                       <select 
                          value={currentQuestion.type} 
                          onChange={(e) => updateCurrentQuestion({ type: e.target.value as QuestionType }, type)} 
                          className="w-full pl-9 p-2.5 border rounded-lg text-sm bg-white focus:border-seewo-green outline-none appearance-none"
                       >
                          <option value="single_choice">单项选择题</option>
                          <option value="multiple_choice">多项选择题</option>
                          <option value="true_false">判断题</option>
                          <option value="subjective">主观简答题</option>
                       </select>
                    </div>
                 </div>
                 <div className="w-1/2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">分值</label>
                    <input 
                      type="number" 
                      value={currentQuestion.score} 
                      onChange={(e) => updateCurrentQuestion({ score: parseInt(e.target.value) || 0 }, type)} 
                      className="w-full p-2.5 border rounded-lg text-sm focus:border-seewo-green outline-none" 
                    />
                 </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">题干内容</label>
                <textarea 
                  value={currentQuestion.content} 
                  onChange={(e) => updateCurrentQuestion({ content: e.target.value }, type)} 
                  className="w-full h-24 p-3 border rounded-lg text-sm focus:border-seewo-green outline-none resize-none" 
                  placeholder="请输入题目内容..."
                />
              </div>
              
              {/* Options Area (Conditional) */}
              {(currentQuestion.type === 'single_choice' || currentQuestion.type === 'multiple_choice') && (
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-2 flex justify-between">
                      <span>选项配置</span>
                      <span className="font-normal text-gray-400">勾选左侧方框标记正确答案</span>
                   </label>
                   <div className="space-y-3">
                     {currentQuestion.options.map((opt, i) => {
                        const isCorrect = currentQuestion.correctOptions.includes(i);
                        return (
                          <div key={i} className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'}`}>
                             <button 
                               onClick={() => {
                                  let newCorrect = [...currentQuestion.correctOptions];
                                  if (currentQuestion.type === 'single_choice') {
                                     newCorrect = [i];
                                  } else {
                                     // Multiple choice logic
                                     if (newCorrect.includes(i)) newCorrect = newCorrect.filter(c => c !== i);
                                     else newCorrect.push(i);
                                  }
                                  updateCurrentQuestion({ correctOptions: newCorrect }, type);
                               }}
                               className={`w-6 h-6 rounded flex items-center justify-center border transition-all ${isCorrect ? 'bg-seewo-green border-seewo-green text-white' : 'border-gray-300 text-transparent hover:border-gray-400'}`}
                             >
                                <CheckSquare className="w-4 h-4" />
                             </button>
                             <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                                {String.fromCharCode(65 + i)}
                             </div>
                             <input 
                               value={opt} 
                               onChange={(e) => {
                                  const newOpts = [...currentQuestion.options]; newOpts[i] = e.target.value;
                                  updateCurrentQuestion({ options: newOpts }, type);
                               }} 
                               className="flex-1 bg-transparent outline-none text-sm"
                               placeholder={`选项 ${String.fromCharCode(65 + i)} 内容`}
                             />
                          </div>
                        );
                     })}
                   </div>
                </div>
              )}

              {/* Subjective/Analysis Area */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                   {currentQuestion.type === 'subjective' ? '参考答案 / 评分要点' : '题目解析'}
                </label>
                <textarea 
                   value={currentQuestion.analysis} 
                   onChange={(e) => updateCurrentQuestion({ analysis: e.target.value }, type)} 
                   className="w-full h-24 p-3 border rounded-lg text-sm focus:border-seewo-green outline-none bg-gray-50"
                   placeholder={currentQuestion.type === 'subjective' ? "请输入采分点和参考答案..." : "请输入题目解析..."} 
                />
              </div>

              {/* KP Linking */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">关联知识点</label>
                <div className="flex flex-wrap gap-2">
                   {knowledgePoints.map(kp => (
                     <button key={kp.id} onClick={() => {
                        const current = currentQuestion.relatedKnowledgeIds || [];
                        const newIds = current.includes(kp.id) ? current.filter(id => id !== kp.id) : [...current, kp.id];
                        updateCurrentQuestion({ relatedKnowledgeIds: newIds }, type);
                     }} className={`px-3 py-1 rounded-full text-xs border transition-all ${currentQuestion.relatedKnowledgeIds?.includes(kp.id) ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                        {kp.id} {kp.statement.substring(0, 5)}...
                     </button>
                   ))}
                </div>
              </div>
           </div>
        ) : <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
             <ListChecks className="w-16 h-16 mb-4 opacity-20" />
             <p>请从左侧选择题目或新建题目</p>
            </div>}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white w-full h-full md:h-[95vh] md:w-[95vw] md:rounded-2xl shadow-2xl flex overflow-hidden relative">
        
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
             <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                <LayoutDashboard className="w-5 h-5 text-seewo-green" />
                课堂准备系统
             </div>
          </div>
          <div className="p-4 space-y-1 flex-1 overflow-y-auto">
             <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-2 mb-2">教学设计</div>
             {renderSidebarItem('resources', <PenTool className="w-4 h-4" />, '课程设计')}
             {renderSidebarItem('knowledge', <Brain className="w-4 h-4" />, '知识点图谱')}
             
             <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-6 mb-2">测验配置</div>
             {renderSidebarItem('pre_quiz', <FileText className="w-4 h-4" />, '预习测验设计')}
             {renderSidebarItem('in_quiz', <ListChecks className="w-4 h-4" />, '堂中测验设计')}
             
             <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-6 mb-2">评估模型</div>
             {renderSidebarItem('student_model', <Users className="w-4 h-4" />, '学生评估模型')}
             {renderSidebarItem('class_model', <School className="w-4 h-4" />, '课堂评估模型')}
          </div>
          <div className="p-4 border-t border-gray-100">
             <button onClick={onClose} className="w-full py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm transition-colors">
                退出备课
             </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-hidden">
           {/* Header */}
           <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {activeStep === 'resources' && <><PenTool className="w-5 h-5 text-seewo-green"/> 课程整体设计</>}
                {activeStep === 'knowledge' && <><Brain className="w-5 h-5 text-seewo-green"/> 知识点图谱构建</>}
                {activeStep === 'pre_quiz' && <><FileText className="w-5 h-5 text-seewo-green"/> 课前预习测验设计</>}
                {activeStep === 'in_quiz' && <><ListChecks className="w-5 h-5 text-seewo-green"/> 课中随堂测验设计</>}
                {activeStep === 'student_model' && <><Users className="w-5 h-5 text-seewo-green"/> 学生多维评估模型</>}
                {activeStep === 'class_model' && <><School className="w-5 h-5 text-seewo-green"/> 课堂质量评估模型</>}
              </h2>
              <div className="flex items-center gap-3">
                 <span className="text-sm text-gray-500">自动保存: 已启用</span>
                 <button className="bg-seewo-green text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-seewo-dark shadow-md shadow-emerald-100 flex items-center gap-2">
                    <Save className="w-4 h-4" /> 保存配置
                 </button>
              </div>
           </div>

           {/* Body */}
           <div className="flex-1 overflow-y-auto p-8">
              
              {/* 1. RESOURCES -> COURSE DESIGN */}
              {activeStep === 'resources' && (
                <div className="max-w-4xl mx-auto space-y-6">
                   {/* Course Theme & Metadata */}
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><PenTool className="w-4 h-4"/> 课程基础信息</h3>
                      
                      <div className="mb-6">
                          <label className="text-xs font-bold text-gray-500 mb-2 block">课程主题</label>
                          <input 
                            type="text" 
                            value={courseTheme} 
                            onChange={(e) => setCourseTheme(e.target.value)}
                            className="w-full p-3 border rounded-lg text-base font-bold text-gray-800 focus:border-seewo-green outline-none bg-gray-50"
                            placeholder="输入本节课的核心主题..."
                          />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                         <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">年级</label>
                            <div className="relative">
                               <GraduationCap className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                               <input type="text" value={metaData.grade} onChange={e => setMetaData({...metaData, grade: e.target.value})} className="w-full pl-9 p-2 border rounded-lg text-sm" />
                            </div>
                         </div>
                         <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">学科</label>
                            <div className="relative">
                               <BookOpen className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                               <input type="text" value={metaData.subject} onChange={e => setMetaData({...metaData, subject: e.target.value})} className="w-full pl-9 p-2 border rounded-lg text-sm" />
                            </div>
                         </div>
                         <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">知识标签</label>
                            <div className="flex flex-wrap gap-2 border rounded-lg p-2 bg-white min-h-[38px]">
                               {metaData.tags.map((tag, i) => (
                                  <span key={i} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                                     {tag} <button onClick={() => setMetaData({...metaData, tags: metaData.tags.filter((_, idx) => idx !== i)})}><XCircle className="w-3 h-3 hover:text-blue-800"/></button>
                                  </span>
                               ))}
                               <button className="text-xs text-gray-400 hover:text-gray-600">+ 添加</button>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* AI Agents Selection */}
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4"/> 课堂 AI 智能体配置</h3>
                      <div className="grid grid-cols-2 gap-4">
                          {AVAILABLE_AGENTS.map(agent => (
                              <div 
                                key={agent.id}
                                onClick={() => toggleAgent(agent.id)}
                                className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${selectedAgents.includes(agent.id) ? 'bg-purple-50 border-purple-500 shadow-sm' : 'bg-white border-gray-100 hover:border-purple-200'}`}
                              >
                                  <div className={`p-2 rounded-lg ${selectedAgents.includes(agent.id) ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                                      {agent.icon}
                                  </div>
                                  <div>
                                      <div className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                          {agent.name}
                                          {selectedAgents.includes(agent.id) && <CheckCircle className="w-3 h-3 text-purple-600"/>}
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1 leading-snug">{agent.desc}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                   </div>

                   {/* File Upload */}
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><Video className="w-4 h-4"/> 教学资源素材</h3>
                      <div onClick={handleFileUpload} className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center bg-gray-50 hover:border-seewo-green cursor-pointer transition-all mb-4">
                         <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                         <p className="text-sm text-gray-500">拖拽上传视频/文档</p>
                      </div>
                      <div className="space-y-2">
                         {resources.map(res => (
                           <div key={res.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                              <div className="flex items-center gap-3">
                                 {res.type === 'video' ? <Video className="w-5 h-5 text-blue-500"/> : <FileText className="w-5 h-5 text-orange-500"/>}
                                 <span className="text-sm text-gray-700">{res.name}</span>
                              </div>
                              <button onClick={() => handleDeleteResource(res.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              )}

              {/* 2. KNOWLEDGE */}
              {activeStep === 'knowledge' && (
                <div className="flex gap-6 h-full flex-col lg:flex-row">
                   {/* Left: AI Upload */}
                   <div className="w-full lg:w-1/3 space-y-4">
                      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
                         <Wand2 className="w-10 h-10 mb-4 text-purple-200" />
                         <h3 className="font-bold text-lg mb-2">AI 智能图谱构建</h3>
                         <p className="text-xs text-purple-100 mb-6 leading-relaxed">
                            上传教材章节文档或板书图片，AI 将自动解析核心概念并生成知识关系图谱。
                         </p>
                         <button 
                           onClick={handleAIParseKnowledge}
                           disabled={isParsingKP}
                           className="w-full py-3 bg-white/10 border border-white/20 hover:bg-white/20 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all"
                         >
                            {isParsingKP ? <Loader2 className="w-4 h-4 animate-spin"/> : <UploadCloud className="w-4 h-4"/>}
                            上传文档/图片解析
                         </button>
                      </div>
                   </div>
                   {/* Right: List/Map */}
                   <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden h-[600px]">
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                         <h3 className="font-bold text-gray-700 flex items-center gap-2">
                            {knowledgeViewMode === 'list' ? <ListChecks className="w-4 h-4"/> : <Workflow className="w-4 h-4"/>}
                            知识点{knowledgeViewMode === 'list' ? '列表' : '图谱'} 
                            <span className="text-xs text-gray-400 font-normal ml-2">({knowledgePoints.length})</span>
                         </h3>
                         <div className="flex items-center gap-2 bg-gray-200 p-1 rounded-lg">
                            <button 
                               onClick={() => setKnowledgeViewMode('list')}
                               className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${knowledgeViewMode === 'list' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                               列表
                            </button>
                            <button 
                               onClick={() => setKnowledgeViewMode('mindmap')}
                               className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${knowledgeViewMode === 'mindmap' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                               思维导图
                            </button>
                         </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto bg-slate-50 relative">
                         {knowledgeViewMode === 'list' ? (
                           <div className="p-6 space-y-3">
                             {knowledgePoints.map((kp, i) => (
                               <div key={kp.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 group hover:border-seewo-green transition-colors shadow-sm">
                                  <span className="text-xs font-bold text-gray-400 mt-1 w-8">KP{i+1}</span>
                                  <div className="flex-1">
                                     <div className="text-sm font-medium text-gray-800">{kp.statement}</div>
                                     <div className="flex gap-2 mt-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded border ${kp.difficulty === 'Easy' ? 'bg-green-50 text-green-600 border-green-100' : kp.difficulty === 'Medium' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                           {kp.difficulty}
                                        </span>
                                     </div>
                                  </div>
                               </div>
                             ))}
                             <button className="w-full py-2 border border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-white hover:border-seewo-green hover:text-seewo-green text-sm flex items-center justify-center gap-2 mt-4">
                                <Plus className="w-4 h-4"/> 手动添加知识点
                             </button>
                           </div>
                         ) : (
                           <KnowledgeMindMap />
                         )}
                      </div>
                   </div>
                </div>
              )}

              {/* 3. PRE QUIZ */}
              {activeStep === 'pre_quiz' && renderQuizEditor(preClassQuestions, 'pre')}

              {/* 4. IN QUIZ */}
              {activeStep === 'in_quiz' && renderQuizEditor(inClassQuestions, 'in')}

              {/* 5. STUDENT MODEL - UPDATED FOR KP DRIVEN RUBRIC */}
              {activeStep === 'student_model' && (
                 <div className="h-full flex flex-col">
                    {/* Toolbar */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex justify-between items-center">
                       <div>
                          <h3 className="font-bold text-gray-800 text-lg">学生知识掌握评估模型</h3>
                          <p className="text-xs text-gray-500 mt-1">基于知识图谱自动构建多维评估雷达</p>
                       </div>
                       <button 
                          onClick={handleGenerateStudentModel}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 transition-all shadow-md flex items-center gap-2"
                       >
                          <RefreshCw className="w-4 h-4" /> 一键基于知识图谱生成
                       </button>
                    </div>

                    {studentDimensions.length === 0 ? (
                       <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                          <Radar className="w-16 h-16 mb-4 opacity-20" />
                          <p className="mb-4">暂无评估维度模型</p>
                          <p className="text-xs">请点击上方按钮自动从知识图谱生成评估维度</p>
                       </div>
                    ) : (
                       <div className="flex-1 flex gap-6 overflow-hidden">
                          {/* Left: Dimension List */}
                          <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
                             <div className="p-4 border-b border-gray-100 font-bold text-gray-700 flex justify-between items-center">
                                评估维度列表 ({studentDimensions.length})
                             </div>
                             <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                {studentDimensions.map(dim => (
                                   <div 
                                      key={dim.id} 
                                      onClick={() => setSelectedModelDimId(dim.id)}
                                      className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedModelDimId === dim.id ? 'bg-seewo-light border-seewo-green shadow-sm' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
                                   >
                                      <div className="flex justify-between items-center mb-1">
                                         <span className="font-bold text-sm text-gray-800">{dim.name}</span>
                                         <span className="text-xs text-gray-400">{Math.round(dim.weight * 100)}% 权重</span>
                                      </div>
                                      <div className="text-xs text-gray-500 line-clamp-1">{dim.description}</div>
                                   </div>
                                ))}
                             </div>
                             {/* Radar Preview Mini */}
                             <div className="h-48 border-t border-gray-100 p-2 relative">
                                <div className="absolute top-2 left-2 text-xs font-bold text-gray-400 z-10">模型预览</div>
                                <ResponsiveContainer width="100%" height="100%">
                                   <RadarChart cx="50%" cy="50%" outerRadius="70%" data={studentDimensions.map(d => ({ subject: d.name, A: 100, fullMark: 100 }))}>
                                      <PolarGrid stroke="#e2e8f0" />
                                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                      <RechartsRadar name="Preview" dataKey="A" stroke="#00cd9c" fill="#00cd9c" fillOpacity={0.3} />
                                   </RadarChart>
                                </ResponsiveContainer>
                             </div>
                          </div>

                          {/* Right: Rubric Editor */}
                          <div className="w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                             {selectedModelDimId && studentDimensions.find(d => d.id === selectedModelDimId) ? (
                                <div className="flex-1 p-6 overflow-y-auto">
                                   <div className="mb-6">
                                      <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
                                         <Target className="w-5 h-5 text-seewo-green" />
                                         {studentDimensions.find(d => d.id === selectedModelDimId)?.name} - 评分量表 (Rubric)
                                      </h4>
                                      <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-100">
                                         {studentDimensions.find(d => d.id === selectedModelDimId)?.description}
                                      </p>
                                   </div>

                                   <div className="space-y-4">
                                      {studentDimensions.find(d => d.id === selectedModelDimId)?.levels?.map((level, idx) => (
                                         <div key={idx} className="flex gap-4 p-4 rounded-lg border border-gray-100 hover:border-seewo-green transition-colors group">
                                            <div className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center shrink-0 font-bold text-white
                                               ${level.grade === 'L5' ? 'bg-emerald-500' : 
                                                 level.grade === 'L4' ? 'bg-teal-500' :
                                                 level.grade === 'L3' ? 'bg-blue-500' :
                                                 level.grade === 'L2' ? 'bg-orange-500' : 'bg-red-500'}
                                            `}>
                                               <span className="text-xl">{level.grade}</span>
                                               <span className="text-[10px] opacity-90">{level.label}</span>
                                            </div>
                                            <div className="flex-1">
                                               <textarea 
                                                  className="w-full h-full p-2 bg-transparent border-none resize-none outline-none text-sm text-gray-700 focus:bg-gray-50 rounded"
                                                  value={level.description}
                                                  onChange={(e) => {
                                                     const newDims = [...studentDimensions];
                                                     const dimIdx = newDims.findIndex(d => d.id === selectedModelDimId);
                                                     if (newDims[dimIdx].levels) {
                                                        newDims[dimIdx].levels![idx].description = e.target.value;
                                                        setStudentDimensions(newDims);
                                                     }
                                                  }}
                                               />
                                            </div>
                                         </div>
                                      ))}
                                   </div>
                                </div>
                             ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-400">
                                   请选择左侧维度查看评分量表
                                </div>
                             )}
                          </div>
                       </div>
                    )}
                 </div>
              )}

              {/* 6. CLASS MODEL */}
              {activeStep === 'class_model' && (
                 <div className="flex gap-6 h-full">
                    <div className="w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                       <h3 className="font-bold text-gray-800 mb-4">课堂质量评估指标</h3>
                       <div className="space-y-4">
                          {classDimensions.map(dim => (
                             <div key={dim.id} className="p-3 border rounded-lg hover:border-seewo-green transition-colors cursor-pointer">
                                <div className="flex justify-between">
                                   <span className="font-bold text-sm text-gray-700">{dim.name}</span>
                                   <span className="text-xs bg-blue-50 text-blue-600 px-2 rounded">{dim.maxScore}分</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{dim.description}</p>
                             </div>
                          ))}
                       </div>
                    </div>
                    <div className="w-1/2 bg-slate-800 rounded-xl p-6 text-white flex flex-col items-center justify-center text-center">
                        <School className="w-16 h-16 text-emerald-400 mb-4 opacity-80" />
                        <h3 className="text-xl font-bold mb-2">课堂模型仿真</h3>
                        <p className="text-slate-400 text-sm mb-6 max-w-xs">
                           基于当前配置的指标，模拟不同教学风格下的课堂质量得分分布。
                        </p>
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2">
                           <Play className="w-4 h-4 fill-current" /> 运行仿真测试
                        </button>
                    </div>
                 </div>
              )}

           </div>
        </div>
      </div>
    </div>
  );
};
