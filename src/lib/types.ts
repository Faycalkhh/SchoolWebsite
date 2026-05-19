import type { SurahStatus } from './quran';
export type { SurahStatus } from './quran';

export type Role = 'professor' | 'parent';
export type Discipline = 'excellent' | 'bon' | 'passable' | 'insuffisant';
export type Level = 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Hifz';

export interface TopEntry {
  rank: 1 | 2 | 3;
  studentId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  specialty?: string;
  bio?: string;
  photo?: string;
}

export interface Session {
  id: string;
  date: string;
  present: boolean;
  discipline: Discipline;
  memorization: string;
  comment: string;
  professorId: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  dateOfBirth?: string;
  level: Level;
  parentId: string;
  sessions: Session[];
  photo?: string;
  memorization?: Record<number, SurahStatus>;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  image?: string;
  date: string;
}

export interface QCMOption {
  id: string;
  text: string;
}

export interface QCMQuestion {
  id: string;
  text: string;
  options: QCMOption[];
  correctOptionId: string;
}

export interface Exam {
  id: string;
  title: string;
  professorId: string;
  date: string;
  questions: QCMQuestion[];
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  answers: Record<string, string>;
  score: number;
  correctCount: number;
  totalCount: number;
  dateTaken: string;
}
