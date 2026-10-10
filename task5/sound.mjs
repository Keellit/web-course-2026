/** Необязательный звук: Web Audio не влияет на игровое состояние. */
const frequencies = [329.63, 392.00, 261.63, 493.88];
let audioContext;

export function playTone(index, enabled) {
  const AudioApi = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!enabled || !AudioApi) return;
  try {
    audioContext ??= new AudioApi();
    if (audioContext.state === 'suspended') void audioContext.resume().catch(() => {});
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.value = frequencies[index];
    gain.gain.setValueAtTime(0.13, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  } catch {
    // Звук дополнительный: отсутствие аудиоустройства не останавливает игру.
  }
}
