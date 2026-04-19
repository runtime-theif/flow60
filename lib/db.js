'use client';

import Dexie from 'dexie';

const db = new Dexie('Flow60DB');

db.version(1).stores({
  plans: '++id, name, duration',
  exercises: '++id, name, phase, sessionType',
  sessions: '++id, date, planDay, sessionType, completed',
  moods: '++id, date',
  progress: '++id, date, streak',
  photos: '++id, date, type',
  settings: 'key',
});

export default db;
