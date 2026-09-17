import { formatTime } from '@/lib/format-time';

export interface TimerDisplayProps {
  remainingSeconds: number;
  phase: 'focus' | 'rest';
  status: 'idle' | 'running' | 'paused' | 'stopped';
}

export function TimerDisplay({ remainingSeconds, phase, status }: TimerDisplayProps): JSX.Element {
  const phaseLabel = phase === 'focus' ? 'Focus' : 'Rest';
  const statusLabel = status === 'idle' ? 'Ready' : status === 'running' ? 'Running' : status === 'paused' ? 'Paused' : 'Stopped';

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-sm">
      <div className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {phaseLabel}
      </div>
      <div className="mb-2 text-center text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
        {formatTime(remainingSeconds)}
      </div>
      <div className="text-center text-sm font-medium text-slate-600">{statusLabel}</div>
    </div>
  );
}
