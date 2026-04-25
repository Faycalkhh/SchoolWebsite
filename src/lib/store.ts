import type { User, Student, TopEntry } from './types';

const USERS_KEY = 'nur_users';
const STUDENTS_KEY = 'nur_students';

const seedUsers: User[] = [
  {
    id: 'u1',
    name: 'Sheikh Abdullah Rahman',
    email: 'prof@nur.com',
    password: 'prof123',
    role: 'professor',
    specialty: "Tajweed & Qira'at",
  },
  {
    id: 'u2',
    name: 'Ahmed Martin',
    email: 'parent@nur.com',
    password: 'parent123',
    role: 'parent',
  },
];

const seedStudents: Student[] = [
  {
    id: 's1',
    name: 'Yusuf Martin',
    age: 10,
    level: 'Débutant',
    parentId: 'u2',
    sessions: [
      {
        id: 'ss1',
        date: '2026-04-20',
        present: true,
        discipline: 'excellent',
        memorization: 'Al-Fatiha (1-7)',
        comment: 'Excellent travail, très attentif.',
        professorId: 'u1',
      },
      {
        id: 'ss2',
        date: '2026-04-22',
        present: true,
        discipline: 'bon',
        memorization: 'Al-Ikhlas (1-4)',
        comment: 'Bonne récitation, à revoir la prononciation.',
        professorId: 'u1',
      },
    ],
  },
  {
    id: 's2',
    name: 'Fatima Martin',
    age: 8,
    level: 'Débutant',
    parentId: 'u2',
    sessions: [
      {
        id: 'ss3',
        date: '2026-04-21',
        present: true,
        discipline: 'excellent',
        memorization: 'Al-Fatiha (1-3)',
        comment: 'Très motivée, excellente mémoire.',
        professorId: 'u1',
      },
    ],
  },
];

function init() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
  }
  if (!localStorage.getItem(STUDENTS_KEY)) {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(seedStudents));
  }
}

export function getUsers(): User[] {
  if (typeof window === 'undefined') return seedUsers;
  init();
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

export function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getStudents(): Student[] {
  if (typeof window === 'undefined') return seedStudents;
  init();
  return JSON.parse(localStorage.getItem(STUDENTS_KEY) || '[]');
}

export function saveStudents(students: Student[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

export function findUser(email: string, password: string): User | null {
  return getUsers().find(u => u.email === email && u.password === password) ?? null;
}

const TOP_KEY = 'nur_top';

export function getTopStudents(): TopEntry[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(TOP_KEY) || '[]');
}

export function saveTopStudents(top: TopEntry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOP_KEY, JSON.stringify(top));
}
