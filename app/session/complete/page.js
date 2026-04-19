'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDB } from '@/lib/hooks/useDB';
import StreakBadge from '@/components/StreakBadge';
import MoodSlider from '@/components/MoodSlider';
import { useState, useCallback } from 'react';

function CompleteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { streak, currentDay, saveMood } = useDB();

  const sessionType = searchParams.get('type') || 'morning';
  const duration = parseInt(searchParams.get('duration') || '0');
  const exerciseCount = parseInt(searchParams.get('exercises') || '0');

  const [mood, setMood] = useState(4);
  const [energy, setEnergy] = useState(3);
  const [moodSaved, setMoodSaved] = useState(false);

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return mins > 0 ? `${mins}m ${s}s` : `${s}s`;
  };

  const handleSaveMood = useCallback(async () => {
    await saveMood(mood, energy);
    setMoodSaved(true);
  }, [mood, energy, saveMood]);

  return (
    <div className="app-container" style={{ paddingBottom: '40px' }}>
      <div className="completion-screen">
        <div className="completion-checkmark">✅</div>
        <h1 className="completion-title">Session Complete!</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '280px' }}>
          {sessionType === 'morning' 
            ? "Morning foundation locked in. You're building discipline." 
            : "Another step toward your transformation. Keep showing up."
          }
        </p>

        <StreakBadge streak={streak} />

        <div className="completion-stats">
          <div className="completion-stat">
            <div className="completion-stat-value">Day {currentDay}</div>
            <div className="completion-stat-label">Progress</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value">{formatDuration(duration)}</div>
            <div className="completion-stat-label">Duration</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value">{exerciseCount}</div>
            <div className="completion-stat-label">Exercises</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-value" style={{ fontSize: '1.3rem' }}>
              {streak > 0 ? '🔥' : '⭐'} {streak}
            </div>
            <div className="completion-stat-label">Streak</div>
          </div>
        </div>

        {/* Post-session mood */}
        <div className="card" style={{ width: '100%', maxWidth: '360px', marginTop: 'var(--space-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
            <span className="text-caption">How do you feel now?</span>
            {moodSaved && <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)' }}>✓ Saved</span>}
          </div>
          <MoodSlider
            mood={mood}
            energy={energy}
            onMoodChange={setMood}
            onEnergyChange={setEnergy}
            compact
          />
          {!moodSaved && (
            <button className="btn btn-secondary" onClick={handleSaveMood} style={{ width: '100%', marginTop: 'var(--space-md)', fontSize: '0.85rem' }}>
              Save
            </button>
          )}
        </div>

        <button 
          className="btn btn-primary btn-large" 
          onClick={() => router.push('/')}
          style={{ maxWidth: '320px', marginTop: 'var(--space-md)' }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={<div className="loading-screen"><div className="loading-spinner" /></div>}>
      <CompleteContent />
    </Suspense>
  );
}
