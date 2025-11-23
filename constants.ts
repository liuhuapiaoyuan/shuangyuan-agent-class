
import { KnowledgePoint, QuizQuestion, PreClassMetric, StudentMastery, ChartData, HomeworkQuestion, AssessmentDimension, QuizQuestionConfig, StudentResult, ImprovedStudent } from './types';

// 1. Knowledge Points (From Prompt)
export const KNOWLEDGE_POINTS: KnowledgePoint[] = [
  { 
    id: 'KP1', 
    statement: '能掌握化学平衡原理分析难溶电解质沉淀溶解平衡本质', 
    masteryRate: 85,
    difficulty: 'Medium'
  },
  { 
    id: 'KP2', 
    statement: '能掌握通过简单计算判断溶液中沉淀的生成和溶解 (Ksp计算)', 
    masteryRate: 92,
    difficulty: 'Easy'
  },
  { 
    id: 'KP3', 
    statement: '能运用沉淀溶解平衡原理解释生产、生活中的实际问题 (钡餐原理)', 
    masteryRate: 68,
    difficulty: 'Hard'
  }
];

// 2. Pre-class Analysis Data
export const PRE_CLASS_METRICS: PreClassMetric[] = [
  { label: '预习视频完成率', value: '98%', subtext: '钡餐造影原理视频', status: 'good' },
  { label: '思维导图提交', value: '45/48', subtext: '沉淀溶解平衡', status: 'good' },
  { label: '课前摸底平均分', value: '76', subtext: '满分100', status: 'warning' }
];

export const PRE_CLASS_ANALYSIS = "课前数据显示，绝大多数同学完成了'钡餐造影'视频观看，对生活情境引入有较高兴趣。但在'思维导图'预习中，部分学生未能准确梳理出'沉淀转化'的核心逻辑，建议课中重点强化平衡移动原理。";

// Generate detailed Student Results for Pre-class
export const PRE_CLASS_STUDENT_RESULTS: StudentResult[] = Array.from({ length: 48 }, (_, i) => {
  const score = Math.floor(Math.random() * 40 + 60); // Random score 60-100
  let status: StudentResult['status'] = 'mastered';
  if (score < 70) status = 'at-risk';
  else if (score < 85) status = 'passing';

  // Simulate mastery per KP based on overall score with some variation
  const kp1 = Math.min(100, Math.max(0, score + Math.floor(Math.random() * 20 - 10)));
  const kp2 = Math.min(100, Math.max(0, score + Math.floor(Math.random() * 20 - 5))); // KP2 usually easier
  const kp3 = Math.min(100, Math.max(0, score - Math.floor(Math.random() * 20))); // KP3 harder

  return {
    id: i,
    name: `学生 ${i+1}`,
    masteryScore: score, // Use as overall mastery indicator
    preClassScore: score,
    status,
    kpMastery: {
      'KP1': kp1,
      'KP2': kp2,
      'KP3': kp3
    }
  };
});


// 3. In-class Quiz Questions (From Prompt)
export const IN_CLASS_QUESTIONS: QuizQuestion[] = [
  {
    id: 'Q1',
    type: 'calculation',
    content: '计算25℃时硫酸钡的溶度积常数Ksp (信息: 1L水溶解2.4x10^-3g BaSO4)',
    correctRate: 92,
    avgTime: 45,
    relatedKnowledgeId: 'KP2'
  },
  {
    id: 'Q2',
    type: 'reasoning',
    content: '请说明为什么可以用硫酸钡作为“钡餐”的主要成分',
    correctRate: 88,
    avgTime: 60,
    relatedKnowledgeId: 'KP3'
  },
  {
    id: 'Q3',
    type: 'application',
    content: '胃酸是酸性的(pH=0.9-1.5)，能否用碳酸钡代替硫酸钡? (Ksp=5.1x10^-9)',
    correctRate: 64,
    avgTime: 120,
    relatedKnowledgeId: 'KP3'
  }
];

export const IN_CLASS_ANALYSIS = "Q1与Q2正确率较高，说明学生对基础计算和性质有较好掌握。Q3正确率显著下降(64%)，学生在处理'弱酸制强酸'以及'pH对沉淀溶解平衡的影响'这一复杂情境时存在困难，需重点讲解氢离子浓度如何破坏碳酸钡的沉淀平衡。";

