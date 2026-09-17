import { useEffect, useRef, useState } from 'react';

import {
  advanceTimer,
  createInitialTimerState,
  pauseTimer,
  resetTimer,
  resumeTimer,
  startTimer,
  stopTimer,
} from '@/domain/timer/timer-rules';
import { createSessionState } from '@/domain/timer/timer-service';
import type { TimerSettings, TimerState } from '@/domain/timer/timer.types';

export interface UseTimerResult {
  timerState: TimerState;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  updateSettings: (settings: TimerSettings) => void;
}

export function useTimer(initialSettings: TimerSettings): UseTimerResult {
  const [settings, setSettings] = useState<TimerSettings>(initialSettings);
  const [timerState, setTimerState] = useState<TimerState>(() => createSessionState(initialSettings));
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerState.status !== 'running') {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimerState((current) => advanceTimer(current, 1));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState.status]);

  const updateSettings = (nextSettings: TimerSettings): void => {
    setSettings(nextSettings);
    setTimerState(createInitialTimerState(nextSettings.focusDurationSeconds, nextSettings.autoRepeat));
  };

  const start = (): void => {
    setTimerState((current) => startTimer(current));
  };

  const pause = (): void => {
    setTimerState((current) => pauseTimer(current));
  };

  const resume = (): void => {
    setTimerState((current) => resumeTimer(current));
  };

  const stop = (): void => {
    setTimerState((current) => stopTimer(current));
  };

  const reset = (): void => {
    setTimerState((current) => resetTimer(current));
  };

  return { timerState, start, pause, resume, stop, reset, updateSettings };
}
