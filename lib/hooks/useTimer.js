'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export function useTimer(initialSeconds = 30, onComplete = null) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const reset = useCallback((newSeconds) => {
    setSeconds(newSeconds ?? initialSeconds);
    setIsRunning(false);
    setIsPaused(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (onCompleteRef.current) onCompleteRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused]);

  const formatTime = useCallback((s) => {
    const mins = Math.floor((s ?? seconds) / 60);
    const secs = (s ?? seconds) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [seconds]);

  return {
    seconds,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
    formatTime,
    setSeconds,
  };
}