// 4. Visual Data for Charts
export const MASTERY_CHART_DATA: ChartData[] = [
  { name: '完全掌握', value: 22, color: '#00cd9c' }, // Green
  { name: '基本达标', value: 18, color: '#3b82f6' }, // Blue
  { name: '待加强', value: 8, color: '#ef4444' },   // Red
];

export const SCORE_DISTRIBUTION_DATA: ChartData[] = [
  { name: '[90-100] 优秀', value: 15, color: '#00cd9c' },
  { name: '[75-89] 良好', value: 20, color: '#3b82f6' },
  { name: '[60-74] 及格', value: 8, color: '#eab308' },
  { name: '<60 需努力', value: 5, color: '#ef4444' },
];

export const SCORE_TREND_DATA = [
  { name: '第1周', classAvg: 72, gradeAvg: 70 },
  { name: '第2周', classAvg: 74, gradeAvg: 71 },
  { name: '第3周', classAvg: 73, gradeAvg: 72 },
  { name: '本次', classAvg: 78, gradeAvg: 74 },
];

// 5. Seating Data (Simulating Mastery)
export const STUDENT_SEATS: StudentMastery[] = PRE_CLASS_STUDENT_RESULTS.map(s => ({
  id: s.id,
  name: s.name,
  masteryScore: Math.min(100, s.masteryScore + 5), // Simulate slight improvement in class
  status: s.status === 'at-risk' && Math.random() > 0.5 ? 'passing' : s.status // Some at-risk improve
}));

// 6. Overall Summary & Report Details
export const OVERALL_SUMMARY = "本次课程围绕'沉淀溶解平衡'展开，核心素养落实情况良好。学生在定性解释和简单定量计算方面表现优秀，但在涉及多重平衡移动（如酸溶碳酸钡）的复杂问题上存在思维瓶颈。后续教学应加强'平衡移动原理'在实际化工和生理情境中的变式训练。";

export const REPORT_DETAILS = {
  strengths: [
    '沉淀溶解平衡定义记忆准确 (KP1 掌握率 85%)',
    'Ksp基础计算能力强，能准确进行单位换算 (KP2 掌握率 92%)',
    '课堂参与度高，视频预习完成率达 98%'
  ],
  weaknesses: [
    'pH值变化对沉淀溶解平衡移动的影响理解不深 (Q3 错误率 36%)',
    '在处理"强酸制弱酸"与沉淀平衡共存的复杂情境时，逻辑链条容易断裂'
  ],
  strategies: [
    '针对pH影响设计专项对比实验：碳酸钙+醋酸 vs 碳酸钙+盐酸',
    '利用"平衡移动图像法"辅助讲解多重平衡共存问题',
    '分层作业：为待加强学生推送基础概念辨析题'
  ]
};

// 7. Homework Question Pool (AI Simulation)
export const HOMEWORK_POOL: HomeworkQuestion[] = [
  // Basic - For At-Risk
  { id: 'HW_B1', difficulty: '基础巩固', type: '填空题', content: '写出 BaSO4 在水中的沉淀溶解平衡方程式：________，其 Ksp 表达式为 Ksp = ________。' },
  { id: 'HW_B2', difficulty: '基础巩固', type: '判断题', content: '溶度积常数 Ksp 只与温度有关，与溶液中离子浓度无关。（  ）' },
  { id: 'HW_B3', difficulty: '基础巩固', type: '选择题', content: '下列物质能使 Ca(OH)2 悬浊液中固体减少的是：A. Na2CO3  B. NH4Cl  C. NaOH  D. CaCl2' },
  
  // Intermediate - For Passing
  { id: 'HW_I1', difficulty: '能力提升', type: '计算题', content: '已知 25℃ 时 AgCl 的 Ksp=1.8×10^-10，将 0.001 mol/L 的 NaCl 溶液与 0.001 mol/L 的 AgNO3 溶液等体积混合，是否有沉淀生成？' },
  { id: 'HW_I2', difficulty: '能力提升', type: '简答题', content: '用沉淀溶解平衡原理解释：为什么医学上用 BaSO4 作“钡餐”，而不用 BaCO3？' },
  
  // Advanced - For Mastered
  { id: 'HW_A1', difficulty: '拓展探究', type: '综合题', content: '锅炉水垢中含有 CaSO4，清洗时常先用 Na2CO3 溶液处理，使之转化为 CaCO3，再用酸除去。请写出 CaSO4 转化为 CaCO3 的离子方程式，并计算该反应的平衡常数 K (已知 Ksp(CaSO4)=9.1×10^-6, Ksp(CaCO3)=2.8×10^-9)。' },
  { id: 'HW_A2', difficulty: '拓展探究', type: '实验设计', content: '设计一个实验证明 Mg(OH)2 沉淀可以转化为 Fe(OH)3 沉淀，写出实验步骤和现象。' }
];

