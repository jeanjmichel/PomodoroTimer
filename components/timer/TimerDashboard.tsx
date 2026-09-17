'use client';

import { useEffect, useMemo, useState } from 'react';

import { createDefaultTimerSettings, createSessionState } from '@/domain/timer/timer-service';
import { NotificationBanner } from '@/components/ui/NotificationBanner';
import { useNotification } from '@/hooks/useNotification';
import { useTimer } from '@/hooks/useTimer';
import { TimerControls } from '@/components/timer/TimerControls';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerSettingsForm } from '@/components/timer/TimerSettingsForm';

export function TimerDashboard(): JSX.Element {
  const defaultSettings = useMemo(() => createDefaultTimerSettings(), []);
  const { timerState, start, pause, resume, stop, reset, updateSettings } = useTimer(defaultSettings);
  const { notification, showNotification, dismiss } = useNotification();
  const [localSettings, setLocalSettings] = useState(defaultSettings);

  useEffect(() => {
    if (!timerState.notificationEvent) {
      return;
    }

    const phase = timerState.notificationEvent.type === 'focus-complete' ? 'focus' : 'rest';
    showNotification(timerState.notificationEvent.message, phase);
  }, [showNotification, timerState.notificationEvent]);

  const handleFocusChange = (seconds: number): void => {
    const nextSettings = { ...localSettings, focusDurationSeconds: seconds };
    setLocalSettings(nextSettings);
    updateSettings(nextSettings);
  };

  const handleAutoRepeat = (checked: boolean): void => {
    const nextSettings = { ...localSettings, autoRepeat: checked };
    setLocalSettings(nextSettings);
    updateSettings(nextSettings);
  };

  const handleCustomApply = (minutes: number, seconds: number): void => {
    const totalSeconds = minutes * 60 + seconds;
    const nextSettings = { ...localSettings, focusDurationSeconds: totalSeconds };
    setLocalSettings(nextSettings);
    updateSettings(nextSettings);
  };

  const handleToggleLoop = (enabled: boolean): void => {
    const nextSettings = { ...localSettings, autoRepeat: enabled };
    setLocalSettings(nextSettings);
    updateSettings(nextSettings);
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Focus Timer</p>
          <h1 className="mt-2 text-3xl font-black sm:text-5xl">Work in rhythm</h1>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <TimerDisplay remainingSeconds={timerState.remainingSeconds} phase={timerState.phase} status={timerState.status} />
            <NotificationBanner message={notification.message} visible={notification.visible} phase={timerState.phase} />
            <TimerControls
              status={timerState.status}
              phase={timerState.phase}
              isLoopEnabled={timerState.isLoopEnabled}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onStop={stop}
              onReset={reset}
              onToggleLoop={handleToggleLoop}
            />
          </section>

          <section>
            <TimerSettingsForm
              focusDurationSeconds={localSettings.focusDurationSeconds}
              autoRepeat={localSettings.autoRepeat}
              onFocusChange={handleFocusChange}
              onAutoRepeatChange={handleAutoRepeat}
              onCustomSubmit={handleCustomApply}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
