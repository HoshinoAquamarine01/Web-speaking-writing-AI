export type ExamType = 'TOEIC' | 'IELTS';

export type ToeicPart = 1 | 2 | 3 | 4 | 5;
export type IeltsPart = 1 | 2 | 3;

export type MainTab = 'exam' | 'shadowing' | 'dictation' | 'ipalab' | 'vocab' | 'dashboard';

export interface Question {
  id: string;
  examType: ExamType;
  part: number;
  partTitle: string; // e.g. "Part 1: Read a Text Aloud" hoặc "Part 2: Cue Card"
  title: string;
  prompt: string; // Nội dung câu hỏi/đoạn văn/chủ đề
  subQuestions?: string[]; // Danh sách các câu hỏi con (hỏi & thu âm từng câu)
  imageUrl?: string; // Ảnh cho TOEIC Part 2 hoặc IELTS Cue card nếu có
  prepTimeSeconds: number;
  responseTimeSeconds: number;
  sampleAnswer: string;
  sampleBand?: string; // e.g. "Level 8 (190-200)" hoặc "Band 8.5"
  vocabularyTips?: {
    word: string;
    ipa: string;
    meaning: string;
  }[];
}

export interface ExamCriteriaScore {
  name: string; // Tên tiêu chí tiếng Việt
  englishName: string;
  score: number; // Điểm tiêu chí
  maxScore: number;
  comment: string; // Nhận xét chi tiết bằng tiếng Việt
}

export interface PronunciationIssue {
  word: string;
  correctIpa: string;
  userSpoken?: string;
  issueType: 'mispronounced' | 'stress_error' | 'intonation';
  advice: string;
}

export interface GrammarFix {
  original: string;
  corrected: string;
  explanation: string;
}

export interface EvaluationResult {
  overallScore: number;
  bandOrLevel: string;
  summaryFeedback: string;
  criteria: ExamCriteriaScore[];
  pronunciationIssues: PronunciationIssue[];
  grammarFixes: GrammarFix[];
  actionableAdvice: string[];
  sampleAnswer: string;
  transcript: string;
}

export interface TestSubmission {
  id: string;
  userId: string;
  timestamp: string;
  examType: ExamType;
  questionId?: string;
  questionTitle: string;
  questionPrompt: string;
  transcript: string;
  audioBlobUrl?: string;
  evaluation: EvaluationResult;
}

export interface User {
  id: string;
  name: string;
  email: string;
  apiKey?: string;
  createdAt: string;
}

export interface ShadowingSentence {
  id: number;
  text: string;
  ipa?: string;
  translation: string;
}

export interface DictationExercise {
  id: string;
  title: string;
  examType: ExamType;
  level: string;
  audioText: string;
  sentences: string[];
}

export type SkillMode = 'speaking' | 'writing';

export interface WritingChartData {
  chartTitle: string;
  chartType: 'bar' | 'line' | 'pie';
  unit: string;
  categories: string[]; // e.g. ['2010', '2015', '2020', '2025']
  series: {
    name: string; // e.g. 'Germany', 'Sweden'
    color?: string;
    values: number[]; // e.g. [30, 42, 48, 50]
  }[];
}

export interface WritingQuestion {
  id: string;
  examType: ExamType;
  ieltsSubtype?: 'academic' | 'general'; // Phân biệt Academic và General Training cho IELTS
  part: number; // 1, 2, 3 cho TOEIC; 1, 2 cho IELTS Task 1/2
  partTitle: string;
  title: string;
  prompt: string;
  imageUrl?: string;
  chartData?: WritingChartData; // Dữ liệu biểu đồ trực quan cho IELTS Task 1 Academic
  givenWords?: string[]; // Từ gợi ý cho TOEIC Part 1
  minWords?: number;
  timeLimitMinutes: number;
  sampleAnswer: string;
  sampleBand?: string;
  vocabularyTips?: {
    word: string;
    ipa?: string;
    meaning: string;
  }[];
}

export interface WritingEvaluationResult {
  overallScore: number;
  bandOrLevel: string;
  summaryFeedback: string;
  criteria: ExamCriteriaScore[];
  wordCount: number;
  grammarFixes: GrammarFix[];
  vocabularyUpgrades?: {
    original: string;
    suggested: string;
    reason: string;
  }[];
  actionableAdvice: string[];
  sampleAnswer: string;
  userEssay: string;
}

export interface SavedWord {
  id: string;
  userId: string;
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  definition?: string;
  example?: string;
  audioUrl?: string;
  savedAt: string;
}

