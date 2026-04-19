'use client';

import { useState, useEffect } from 'react';

const MOOD_EMOJIS = ['😞', '😐', '🙂', '😊', '😄'];
const ENERGY_EMOJIS = ['🪫', '🔋', '⚡', '💪', '🚀'];

export default function MoodSlider({ mood = 3, energy = 3, onMoodChange, onEnergyChange, compact = false, disabled = false }) {
  const [currentMood, setCurrentMood] = useState(mood);
  const [currentEnergy, setCurrentEnergy] = useState(energy);

  useEffect(() => {
    setCurrentMood(mood);
    setCurrentEnergy(energy);
  }, [mood, energy]);

  const handleMoodChange = (value) => {
    const v = parseInt(value);
    setCurrentMood(v);
    onMoodChange?.(v);
  };

  const handleEnergyChange = (value) => {
    const v = parseInt(value);
    setCurrentEnergy(v);
    onEnergyChange?.(v);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '12px' : '20px' }}>
      <div className="slider-container">
        <div className="slider-label">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Mood</span>
          <span className={`slider-emoji ${currentMood >= 3 ? 'active' : ''}`}>
            {MOOD_EMOJIS[currentMood - 1]}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={currentMood}
          onChange={(e) => handleMoodChange(e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="slider-container">
        <div className="slider-label">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Energy</span>
          <span className={`slider-emoji ${currentEnergy >= 3 ? 'active' : ''}`}>
            {ENERGY_EMOJIS[currentEnergy - 1]}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={currentEnergy}
          onChange={(e) => handleEnergyChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
