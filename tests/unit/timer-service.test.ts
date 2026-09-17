import { describe, expect, it } from 'vitest';

import { createDefaultTimerSettings, createSessionState, createTimerSettings, pauseSession, resetSession, resumeSession, startSession, stopSession } from '@/domain/timer/timer-service';

describe('timer service', () => {
  it('creates a session from the selected settings', () => {
    const settings = createTimerSettings(1500, true);
    const state = createSessionState(settings);

    expect(state.phase).toBe('focus');
    expect(state.remainingSeconds).toBe(1500);
    expect(state.isLoopEnabled).toBe(true);
    expect(state.restDurationSeconds).toBe(300);
  });

  it('creates a default timer configuration', () => {
    const settings = createDefaultTimerSettings();

    expect(settings.focusDurationSeconds).toBe(1500);
    expect(settings).not.toHaveProperty('restDurationSeconds');
    expect(settings.autoRepeat).toBe(true);
  });

  it('starts, pauses, resumes, stops, and resets session state in the expected order', () => {
    const session = createSessionState(createTimerSettings(600, true));
    const started = startSession(session);
    const paused = pauseSession(started);
    const resumed = resumeSession(paused);
    const stopped = stopSession(resumed);
    const reset = resetSession(stopped);

    expect(started.status).toBe('running');
    expect(paused.status).toBe('paused');
    expect(resumed.status).toBe('running');
    expect(stopped.status).toBe('stopped');
    expect(reset.status).toBe('idle');
    expect(reset.remainingSeconds).toBe(600);
    expect(reset.restDurationSeconds).toBe(300);
  });
});
