import { DEFAULT_AUTO_REPEAT, DEFAULT_FOCUS_MINUTES, PRESET_FOCUS_SECONDS } from './timer.constants';
import { createInitialTimerState, pauseTimer, resetTimer, resumeTimer, startTimer, stopTimer } from './timer-rules';
import type { TimerSettings, TimerState } from './timer.types';

export function createTimerSettings(
  focusDurationSeconds: number,
  autoRepeat = DEFAULT_AUTO_REPEAT,
): TimerSettings {
  return {
    focusDurationSeconds,
    autoRepeat,
  };
}

export function createDefaultTimerSettings(): TimerSettings {
  return createTimerSettings(DEFAULT_FOCUS_MINUTES * 60, DEFAULT_AUTO_REPEAT);
}

export function getPresetFocusOptions(): number[] {
  return [...PRESET_FOCUS_SECONDS];
}

export function createSessionState(settings: TimerSettings): TimerState {
  return createInitialTimerState(settings.focusDurationSeconds, settings.autoRepeat);
}

export function startSession(state: TimerState): TimerState {
  return startTimer(state);
}

export function pauseSession(state: TimerState): TimerState {
  return pauseTimer(state);
}

export function resumeSession(state: TimerState): TimerState {
  return resumeTimer(state);
}

export function stopSession(state: TimerState): TimerState {
  return stopTimer(state);
}

export function resetSession(state: TimerState): TimerState {
  return resetTimer(state);
}
