import { useCallback, useEffect, useState } from 'react';

import { playSessionTone } from '@/lib/browser-audio';

export interface NotificationState {
  visible: boolean;
  message: string;
}

export function useNotification(): {
  notification: NotificationState;
  showNotification: (message: string, phase: 'focus' | 'rest') => void;
  dismiss: () => void;
} {
  const [notification, setNotification] = useState<NotificationState>({ visible: false, message: '' });

  useEffect(() => {
    if (!notification.visible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNotification((current) => ({ ...current, visible: false }));
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [notification.visible]);

  const showNotification = useCallback((message: string, phase: 'focus' | 'rest'): void => {
    setNotification({ visible: true, message });
    playSessionTone(phase);
  }, []);

  const dismiss = useCallback((): void => {
    setNotification({ visible: false, message: '' });
  }, []);

  return { notification, showNotification, dismiss };
}
