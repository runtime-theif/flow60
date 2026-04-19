'use client';

import { useState, useEffect } from 'react';

const PHASES = [
  { p: 1, name: 'Activation + Base', description: 'Learn form. Wake muscles. Build consistency.', days: '1–14', color: '#4ecdc4', exercises: ['Incline Push-ups', 'Squats', 'Glute Bridge Hold', 'Backpack Rows', 'Plank'] },
  { p: 2, name: 'Strength Building', description: 'Build strength + stability. Start building visible muscle.', days: '15–40', color: '#ff6b6b', exercises: ['Push-ups', 'Pike Push-ups', 'Bulgarian Split Squats', 'Calf Raises'] },
  { p: 3, name: 'Shape + Intensity', description: 'Push aesthetics. Shoulder width. Athletic look.', days: '41–60', color: '#ffd93d', exercises: ['Decline Push-ups', 'Lunges', 'Side Plank', 'Jump Squats (Finisher)'] },
];

export default function PlanPage() {
  const [alarmTime, setAlarmTime] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const time = localStorage.getItem('flow60_alarm_time');
    if (time) setAlarmTime(time);
  }, []);

  const handleSaveAlarm = () => {
    localStorage.setItem('flow60_alarm_time', alarmTime);
    
    // Attempt to notify user we are requesting permissions
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="app-container" style={{ paddingBottom: '100px' }}>
      <h1 className="text-heading" style={{ marginBottom: 'var(--space-md)' }}>Program Plan</h1>

      {/* Goal Display */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)', animation: 'slideUp 0.3s ease both' }}>
        <span className="text-caption" style={{ color: 'var(--accent-secondary)' }}>Ultimate Goal</span>
        <h2 style={{ fontSize: '1.25rem', marginTop: 'var(--space-xs)', marginBottom: 'var(--space-xs)' }}>
          Build an Aesthetic Physique & Flexibility
        </h2>
        <p className="text-small" style={{ color: 'var(--text-muted)' }}>
          A 60-day behavior reinforcement system. Focus solely on execution. Less input, more output.
        </p>
      </div>

      {/* Alarm Scheduler */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)', animation: 'slideUp 0.4s ease both' }}>
        <span className="text-caption" style={{ color: 'var(--accent-primary)' }}>Audio Scheduler</span>
        <p className="text-small" style={{ marginTop: 'var(--space-xs)', marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
          Set your daily workout time. Keep this app open in the background to receive motivational audio alerts.
        </p>
        
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <input 
            type="time" 
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '1.1rem',
              outline: 'none',
              flex: 1
            }}
          />
          <button 
            className="btn btn-primary" 
            onClick={handleSaveAlarm}
            style={{ padding: '0 24px', height: '48px' }}
          >
            {saved ? 'Saved!' : 'Set Alarm'}
          </button>
        </div>
      </div>

      {/* Phases */}
      <h3 className="text-subheading" style={{ marginBottom: 'var(--space-md)', animation: 'slideUp 0.5s ease both' }}>Phase Timeline</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {PHASES.map((phase, idx) => (
          <div key={phase.p} className="card" style={{ borderColor: `${phase.color}30`, animation: `slideUp 0.6s ease both ${idx * 0.1}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)' }}>
              <div>
                <span className="text-caption" style={{ color: phase.color }}>Days {phase.days}</span>
                <h4 style={{ fontSize: '1.1rem', marginTop: '2px' }}>Phase {phase.p}: {phase.name}</h4>
              </div>
            </div>
            
            <p className="text-small" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
              {phase.description}
            </p>
            
            <div>
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>Key Movements</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {phase.exercises.map(ex => (
                  <span key={ex} style={{
                    fontSize: '0.75rem',
                    background: 'var(--bg-elevated)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    color: 'var(--text-accent)'
                  }}>
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
