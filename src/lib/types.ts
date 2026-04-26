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
