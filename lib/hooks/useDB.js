'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMorningExercises, getEveningExercises } from '../seed';
import { getDayNumber, calculateStreak, getWeeklyConsistency, getInsight } from '../utils';

export function useDB() {
  const [isReady, setIsReady] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [streak, setStreak] = useState(0);
  const [todaySession, setTodaySession] = useState(null);
  const [todayMood, setTodayMood] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [moods, setMoods] = useState([]);
  const [insight, setInsight] = useState('');
  const [startDate, setStartDate] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/db');
      if (!res.ok) throw new Error('API fetching failed');
      const data = await res.json();

      setStartDate(data.startDate);

      const day = getDayNumber(data.startDate);
      setCurrentDay(day);

      const allSessions = data.sessions || [];
      setSessions(allSessions);

      const today = new Date().toISOString().split('T')[0];
      const todaySes = allSessions.filter(s => s.date === today);
      setTodaySession(todaySes.length > 0 ? todaySes : null);

      const s = calculateStreak(allSessions);
      setStreak(s);

      const allMoods = data.moods || [];
      setMoods(allMoods);

      const todayMoods = allMoods.filter(m => m.date === today);
      if (todayMoods.length > 0) {
        const avgMood = Math.round(todayMoods.reduce((sum, m) => sum + m.mood, 0) / todayMoods.length);
        const avgEnergy = Math.round(todayMoods.reduce((sum, m) => sum + m.energy, 0) / todayMoods.length);
        setTodayMood({ mood: avgMood, energy: avgEnergy });
      } else {
        setTodayMood(null);
      }

      setInsight(getInsight(allSessions, allMoods));
      setIsReady(true);
    } catch (err) {
      console.error('DB init error:', err);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveMood = useCallback(async (mood, energy) => {
    await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addMood', payload: { mood, energy } })
    });
    await loadData();
  }, [loadData]);

  const saveSession = useCallback(async (sessionData) => {
    await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addSession', payload: sessionData })
    });
    await loadData();
  }, [loadData]);

  const getExercisesForToday = useCallback((sessionType) => {
    if (sessionType === 'morning') return getMorningExercises();
    return getEveningExercises(currentDay);
  }, [currentDay]);

  const hasTodaySession = useCallback((type) => {
    if (!todaySession) return false;
    return todaySession.some(s => s.sessionType === type && s.completed);
  }, [todaySession]);

  const getWeeklyData = useCallback(() => {
    return getWeeklyConsistency(sessions);
  }, [sessions]);

  const getCompletedCount = useCallback(() => {
    return sessions.filter(s => s.completed).length;
  }, [sessions]);

  return {
    isReady,
    currentDay,
    streak,
    todaySession,
    todayMood,
    sessions,
    moods,
    insight,
    startDate,
    saveMood,
    saveSession,
    getExercisesForToday,
    hasTodaySession,
    getWeeklyData,
    getCompletedCount,
    refresh: loadData,
  };
}
