'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDB } from '@/lib/hooks/useDB';
import { getPhase, getPhaseInfo } from '@/lib/seed';
import { getMotivationalQuote, getCompletionPercentage } from '@/lib/utils';
import ProgressBar from '@/components/ProgressBar';
import StreakBadge from '@/components/StreakBadge';
import MoodSlider from '@/components/MoodSlider';

export default function Dashboard() {
  const router = useRouter();
  const { 
    isReady, currentDay, streak, insight, 
    todayMood, saveMood, hasTodaySession, getCompletedCount 
  } = useDB();

  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [moodSaved, setMoodSaved] = useState(false);
  const [quote] = useState(getMotivationalQuote());

  useEffect(() => {
    if (todayMood) {
      setMood(todayMood.mood);
      setEnergy(todayMood.energy);
      setMoodSaved(true);
    }
  }, [todayMood]);

  const handleSaveMood = useCallback(async () => {
    await saveMood(mood, energy);
    setMoodSaved(true);
  }, [mood, energy, saveMood]);

  const handleStartSession = useCallback((type) => {
    router.push(`/session?type=${type}`);
  }, [router]);

  if (!isReady) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">Flow60</div>
        <div className="loading-spinner" />
      </div>
    );
  }

  const phase = getPhase(currentDay);
  const phaseInfo = getPhaseInfo(phase);
  const completedCount = getCompletedCount();
  const completionPct = getCompletionPercentage(completedCount);
  const morningDone = hasTodaySession('morning');
  const eveningDone = hasTodaySession('evening');

  return (
    <div className="app-container">
      {/* Header */}
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
          <StreakBadge streak={streak} />
        </div>

        <div className="day-count">Day {currentDay}</div>
        <div className="day-label">of 60</div>

        <p className="motivational-text">
          {completionPct > 0 
            ? `You're ${completionPct}% through your transformation` 
            : quote
          }
        </p>
      </div>

      {/* Progress */}
      <div style={{ animation: 'slideUp 0.4s ease both 0.1s' }}>
        <ProgressBar current={currentDay} total={60} label="Overall Progress" />
      </div>

      {/* Phase Badge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-lg)', animation: 'slideUp 0.4s ease both 0.15s' }}>
        <div 
          className="phase-badge" 
          style={{ 
            background: `${phaseInfo.color}15`, 
            color: phaseInfo.color,
            border: `1px solid ${phaseInfo.color}30`,
          }}
        >
          Phase {phase}: {phaseInfo.name}
        </div>
      </div>

      {/* Session Cards */}
      <div className="session-cards" style={{ animation: 'slideUp 0.4s ease both 0.2s' }}>
        <div 
          className={`session-card ${morningDone ? 'completed' : ''}`}
          onClick={() => !morningDone && handleStartSession('morning')}
          style={{ cursor: morningDone ? 'default' : 'pointer' }}
        >
          <div className="session-card-info">
            <div className="session-card-title">🌅 Morning Routine</div>
            <div className="session-card-meta">
              {morningDone ? 'Completed' : '10-15 min • Foundation exercises'}
            </div>
          </div>
          <div className="session-card-status">
            {morningDone ? '✅' : '→'}
          </div>
        </div>

        <div 
          className={`session-card ${eveningDone ? 'completed' : ''}`}
          onClick={() => !eveningDone && handleStartSession('evening')}
          style={{ cursor: eveningDone ? 'default' : 'pointer' }}
        >
          <div className="session-card-info">
            <div className="session-card-title">🌙 Night Workout</div>
            <div className="session-card-meta">
              {eveningDone 
                ? 'Completed' 
                : `30-40 min • ${phaseInfo.name}`
              }
            </div>
          </div>
          <div className="session-card-status">
            {eveningDone ? '✅' : '→'}
          </div>
        </div>
      </div>

      {/* Mood & Energy */}
      <div className="card" style={{ marginTop: 'var(--space-xl)', animation: 'slideUp 0.4s ease both 0.3s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <span className="text-caption">How are you feeling?</span>
          {moodSaved && (
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)', fontWeight: 500 }}>✓ Saved</span>
          )}
        </div>
        <MoodSlider
          mood={mood}
          energy={energy}
          onMoodChange={(v) => { setMood(v); setMoodSaved(false); }}
          onEnergyChange={(v) => { setEnergy(v); setMoodSaved(false); }}
        />
        {!moodSaved && (
          <button 
            className="btn btn-secondary" 
            onClick={handleSaveMood}
            style={{ marginTop: 'var(--space-md)', width: '100%', fontSize: '0.875rem' }}
          >
            Save Mood
          </button>
        )}
      </div>

      {/* Insight */}
      <div className="insight-card">
        <div className="insight-label">💡 Insight</div>
        <div className="insight-text">{insight}</div>
      </div>
    </div>
  );
}
