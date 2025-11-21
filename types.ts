export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  score: number;
  answers: number[]; // Stores the index of the selected answer for each question
  isFinished: boolean;
  loading: boolean;
  error: string | null;
  dateGenerated: string;
}

export enum AppView {
  HOME = 'HOME',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS',
}