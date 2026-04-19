'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { getEncouragement } from '../utils';

export function useAudio() {
  const synthRef = useRef(null);
  const musicRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.3);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = useCallback((text, options = {}) => {
    if (isMuted || !synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.95;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    utterance.lang = 'en-US';

    // Dim music while speaking
    if (musicRef.current && isMusicPlaying) {
      musicRef.current.volume = 0.08;
      utterance.onend = () => {
        if (musicRef.current) {
          musicRef.current.volume = musicVolume;
        }
      };
    }

    synthRef.current.speak(utterance);
  }, [isMuted, isMusicPlaying, musicVolume]);

  const announceExercise = useCallback((exercise) => {
    const text = exercise.duration
      ? `${exercise.name}. ${exercise.duration} seconds. ${exercise.description?.split('.')[0] || ''}`
      : `${exercise.name}. ${exercise.sets} sets of ${exercise.reps} reps. ${exercise.description?.split('.')[0] || ''}`;
    speak(text);
  }, [speak]);

  const announceRest = useCallback((seconds) => {
    speak(`Rest. ${seconds} seconds.`, { rate: 0.85 });
  }, [speak]);

  const countDown = useCallback((number) => {
    if (number <= 5 && number > 0) {
      speak(String(number), { rate: 1.2, pitch: 1.1 });
    }
  }, [speak]);

  const announceEncouragement = useCallback(() => {
    speak(getEncouragement(), { rate: 0.9 });
  }, [speak]);

  const announceCompletion = useCallback(() => {
    speak("Session complete! Amazing work. You showed up and crushed it.", { rate: 0.85 });
  }, [speak]);

  const playBeep = useCallback(() => {
    if (isMuted || typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.value = 880;
      oscillator.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.log('Audio beep failed:', e);
    }
  }, [isMuted]);

  const startMusic = useCallback(() => {
    if (musicRef.current) {
      musicRef.current.volume = musicVolume;
      musicRef.current.play().catch(() => {});
      setIsMusicPlaying(true);
    }
  }, [musicVolume]);

  const stopMusic = useCallback(() => {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
      setIsMusicPlaying(false);
    }
  }, []);

  const toggleMusic = useCallback(() => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [isMusicPlaying, startMusic, stopMusic]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const initMusic = useCallback((audioElement) => {
    musicRef.current = audioElement;
    if (audioElement) {
      audioElement.loop = true;
      audioElement.volume = musicVolume;
    }
  }, [musicVolume]);

  const unlockAudio = useCallback(() => {
    if (synthRef.current) {
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      synthRef.current.speak(u);
    }
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        ctx.resume();
      }
    } catch(e){}
  }, []);

  return {
    speak,
    announceExercise,
    announceRest,
    countDown,
    announceEncouragement,
    announceCompletion,
    playBeep,
    startMusic,
    stopMusic,
    toggleMusic,
    toggleMute,
    initMusic,
    unlockAudio,
    isMusicPlaying,
    isMuted,
    setMusicVolume: (v) => {
      setMusicVolume(v);
      if (musicRef.current) musicRef.current.volume = v;
    },
  };
}
