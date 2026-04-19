'use client';

import { useDB } from '@/lib/hooks/useDB';
import { getPhase, getPhaseInfo } from '@/lib/seed';
import { getCompletionPercentage } from '@/lib/utils';
import ProgressBar from '@/components/ProgressBar';
import StreakBadge from '@/components/StreakBadge';
import { useMemo } from 'react';

export default function ProgressPage() {
  const { isReady, currentDay, streak, sessions, getCompletedCount, startDate, moods } = useDB();

  const completedCount = getCompletedCount();
  const completionPct = getCompletionPercentage(completedCount);
  const phase = getPhase(currentDay);
  const phaseInfo = getPhaseInfo(phase);

  // Group and average moods by date for the graph
  const moodGraphData = useMemo(() => {
    if (!moods || moods.length === 0) return [];
    const grouped = {};
    moods.forEach(m => {
      if (!grouped[m.date]) grouped[m.date] = { moodSum: 0, energySum: 0, count: 0 };
      grouped[m.date].moodSum += m.mood;
      grouped[m.date].energySum += m.energy;
      grouped[m.date].count += 1;
    });

    const sortedDates = Object.keys(grouped).sort();
    return sortedDates.map(date => {
      const g = grouped[date];
      return {
        date,
        mood: g.moodSum / g.count,
        energy: g.energySum / g.count
      };
    });
  }, [moods]);

  // Map graph values to coordinates (Scale 1 to 5)
  const graphPoints = useMemo(() => {
    if (moodGraphData.length < 2) return null;
    const width = 300;
    const height = 100;
    const paddingX = 10;
    const paddingY = 10;
    
    const stepX = (width - paddingX * 2) / (moodGraphData.length - 1);
    
    // Y mapped between 1 and 5
    const getY = (val) => height - paddingY - ((val - 1) / 4) * (height - paddingY * 2);

    const moodPath = moodGraphData.map((d, i) => `${paddingX + i * stepX},${getY(d.mood)}`).join(' L ');
    const energyPath = moodGraphData.map((d, i) => `${paddingX + i * stepX},${getY(d.energy)}`).join(' L ');
    
    return { moodPath: `M ${moodPath}`, energyPath: `M ${energyPath}`, width, height };
  }, [moodGraphData]);

  // Build 60-day grid
  const dayGrid = useMemo(() => {
    const completedDates = new Set(
      (sessions || []).filter(s => s.completed).map(s => s.date)
    );

    const days = [];
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 60; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const isToday = date.getTime() === today.getTime();
      const isPast = date < today;
      const isCompleted = completedDates.has(dateStr);

      let status = 'future';
      if (isToday) status = isCompleted ? 'completed today' : 'today';
      else if (isPast) status = isCompleted ? 'completed' : 'missed';

      days.push({ day: i + 1, date: dateStr, status, isToday });
    }

    return days;
  }, [sessions, startDate]);

  // Weekly consistency
  const weeklyData = useMemo(() => {
    const weeks = [];
    for (let i = 0; i < 60; i += 7) {
      const weekDays = dayGrid.slice(i, i + 7);
      const completed = weekDays.filter(d => d.status.includes('completed')).length;
      const total = weekDays.filter(d => d.status !== 'future').length;
      weeks.push({ week: Math.floor(i / 7) + 1, completed, total: Math.max(total, 1) });
    }
    return weeks;
  }, [dayGrid]);

  if (!isReady) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="app-container progress-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="text-heading">Progress</h1>
        <StreakBadge streak={streak} />
      </div>

      {/* Stats */}
      <div className="stat-cards" style={{ animation: 'slideUp 0.4s ease both 0.1s' }}>
        <div className="stat-card">
          <div className="stat-value">{completionPct}%</div>
          <div className="stat-label">Complete</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{streak}</div>
          <div className="stat-label">Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>P{phase}</div>
          <div className="stat-label">{phaseInfo.name}</div>
        </div>
      </div>

      {/* Progress Chart */}
      {graphPoints ? (
        <div className="card" style={{ marginTop: 'var(--space-lg)', animation: 'slideUp 0.4s ease both 0.15s' }}>
          <div className="text-caption" style={{ marginBottom: 'var(--space-md)' }}>Mood & Energy Trends</div>
          <div style={{ position: 'relative', width: '100%', maxWidth: '100%', overflowX: 'auto', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
            <svg viewBox={`0 0 ${graphPoints.width} ${graphPoints.height}`} style={{ width: '100%', height: 'auto', minWidth: '300px' }}>
              <path 
                d={graphPoints.energyPath} 
                fill="none" 
                stroke="var(--accent-secondary)" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d={graphPoints.moodPath} 
                fill="none" 
                stroke="var(--accent-primary)" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', background: 'var(--accent-primary)', borderRadius: '50%' }}></span> Mood
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', background: 'var(--accent-secondary)', borderRadius: '50%' }}></span> Energy
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
          <p className="text-small" style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Keep logging your mood to see trends!</p>
        </div>
      )}

      {/* Progress bar */}
      <div className="card" style={{ marginTop: 'var(--space-xl)', animation: 'slideUp 0.4s ease both 0.2s' }}>
        <ProgressBar current={currentDay} total={60} label="Day Progress" />
      </div>

      {/* 60-day grid */}
      <div className="card" style={{ marginTop: 'var(--space-lg)', animation: 'slideUp 0.4s ease both 0.3s' }}>
        <div className="text-caption" style={{ marginBottom: 'var(--space-md)' }}>60-Day Map</div>
        <div className="progress-grid">
          {dayGrid.map((d) => (
            <div
              key={d.day}
              className={`progress-day ${d.status.includes('completed') ? 'completed' : ''} ${d.status === 'missed' ? 'missed' : ''} ${d.isToday ? 'today' : ''} ${d.status === 'future' ? 'future' : ''} ${d.status === 'empty' ? 'empty' : ''}`}
              title={`Day ${d.day} - ${d.date}`}
            >
              {d.day}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-md)', justifyContent: 'center' }}>
          {[
            { cls: 'completed', label: 'Done' },
            { cls: 'missed', label: 'Missed' },
            { cls: 'today', label: 'Today' },
            { cls: 'future', label: 'Upcoming' },
          ].map(l => (
            <div key={l.cls} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div className={`progress-day ${l.cls}`} style={{ width: '14px', height: '14px', fontSize: '0.5rem', aspectRatio: 'auto' }} />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly consistency */}
      <div className="card" style={{ marginTop: 'var(--space-lg)', animation: 'slideUp 0.4s ease both 0.4s' }}>
        <div className="text-caption" style={{ marginBottom: 'var(--space-md)' }}>Weekly Consistency</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {weeklyData.map(w => (
            <div key={w.week} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: '50px' }}>
                Week {w.week}
              </span>
              <div style={{ flex: 1, height: '8px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(w.completed / 7) * 100}%`,
                  background: w.completed >= 5 ? 'var(--gradient-success)' : w.completed >= 3 ? 'var(--gradient-primary)' : 'var(--gradient-fire)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 1s ease',
                }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minWidth: '30px', textAlign: 'right' }}>
                {w.completed}/7
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase info */}
      <div className="card" style={{
        marginTop: 'var(--space-lg)',
        borderColor: `${phaseInfo.color}30`,
        animation: 'slideUp 0.4s ease both 0.5s',
      }}>
        <div className="text-caption" style={{ color: phaseInfo.color, marginBottom: 'var(--space-sm)' }}>
          Current Phase
        </div>
        <h3 className="text-subheading" style={{ marginBottom: 'var(--space-xs)' }}>
          Phase {phase}: {phaseInfo.name}
        </h3>
        <p className="text-small">{phaseInfo.description}</p>
        <p className="text-small" style={{ marginTop: 'var(--space-xs)', color: 'var(--text-muted)' }}>
          Days {phaseInfo.days}
        </p>
      </div>
    </div>
  );
}
