import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'flow60-local-db.json');

function readDB() {
  if (!fs.existsSync(dbPath)) {
    const defaultDB = {
      startDate: new Date().toISOString().split('T')[0],
      sessions: [],
      moods: []
    };
    fs.writeFileSync(dbPath, JSON.stringify(defaultDB, null, 2));
    return defaultDB;
  }
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json(db);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to read DB' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { action, payload } = await request.json();
    const db = readDB();
    const today = new Date().toISOString().split('T')[0];

    if (action === 'addMood') {
      db.moods.push({
        date: today,
        mood: payload.mood,
        energy: payload.energy,
        createdAt: new Date().toISOString()
      });
      writeDB(db);
    } else if (action === 'addSession') {
      db.sessions.push({
        ...payload,
        date: payload.date || today,
        createdAt: new Date().toISOString()
      });
      writeDB(db);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
