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

export interface ProcessedFile {
  name: string;
  mimeType: string;
  data?: string; // Base64 data for PDF
  text?: string; // Extracted text for DOCX/HTML
  type: 'source' | 'style';
}

export interface GenerateQuizParams {
  sourceText: string;
  sourceFiles: ProcessedFile[];
  styleFiles: ProcessedFile[];
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
}
