import { FIXED_REST_DURATION_SECONDS } from './timer.constants';
import type { NotificationEvent, TimerPhase, TimerState, TimerStatus } from './timer.types';

export interface TimerCycleSnapshot {
  phase: TimerPhase;
  status: TimerStatus;
  remainingSeconds: number;
  totalSeconds: number;
  isLoopEnabled: boolean;
}

function createPhaseCompletionEvent(phase: TimerPhase): NotificationEvent {
  return {
    type: phase === 'focus' ? 'focus-complete' : 'rest-complete',
    message: phase === 'focus' ? 'Focus session complete' : 'Rest period complete',
    playAudio: true,
  };
}

export function createInitialTimerState(
  focusDurationSeconds: number,
  autoRepeat: boolean,
  restDurationSeconds = FIXED_REST_DURATION_SECONDS,
): TimerState {
  return {
    phase: 'focus',
    status: 'idle',
    remainingSeconds: focusDurationSeconds,
    totalSeconds: focusDurationSeconds,
    focusDurationSeconds,
    restDurationSeconds,
    isLoopEnabled: autoRepeat,
    startedAt: null,
    lastTickAt: null,
    notificationEvent: null,
  };
}

export function startTimer(state: TimerState): TimerState {
  if (state.status === 'running') {
    return state;
  }

  return {
    ...state,
    status: 'running',
    startedAt: Date.now(),
    lastTickAt: Date.now(),
    notificationEvent: null,
  };
}

export function pauseTimer(state: TimerState): TimerState {
  if (state.status !== 'running') {
    return state;
  }

  return {
    ...state,
    status: 'paused',
    lastTickAt: null,
    notificationEvent: null,
  };
}

export function resumeTimer(state: TimerState): TimerState {
  if (state.status !== 'paused') {
    return state;
  }

  return {
    ...state,
    status: 'running',
    startedAt: Date.now(),
    lastTickAt: Date.now(),
    notificationEvent: null,
  };
}

export function stopTimer(state: TimerState): TimerState {
  return {
    ...state,
    status: 'stopped',
    remainingSeconds: state.totalSeconds,
    startedAt: null,
    lastTickAt: null,
    notificationEvent: null,
  };
}

export function resetTimer(state: TimerState): TimerState {
  const focusDuration = state.focusDurationSeconds ?? state.totalSeconds;
  const restDuration = state.restDurationSeconds ?? state.totalSeconds;

  return {
    ...state,
    phase: 'focus',
    status: 'idle',
    remainingSeconds: focusDuration,
    totalSeconds: focusDuration,
    focusDurationSeconds: focusDuration,
    restDurationSeconds: restDuration,
    startedAt: null,
    lastTickAt: null,
    notificationEvent: null,
  };
}

export function advanceTimer(state: TimerState, elapsedSeconds: number): TimerState {
  if (state.status !== 'running') {
    return state;
  }

  const nextRemaining = Math.max(0, state.remainingSeconds - elapsedSeconds);

  if (nextRemaining > 0) {
    return {
      ...state,
      remainingSeconds: nextRemaining,
      lastTickAt: Date.now(),
      notificationEvent: null,
    };
  }

  const nextPhase: TimerPhase = state.phase === 'focus' ? 'rest' : 'focus';
  const nextTotal = nextPhase === 'focus' ? state.focusDurationSeconds : state.restDurationSeconds;
  const phaseCompletionEvent = createPhaseCompletionEvent(state.phase);

  if (state.isLoopEnabled) {
    return {
      ...state,
      phase: nextPhase,
      status: 'running',
      remainingSeconds: nextTotal,
      totalSeconds: nextTotal,
      startedAt: Date.now(),
      lastTickAt: Date.now(),
      notificationEvent: phaseCompletionEvent,
    };
  }

  return {
    ...state,
    status: 'stopped',
    remainingSeconds: 0,
    startedAt: null,
    lastTickAt: null,
    notificationEvent: phaseCompletionEvent,
  };
}

export function getTimerSnapshot(state: TimerState): TimerCycleSnapshot {
  return {
    phase: state.phase,
    status: state.status,
    remainingSeconds: state.remainingSeconds,
    totalSeconds: state.totalSeconds,
    isLoopEnabled: state.isLoopEnabled,
  };
}
