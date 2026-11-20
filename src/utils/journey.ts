/**
 * Shared mutable journey state — read by 3D components every frame
 * without triggering React re-renders.
 */
export const journey = {
  /** raw scroll progress 0..1 (from ScrollTrigger) */
  progress: 0,
  /** damped progress — what the camera actually follows */
  smooth: 0,
  /** smoothed scroll velocity (for hyperspace intensity) */
  velocity: 0,
  /** normalised mouse -1..1 */
  mouse: { x: 0, y: 0 },
  /** user pressed "Enter Her Universe" */
  active: false,
};

/** Master scroll timeline stages (progress ranges). */
export const STAGES = {
  intro: [0.0, 0.15],
  hyperspace: [0.15, 0.3],
  approach: [0.3, 0.5],
  galaxyEntry: [0.5, 0.68],
  tunnel: [0.68, 0.82],
  memories: [0.82, 0.92],
  reveal: [0.92, 1.0],
} as const;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** normalised position of p inside [a,b] */
export const inRange = (p: number, [a, b]: readonly [number, number]) =>
  clamp01((p - a) / (b - a));
/** smoothstep 0..1 across [a,b] */
export const sstep = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export const isMobile =
  typeof window !== "undefined" &&
  (window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));
