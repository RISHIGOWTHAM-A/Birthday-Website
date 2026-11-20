import { birthdayConfig } from "../config/birthdayConfig";

/**
 * Audio: tries the configured music file first; if missing, falls back
 * to a soft generative ambient pad via WebAudio. No autoplay — everything
 * is triggered by the "Enter Her Universe" user gesture.
 */
let ctx: AudioContext | null = null;
let musicEl: HTMLAudioElement | null = null;
let padNodes: { stop: () => void } | null = null;
let playing = false;
let listeners = new Set<(p: boolean) => void>();

const actx = () => (ctx ??= new (window.AudioContext || (window as any).webkitAudioContext)());
const emit = () => listeners.forEach((f) => f(playing));
export const onMusicChange = (f: (p: boolean) => void) => {
  listeners.add(f);
  return () => { listeners.delete(f); };
};
export const isPlaying = () => playing;

function startPad() {
  const ac = actx();
  const master = ac.createGain();
  master.gain.value = 0;
  master.gain.linearRampToValueAtTime(0.12, ac.currentTime + 4);
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  master.connect(filter).connect(ac.destination);
  const oscs: OscillatorNode[] = [];
  // gentle root + fifth + shimmer, slowly detuned
  [110, 164.81, 220, 329.63].forEach((f, i) => {
    const o = ac.createOscillator();
    o.type = i < 2 ? "sine" : "triangle";
    o.frequency.value = f;
    const g = ac.createGain();
    g.gain.value = i < 2 ? 0.5 : 0.12;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.05 + i * 0.03;
    const lg = ac.createGain();
    lg.gain.value = 0.1;
    lfo.connect(lg).connect(g.gain);
    o.connect(g).connect(master);
    o.start();
    lfo.start();
    oscs.push(o, lfo);
  });
  padNodes = { stop: () => { master.gain.linearRampToValueAtTime(0, ac.currentTime + 1.2); setTimeout(() => oscs.forEach((o) => o.stop()), 1400); } };
}

export function startMusic() {
  if (playing) return;
  playing = true;
  actx().resume();
  if (!musicEl) {
    musicEl = new Audio(birthdayConfig.music);
    musicEl.loop = true;
    musicEl.volume = 0.4;
    musicEl.addEventListener("error", () => { musicEl = null; startPad(); }, { once: true });
    musicEl.play().catch(() => { musicEl = null; startPad(); });
  } else musicEl.play().catch(() => {});
  emit();
}

export function stopMusic() {
  if (!playing) return;
  playing = false;
  musicEl?.pause();
  padNodes?.stop();
  padNodes = null;
  emit();
}

export function toggleMusic() { playing ? stopMusic() : startMusic(); }

/** Short filtered-noise whoosh (entering the universe). */
export function sfxWhoosh() {
  try {
    const ac = actx();
    const dur = 1.6;
    const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (i / d.length);
    const src = ac.createBufferSource();
    src.buffer = buf;
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(220, ac.currentTime);
    bp.frequency.exponentialRampToValueAtTime(2600, ac.currentTime + dur * 0.8);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.16, ac.currentTime + dur * 0.5);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    src.connect(bp).connect(g).connect(ac.destination);
    src.start();
  } catch { /* audio unavailable */ }
}

/** Soft two-note chime for the final reveal. */
export function sfxChime() {
  try {
    const ac = actx();
    [523.25, 783.99].forEach((f, i) => {
      const o = ac.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ac.createGain();
      const t = ac.currentTime + i * 0.35;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.1, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + 2.5);
    });
  } catch { /* audio unavailable */ }
}
