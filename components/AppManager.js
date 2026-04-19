'use client';

import { useEffect, useRef } from 'react';

export default function AppManager() {
  const isPlayingRef = useRef(false);

  // Biological Theme Injector
  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      let theme = 'night';
      if (hour >= 7 && hour < 17) {
        theme = 'day';
      } else if (hour >= 17 && hour < 20) {
        theme = 'sunset';
      }
      document.documentElement.setAttribute('data-theme', theme);
    };
    
    updateTheme();
    const interval = setInterval(updateTheme, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Alarm & Notification Manager
  useEffect(() => {
    // Request permission on mount if supported and not granted/denied
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        // Let it silently delay asking until user interacts elsewhere, 
        // but for now we prime the API.
      }
    }

    const checkAlarm = () => {
      const savedTime = localStorage.getItem('flow60_alarm_time');
      if (!savedTime) return;

      const now = new Date();
      const currentHour = String(now.getHours()).padStart(2, '0');
      const currentMin = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMin}`;

      if (currentTimeStr === savedTime && !isPlayingRef.current) {
        isPlayingRef.current = true;
        
        // Fire Notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Time for Flow60!', {
            body: 'Your scheduled workout time has arrived. Let’s get moving!',
            icon: '/favicon.ico'
          });
        }

        // Fire Speech
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance("It is time for your workout. I believe in you, let's get moving.");
          u.volume = 1;
          u.rate = 0.9;
          
          u.onend = () => {
            // Wait 61 seconds before resetting to avoid looping in the same minute
            setTimeout(() => {
              isPlayingRef.current = false;
            }, 61000);
          };

          window.speechSynthesis.speak(u);
        } else {
          // If no speech API, just timeout
          setTimeout(() => {
            isPlayingRef.current = false;
          }, 61000);
        }
      }
    };

    const alarmInterval = setInterval(checkAlarm, 10000); // Check every 10 seconds
    return () => clearInterval(alarmInterval);
  }, []);

  return null;
}
