'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDB } from '@/lib/hooks/useDB';
import { useTimer } from '@/lib/hooks/useTimer';
import { useAudio } from '@/lib/hooks/useAudio';

const EXERCISE_ICONS = {
  'Glute Bridge': '🍑', 'Glute Bridge Hold': '🍑',
  'Bird Dog': '🐕', 'Dead Bug': '🪲',
  'Wall Posture Hold': '🧱', 'Bodyweight Squats': '🦵', 'Squats': '🦵',
  'Incline Push-ups': '💪', 'Push-ups': '💪', 'Decline Push-ups': '💪',
  'Pike Push-ups': '🔺', 'Backpack Rows': '🎒',
  'Plank': '🪵', 'Side Plank': '🪵',
  'Bulgarian Split Squats': '🦿', 'Calf Raises': '🦶',
  'Lunges': '🚶', 'Jump Squats': '🦘',
  'Mountain Climbers': '⛰️',
};

function getExerciseIcon(name) {
  return EXERCISE_ICONS[name] || '💪';
}

function SessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionType = searchParams.get('type') || 'morning';
  const { getExercisesForToday, saveSession, currentDay } = useDB();

  const [exercises, setExercises] = useState([]);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [isStarted, setIsStarted] = useState(false);
  const [totalExercisesDone, setTotalExercisesDone] = useState(0);

  const musicRef = useRef(null);

  const audio = useAudio();
  const timer = useTimer(30, () => handleTimerComplete());

  // Load exercises
  useEffect(() => {
    const exs = getExercisesForToday(sessionType);
    setExercises(exs);
  }, [sessionType, getExercisesForToday]);

  // Init music element
  useEffect(() => {
    if (musicRef.current) {
      audio.initMusic(musicRef.current);
    }
  }, [audio.initMusic]);

  const currentExercise = exercises[currentExIndex];
  
  const totalSetsInSession = exercises.reduce((sum, ex) => sum + (ex.sets || 1), 0);
  const completedSets = exercises.slice(0, currentExIndex).reduce((sum, ex) => sum + (ex.sets || 1), 0) + (currentSet - 1);

  const handleTimerComplete = useCallback(() => {
    if (isResting) {
      setIsResting(false);
      // Start next set or exercise
      if (currentExercise && currentSet < currentExercise.sets) {
        setCurrentSet(prev => prev + 1);
        audio.playBeep();
        audio.announceEncouragement();
      } else {
        moveToNextExercise();
      }
    } else {
      // Timer exercise completed a set
      handleSetComplete();
    }
  }, [isResting, currentSet, currentExercise]);

  const handleSetComplete = useCallback(() => {
    if (!currentExercise) return;
    setTotalExercisesDone(prev => prev + 1);

    if (currentSet < currentExercise.sets) {
      // Rest between sets
      if (currentExercise.rest > 0) {
        setIsResting(true);
        timer.reset(currentExercise.rest);
        timer.start();
        audio.playBeep();
        audio.announceRest(currentExercise.rest);
      } else {
        setCurrentSet(prev => prev + 1);
        audio.playBeep();
      }
    } else {
      // All sets done, move to next exercise
      if (currentExIndex < exercises.length - 1) {
        const nextEx = exercises[currentExIndex + 1];
        if (currentExercise.rest > 0) {
          setIsResting(true);
          timer.reset(currentExercise.rest);
          timer.start();
          audio.playBeep();
          audio.announceRest(currentExercise.rest);
        } else {
          moveToNextExercise();
        }
      } else {
        // Session complete!
        completeSession();
      }
    }
  }, [currentExercise, currentSet, currentExIndex, exercises, timer, audio]);

  const moveToNextExercise = useCallback(() => {
    if (currentExIndex < exercises.length - 1) {
      setCurrentExIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      
      const nextEx = exercises[currentExIndex + 1];
      if (nextEx) {
        audio.playBeep();
        setTimeout(() => audio.announceExercise(nextEx), 300);
        if (nextEx.duration) {
          timer.reset(nextEx.duration);
          timer.start();
        }
      }
    } else {
      completeSession();
    }
  }, [currentExIndex, exercises, audio, timer]);

  const completeSession = useCallback(async () => {
    const duration = Math.round((Date.now() - sessionStartTime) / 1000);
    audio.announceCompletion();
    audio.stopMusic();

    await saveSession({
      planDay: currentDay,
      sessionType,
      exercises: exercises.map(e => e.name),
      completed: true,
      duration,
      exerciseCount: exercises.length,
    });

    router.push(`/session/complete?type=${sessionType}&duration=${duration}&exercises=${exercises.length}`);
  }, [sessionStartTime, exercises, sessionType, currentDay, saveSession, router, audio]);

  const handleStart = useCallback(() => {
    setIsStarted(true);
    audio.unlockAudio();
    audio.startMusic();
    if (exercises.length > 0) {
      const firstEx = exercises[0];
      audio.announceExercise(firstEx);
      if (firstEx.duration) {
        timer.reset(firstEx.duration);
        timer.start();
      }
    }
  }, [exercises, audio, timer]);

  const handleDoneSet = useCallback(() => {
    handleSetComplete();
  }, [handleSetComplete]);

  const handleSkip = useCallback(() => {
    moveToNextExercise();
  }, [moveToNextExercise]);

  // Countdown voice for timer exercises
  useEffect(() => {
    if (timer.isRunning && timer.seconds <= 5 && timer.seconds > 0 && !isResting) {
      audio.countDown(timer.seconds);
    }
  }, [timer.seconds, timer.isRunning, isResting, audio]);

  if (!exercises.length) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <>
      <audio ref={musicRef} src="/audio/workout-ambient.mp3" preload="auto" />
      {/* Dynamic Session Rendering */}
      {!isStarted ? (
        <div className="app-container">
          <div className="exercise-display" style={{ minHeight: '90vh' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>
              {sessionType === 'morning' ? '🌅' : '🌙'}
            </div>
            <h1 className="text-heading" style={{ marginBottom: 'var(--space-sm)' }}>
              {sessionType === 'morning' ? 'Morning Routine' : 'Night Workout'}
            </h1>
            <p className="text-small" style={{ maxWidth: '280px', textAlign: 'center' }}>
              {exercises.length} exercises • Day {currentDay}
            </p>
            <div style={{ marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', width: '100%', maxWidth: '360px' }}>
              {exercises.map((ex, i) => (
                <div key={i} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{ex.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {ex.duration ? `${ex.duration}s` : `${ex.sets}×${ex.reps}`}
                  </span>
                </div>
              ))}
            </div>
            <button 
              className="btn btn-primary btn-large" 
              onClick={handleStart}
              style={{ marginTop: 'var(--space-xl)', maxWidth: '320px' }}
            >
              Start Session →
            </button>
          </div>
        </div>
      ) : isResting ? (
        <div className="app-container">
          <div className="session-topbar">
            <span className="text-caption">Rest</span>
            <div className="session-controls">
              <button className="btn-icon" onClick={audio.toggleMute}>
                {audio.isMuted ? '🔇' : '🔊'}
              </button>
              <button className="btn-icon" onClick={audio.toggleMusic}>
                {audio.isMusicPlaying ? '🎵' : '🎶'}
              </button>
            </div>
          </div>

          <div className="rest-screen">
            <div className="rest-label">REST</div>
            <div className={`timer-display ${timer.seconds <= 5 ? 'critical' : timer.seconds <= 10 ? 'warning' : ''}`}>
              {timer.formatTime()}
            </div>
            {currentSet < currentExercise.sets ? (
              <div className="rest-next">
                Up next: <strong>{currentExercise.name}</strong>
                <span> • Set {currentSet + 1}/{currentExercise.sets}</span>
              </div>
            ) : exercises[currentExIndex + 1] ? (
              <div className="rest-next">
                Up next: <strong>{exercises[currentExIndex + 1].name}</strong>
              </div>
            ) : null}
            <button className="btn btn-ghost" onClick={() => { 
              setIsResting(false); 
              if (currentSet < currentExercise.sets) {
                setCurrentSet(prev => prev + 1);
              } else {
                moveToNextExercise();
              }
            }}>
              Skip Rest →
            </button>
          </div>
        </div>
      ) : (
        <div className="app-container">
          {/* Top bar */}
          <div className="session-topbar">
            <span className="text-caption">
              Exercise {currentExIndex + 1}/{exercises.length}
            </span>
            <div className="session-controls">
              <button className="btn-icon" onClick={audio.toggleMute}>
                {audio.isMuted ? '🔇' : '🔊'}
              </button>
              <button className="btn-icon" onClick={audio.toggleMusic}>
                {audio.isMusicPlaying ? '🎵' : '🎶'}
              </button>
              {timer.isRunning && (
                <button className="btn-icon" onClick={timer.isPaused ? timer.resume : timer.pause}>
                  {timer.isPaused ? '▶️' : '⏸️'}
                </button>
              )}
            </div>
          </div>

          {/* Progress dots */}
          <div className="session-progress">
            {exercises.map((_, i) => (
              <div 
                key={i} 
                className={`session-progress-dot ${i < currentExIndex ? 'completed' : i === currentExIndex ? 'current' : ''}`}
              />
            ))}
          </div>

          {/* Exercise */}
          <div className="exercise-display" style={{ animation: 'scaleIn 0.4s ease both' }}>
            <div className="exercise-image">
              {currentExercise.imageUrl ? (
                <img src={currentExercise.imageUrl} alt={currentExercise.name} />
              ) : (
                <div className="placeholder-icon">{getExerciseIcon(currentExercise.name)}</div>
              )}
            </div>

            <div className="exercise-name">{currentExercise.name}</div>

            <div className="exercise-info">
              {currentExercise.duration ? (
                <>
                  <div className="exercise-info-item">
                    <div className={`timer-display ${timer.seconds <= 5 ? 'critical' : timer.seconds <= 10 ? 'warning' : ''}`} style={{ fontSize: '2.5rem' }}>
                      {timer.formatTime()}
                    </div>
                    <div className="exercise-info-label">Time</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="exercise-info-item">
                    <div className="exercise-info-value">{currentExercise.reps}</div>
                    <div className="exercise-info-label">Reps</div>
                  </div>
                  <div className="exercise-info-item">
                    <div className="exercise-info-value">{currentSet}/{currentExercise.sets}</div>
                    <div className="exercise-info-label">Set</div>
                  </div>
                </>
              )}
            </div>

            <p className="exercise-description">{currentExercise.description}</p>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 'var(--space-md)', width: '100%', maxWidth: '320px', marginTop: 'var(--space-md)' }}>
              {!currentExercise.duration && (
                <button className="btn btn-primary btn-large" onClick={handleDoneSet}>
                  {currentSet < currentExercise.sets 
                    ? `Done Set ${currentSet} (${currentExercise.reps} Reps)` 
                    : currentExIndex < exercises.length - 1 
                      ? `Done → Next (${currentExercise.reps} Reps)` 
                      : `Finish! 🎉 (${currentExercise.reps} Reps)`}
                </button>
              )}
              <button className="btn btn-ghost" onClick={handleSkip} style={{ minWidth: '70px' }}>
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="loading-screen"><div className="loading-spinner" /></div>}>
      <SessionContent />
    </Suspense>
  );
}
