export interface NotificationBannerProps {
  message: string;
  visible: boolean;
  phase: 'focus' | 'rest';
}

export function NotificationBanner({ message, visible, phase }: NotificationBannerProps): JSX.Element | null {
  if (!visible) {
    return null;
  }

  const accentClass = phase === 'focus' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700';

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm ${accentClass}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
