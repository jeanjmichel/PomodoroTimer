import { describe, expect, it } from 'vitest';

import {
  advanceTimer,
  createInitialTimerState,
  pauseTimer,
  resetTimer,
  resumeTimer,
  startTimer,
} from '@/domain/timer/timer-rules';

describe('timer rules', () => {
  it('initializes a focus session with the selected duration and fixed rest duration', () => {
    const state = createInitialTimerState(1500, true);

    expect(state.phase).toBe('focus');
    expect(state.status).toBe('idle');
    expect(state.remainingSeconds).toBe(1500);
    expect(state.totalSeconds).toBe(1500);
    expect(state.restDurationSeconds).toBe(300);
  });

  it('starts and pauses a running timer', () => {
    const running = startTimer(createInitialTimerState(600, true));
    const paused = pauseTimer(running);

    expect(running.status).toBe('running');
    expect(paused.status).toBe('paused');
  });

  it('resumes from a paused timer', () => {
    const paused = pauseTimer(startTimer(createInitialTimerState(600, true)));
    const resumed = resumeTimer(paused);

    expect(resumed.status).toBe('running');
  });

  it('switches to the fixed 5-minute rest phase when a focus cycle ends and loop mode is enabled', () => {
    const state = createInitialTimerState(120, true);
    const started = startTimer(state);
    const advanced = advanceTimer({ ...started, remainingSeconds: 1 }, 1);

    expect(advanced.phase).toBe('rest');
    expect(advanced.status).toBe('running');
    expect(advanced.remainingSeconds).toBe(300);
    expect(advanced.totalSeconds).toBe(300);
    expect(advanced.restDurationSeconds).toBe(300);
    expect(advanced.notificationEvent).toMatchObject({
      type: 'focus-complete',
      message: 'Focus session complete',
      playAudio: true,
    });
  });

  it('emits a rest completion notification when the rest phase ends', () => {
    const state = createInitialTimerState(300, true);
    const started = { ...startTimer(state), phase: 'rest' as const, remainingSeconds: 1, totalSeconds: 300 };
    const advanced = advanceTimer(started, 1);

    expect(advanced.phase).toBe('focus');
    expect(advanced.status).toBe('running');
    expect(advanced.notificationEvent).toMatchObject({
      type: 'rest-complete',
      message: 'Rest period complete',
      playAudio: true,
    });
  });

  it('resets a running or paused timer back to the focus state without exposing rest duration configuration', () => {
    const state = resetTimer(startTimer(createInitialTimerState(1500, true)));

    expect(state.status).toBe('idle');
    expect(state.phase).toBe('focus');
    expect(state.remainingSeconds).toBe(1500);
    expect(state.restDurationSeconds).toBe(300);
  });
});
