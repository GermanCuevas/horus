import Dexie, { type Table } from 'dexie';

export interface ManuscriptItem {
  id?: number;
  projectId: number;
  parentId?: number | null; // null for root items
  type: 'prologue' | 'chapter' | 'scene' | 'epilogue' | 'folder' | 'character' | 'note';
  title: string;
  content: string; // TipTap JSON string or HTML string
  wordCount: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  meta?: Record<string, any>; // Extra info (e.g. character description, archetype, scene location)
}

export interface Project {
  id?: number;
  title: string;
  author: string;
  genre: string;
  summary: string;
  dailyGoal: number;
  totalGoal: number;
  createdAt: Date;
  updatedAt: Date;
}

export class HorusDatabase extends Dexie {
  projects!: Table<Project>;
  items!: Table<ManuscriptItem>;

  constructor() {
    super('HorusStudioDB');
    this.version(1).stores({
      projects: '++id, title, updatedAt',
      items: '++id, projectId, parentId, type, order, updatedAt'
    });
  }
}

export const db = new HorusDatabase();
