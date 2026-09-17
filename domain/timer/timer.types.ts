export type TimerPhase = 'focus' | 'rest';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'stopped';

export interface TimerSettings {
  focusDurationSeconds: number;
  autoRepeat: boolean;
}

export interface TimerState {
  phase: TimerPhase;
  status: TimerStatus;
  remainingSeconds: number;
  totalSeconds: number;
  focusDurationSeconds: number;
  restDurationSeconds: number;
  isLoopEnabled: boolean;
  startedAt: number | null;
  lastTickAt: number | null;
  notificationEvent: NotificationEvent | null;
}

export interface NotificationEvent {
  type: 'focus-complete' | 'rest-complete' | 'session-stopped' | 'session-reset';
  message: string;
  playAudio: boolean;
}

export interface TimerValidationResult {
  isValid: boolean;
  errors: string[];
}
