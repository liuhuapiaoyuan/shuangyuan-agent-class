
// Data structures designed for the Chemistry Classroom Feedback System

export interface KnowledgePoint {
  id: string;
  statement: string;
  masteryRate: number; // Percentage
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizQuestion {
  id: string;
  type: 'calculation' | 'reasoning' | 'application';
  content: string;
  correctRate: number;
  avgTime: number; // seconds
  relatedKnowledgeId: string;
}

export interface PreClassMetric {
  label: string;
  value: string | number;
  subtext: string;
  status: 'good' | 'warning' | 'neutral';
}

export interface StudentMastery {
  id: number;
  name: string;
  masteryScore: number; // 0-100
  status: 'mastered' | 'passing' | 'at-risk';
}

export interface StudentResult extends StudentMastery {
  kpMastery: Record<string, number>; // KP_ID -> Mastery Score (0-100)
  preClassScore: number;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

export interface HomeworkQuestion {
  id: string;
  content: string;
  difficulty: '基础巩固' | '能力提升' | '拓展探究';
  type: string;
}

export interface StudentHomework {
  studentId: number;
  studentName: string;
  questions: HomeworkQuestion[];
  aiComment: string;
}

// --- Preparation System Types ---

export interface ResourceItem {
  id: string;
  name: string;
  type: 'video' | 'image' | 'document';
  size: string;
  status: 'ready' | 'uploading';
}

export interface AssessmentLevel {
  grade: 'L5' | 'L4' | 'L3' | 'L2' | 'L1';
  label: string; // e.g., '优秀', '良好'
  description: string;
  scoreRange: [number, number];
}

export interface AssessmentDimension {
  id: string;
  name: string;
  maxScore: number;
  weight: number; // 0-1
  description: string;
  relatedKnowledgeIds: string[];
  levels?: AssessmentLevel[]; // Rubric levels for this dimension
}

export interface AssessmentModel {
  name: string;
  dimensions: AssessmentDimension[];
  thresholds: {
    pass: number;
    excellent: number;
  };
}

// --- Quiz Builder Types ---

export type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'subjective';

export interface QuizQuestionConfig {
  id: string;
  type: QuestionType;
  content: string;
  options: string[]; // For choice questions
  correctOptions: number[]; // Indices for multiple/single choice (0, 1, 2, 3)
  correctBoolean?: boolean; // For true/false
  score: number;
  relatedKnowledgeIds: string[]; // Linked KnowledgePoint IDs
  analysis: string; // For subjective: key points; For others: explanation
}

// --- Student Center Types ---

export interface StudentCourse {
  id: string;
  title: string;
  teacher: string;
  time: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  progress: number;
  coverImage?: string;
}

export interface ImprovedStudent {
  id: number;
  name: string;
  avatarSeed: string;
  preScore: number;
  postScore: number;
  growth: number;
  radarData: { subject: string; A: number; B: number; fullMark: number }[];
  aiComment: string;
}
