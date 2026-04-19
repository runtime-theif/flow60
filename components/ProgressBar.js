'use client';

export default function ProgressBar({ current, total, label }) {
  const percentage = Math.min(Math.round((current / total) * 100), 100);

  return (
    <div className="progress-bar-large">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        {label && <span className="text-caption">{label}</span>}
        <span className="text-caption">{percentage}%</span>
      </div>
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%`, animation: 'progressFill 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
      </div>
    </div>
  );
}
