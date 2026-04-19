'use client';

export default function StreakBadge({ streak }) {
  if (streak === 0) return null;

  return (
    <div className="streak-badge" style={{ animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
      <span className="fire">🔥</span>
      <span>{streak} day streak</span>
    </div>
  );
}
