export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-based index
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  answers: { [questionId: number]: number }; // questionId -> selectedOptionIndex
}

export enum AppState {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS'
}

export interface GenerateQuizParams {
  sourceText: string;
  sourceFileBase64?: string;
  sourceFileMimeType?: string;
  
  styleFileBase64?: string;
  styleFileMimeType?: string;
  styleFileText?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
}