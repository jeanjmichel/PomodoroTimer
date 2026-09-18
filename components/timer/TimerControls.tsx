export interface TimerControlsProps {
  status: 'idle' | 'running' | 'paused' | 'stopped';
  phase: 'focus' | 'rest';
  isLoopEnabled: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
  onToggleLoop: (enabled: boolean) => void;
}

export function TimerControls({
  status,
  phase,
  isLoopEnabled,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  onToggleLoop,
}: TimerControlsProps): JSX.Element {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {status === 'idle' || status === 'stopped' ? (
          <button type="button" onClick={onStart} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
            Start
          </button>
        ) : null}

        {status === 'running' ? (
          <button type="button" onClick={onPause} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-400">
            Pause
          </button>
        ) : null}

        {status === 'paused' ? (
          <button type="button" onClick={onResume} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
            Resume
          </button>
        ) : null}

        {status === 'running' || status === 'paused' ? (
          <button type="button" onClick={onStop} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Stop
          </button>
        ) : null}

        <button type="button" onClick={onReset} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Restart
        </button>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={isLoopEnabled}
          onChange={(event) => onToggleLoop(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        {phase === 'focus' ? 'Loop focus/rest cycle' : 'Loop rest/focus cycle'}
      </label>
    </div>
  );
}
