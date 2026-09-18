export function playSessionTone(type: 'focus' | 'rest'): void {
  if (typeof window === 'undefined') {
    return;
  }

  const AudioCtor = window.Audio;

  if (!AudioCtor) {
    return;
  }

  try {
    const audio = new AudioCtor();
    const context = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();

    if (!context) {
      return;
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = type === 'focus' ? 'triangle' : 'sine';
    oscillator.frequency.value = type === 'focus' ? 880 : 440;

    gainNode.gain.value = 0.05;
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.24);
  } catch {
    // Audio is optional and should fail gracefully.
  }
}