// 8. Default Assessment Dimensions
export const DEFAULT_DIMENSIONS: AssessmentDimension[] = [
  { id: 'DIM_1', name: '基础概念回忆', maxScore: 20, weight: 0.2, description: '考察沉淀溶解平衡定义及Ksp表达式书写', relatedKnowledgeIds: ['KP1'] },
  { id: 'DIM_2', name: '逻辑推理能力', maxScore: 30, weight: 0.3, description: '分析离子浓度变化对平衡移动的影响', relatedKnowledgeIds: ['KP1', 'KP3'] },
  { id: 'DIM_3', name: '计算应用能力', maxScore: 30, weight: 0.3, description: '利用Ksp进行定量计算及判定沉淀生成', relatedKnowledgeIds: ['KP2'] },
  { id: 'DIM_4', name: '科学探究思维', maxScore: 20, weight: 0.2, description: '运用原理解释钡餐、水垢处理等实际问题', relatedKnowledgeIds: ['KP3'] },
];

// 9. Default Pre-class Quiz Questions (Builder Demo)
export const DEFAULT_PRE_CLASS_QUIZ: QuizQuestionConfig[] = [
  {
    id: 'Q_PRE_1',
    type: 'single_choice',
    content: '关于沉淀溶解平衡，下列说法正确的是（ ）',
    options: [
      '沉淀溶解平衡是暂时的，最终会停止',
      '沉淀溶解平衡是动态平衡，沉淀生成和溶解速率相等',
      '升高温度，所有沉淀的Ksp都会增大',
      '向AgCl悬浊液中加入水，AgCl的溶解度增大'
    ],
    correctOptions: [1],
    score: 5,
    relatedKnowledgeIds: ['KP1'],
    analysis: '沉淀溶解平衡属于化学平衡的一种，具有动态平衡的特征，v(溶解)=v(沉淀)≠0。'
  },
  {
    id: 'Q_PRE_2',
    type: 'subjective',
    content: '请简述溶度积规则，并说明如何判断沉淀的生成与溶解。',
    options: [],
    correctOptions: [],
    score: 10,
    relatedKnowledgeIds: ['KP2'],
    analysis: '重点考察：Qc > Ksp 沉淀生成；Qc = Ksp 饱和/平衡；Qc < Ksp 沉淀溶解。'
  }
];

// 10. Most Improved Students
export const IMPROVED_STUDENTS: ImprovedStudent[] = [
  {
    id: 1,
    name: "张子涵",
    avatarSeed: "Felix",
    preScore: 58,
    postScore: 85,
    growth: 27,
    radarData: [
      { subject: '概念', A: 90, B: 60, fullMark: 100 }, // A=Post, B=Pre for better visualization
      { subject: '计算', A: 85, B: 45, fullMark: 100 },
      { subject: '应用', A: 80, B: 50, fullMark: 100 },
    ],
    aiComment: "从课前对Ksp概念模糊，到课后能熟练进行沉淀转化计算，张同学展现了极强的逻辑构建能力，特别是在“同离子效应”的理解上进步显著。"
  },
  {
    id: 2,
    name: "李梓晨",
    avatarSeed: "Aneka",
    preScore: 65,
    postScore: 88,
    growth: 23,
    radarData: [
      { subject: '概念', A: 95, B: 70, fullMark: 100 },
      { subject: '计算', A: 85, B: 55, fullMark: 100 },
      { subject: '应用', A: 88, B: 60, fullMark: 100 },
    ],
    aiComment: "计算准确率提升惊人！通过课堂针对性练习，克服了对复杂指数运算的畏难情绪，能够举一反三解决钡餐问题。"
  },
  {
    id: 3,
    name: "王浩然",
    avatarSeed: "Zack",
    preScore: 62,
    postScore: 82,
    growth: 20,
    radarData: [
      { subject: '概念', A: 90, B: 65, fullMark: 100 },
      { subject: '计算', A: 75, B: 60, fullMark: 100 },
      { subject: '应用', A: 80, B: 40, fullMark: 100 },
    ],
    aiComment: "应用能力实现了质的飞跃。课前无法解释沉淀溶解现象，现在能清晰阐述酸溶原理，科学探究思维得到了极大锻炼。"
  }
];
