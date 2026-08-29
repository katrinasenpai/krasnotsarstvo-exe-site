/** A short in-browser signal created only after a deliberate user action. */
export function playIskinProjectionSignal() {
  const AudioContextConstructor = window.AudioContext
    ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextConstructor) return;

  const context = new AudioContextConstructor();
  const now = context.currentTime;
  const master = context.createGain();
  const shimmer = context.createGain();
  const carrier = context.createOscillator();
  const overtone = context.createOscillator();

  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.075, now + 0.03);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);

  shimmer.gain.setValueAtTime(0.0001, now);
  shimmer.gain.exponentialRampToValueAtTime(0.045, now + 0.09);
  shimmer.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

  carrier.type = 'sine';
  carrier.frequency.setValueAtTime(392, now);
  carrier.frequency.exponentialRampToValueAtTime(784, now + 0.46);

  overtone.type = 'triangle';
  overtone.frequency.setValueAtTime(1175, now + 0.08);
  overtone.frequency.exponentialRampToValueAtTime(1568, now + 0.5);

  carrier.connect(master);
  overtone.connect(shimmer);
  shimmer.connect(master);
  master.connect(context.destination);

  carrier.start(now);
  overtone.start(now + 0.08);
  carrier.stop(now + 0.66);
  overtone.stop(now + 0.58);

  void context.resume();
  window.setTimeout(() => void context.close(), 900);
}
