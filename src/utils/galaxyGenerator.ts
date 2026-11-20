import * as THREE from "three";

export interface GalaxyData {
  pos: Float32Array;
  color: Float32Array;
  size: Float32Array;
  phase: Float32Array;
}

/** Procedural spiral galaxy (Bruno Simon style) in the XY plane. */
export function makeGalaxy(opts: {
  count?: number;
  radius?: number;
  branches?: number;
  spin?: number;
  randomness?: number;
}): GalaxyData {
  const {
    count = 26000,
    radius = 55,
    branches = 4,
    spin = 1.4,
    randomness = 0.45,
  } = opts;
  const pos = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const phase = new Float32Array(count);
  const cIn = new THREE.Color("#ffd9f2");   // hot pink-white core
  const cMid = new THREE.Color("#8a5cff");  // violet arms
  const cOut = new THREE.Color("#3350ff");  // deep blue edge
  const tmp = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 1.7) * radius;
    const branch = (i % branches) * ((Math.PI * 2) / branches);
    const angle = branch + r * (spin / radius);
    const rx = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1)) * randomness * r * 0.5;
    const ry = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1)) * randomness * r * 0.5;
    const rz = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1)) * randomness * r * 0.28;
    pos[i * 3] = Math.cos(angle) * r + rx;
    pos[i * 3 + 1] = Math.sin(angle) * r + ry;
    pos[i * 3 + 2] = rz;

    const t = r / radius;
    if (t < 0.5) tmp.lerpColors(cIn, cMid, t * 2);
    else tmp.lerpColors(cMid, cOut, (t - 0.5) * 2);
    // sprinkle a few warm stars
    if (Math.random() < 0.05) tmp.set("#ffcf9e");
    color.set([tmp.r, tmp.g, tmp.b], i * 3);
    size[i] = 0.5 + Math.random() * 1.7 * (1 - t * 0.55);
    phase[i] = Math.random() * Math.PI * 2;
  }
  return { pos, color, size, phase };
}
