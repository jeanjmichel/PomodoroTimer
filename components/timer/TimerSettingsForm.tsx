import { useState, type ChangeEvent } from 'react';

import { PRESET_FOCUS_SECONDS } from '@/domain/timer/timer.constants';
import { validateCustomDuration } from '@/domain/timer/timer-validation';

export interface TimerSettingsFormProps {
  focusDurationSeconds: number;
  autoRepeat: boolean;
  onFocusChange: (seconds: number) => void;
  onAutoRepeatChange: (checked: boolean) => void;
  onCustomSubmit: (minutes: number, seconds: number) => void;
}

export function TimerSettingsForm({
  focusDurationSeconds,
  autoRepeat,
  onFocusChange,
  onAutoRepeatChange,
  onCustomSubmit,
}: TimerSettingsFormProps): JSX.Element {
  const presets = PRESET_FOCUS_SECONDS;
  const [customMinutes, setCustomMinutes] = useState(0);
  const [customSeconds, setCustomSeconds] = useState(0);

  const handleCustomInput = (event: ChangeEvent<HTMLInputElement>, setter: (value: number) => void): void => {
    const value = Number(event.target.value);
    if (Number.isNaN(value)) {
      return;
    }

    setter(value);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Focus Duration</p>
        <div className="flex flex-wrap gap-2">
          {presets.map((seconds) => (
            <button
              key={seconds}
              type="button"
              onClick={() => onFocusChange(seconds)}
              className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                focusDurationSeconds === seconds
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
              }`}
            >
              {Math.round(seconds / 60)} min
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Custom minutes
          <input
            aria-label="Custom minutes"
            type="number"
            min={0}
            max={119}
            value={customMinutes}
            onChange={(event) => handleCustomInput(event, setCustomMinutes)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none ring-0 transition focus:border-blue-500"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Custom seconds
          <input
            aria-label="Custom seconds"
            type="number"
            min={0}
            max={59}
            value={customSeconds}
            onChange={(event) => handleCustomInput(event, setCustomSeconds)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none ring-0 transition focus:border-blue-500"
          />
        </label>
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={() => {
            const result = validateCustomDuration({ minutes: customMinutes, seconds: customSeconds });
            if (result.isValid) {
              onCustomSubmit(customMinutes, customSeconds);
            }
          }}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Apply custom duration
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
        Rest period: 5 minutes (fixed by the system)
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={autoRepeat}
          onChange={(event) => onAutoRepeatChange(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        Repeat cycle automatically
      </label>
    </div>
  );
}
