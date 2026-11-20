import * as THREE from "three";

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Big ambient starfield filling the whole journey volume. */
export function makeStarField(count: number, zMin = -560, zMax = 40, spread = 130) {
  const pos = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const phase = new Float32Array(count);
  const color = new Float32Array(count * 3);
  const palette = [
    new THREE.Color("#ffffff"),
    new THREE.Color("#cdd8ff"),
    new THREE.Color("#a8b8ff"),
    new THREE.Color("#ffd9ec"),
    new THREE.Color("#c9b8ff"),
  ];
  for (let i = 0; i < count; i++) {
    pos[i * 3] = rand(-spread, spread);
    pos[i * 3 + 1] = rand(-spread * 0.6, spread * 0.6);
    pos[i * 3 + 2] = rand(zMin, zMax);
    size[i] = rand(0.5, 2.4) * (Math.random() < 0.06 ? 2.4 : 1);
    phase[i] = rand(0, Math.PI * 2);
    const c = palette[(Math.random() * palette.length) | 0];
    color.set([c.r, c.g, c.b], i * 3);
  }
  return { pos, size, phase, color };
}

/** Fine dust layer — tiny dim points drifting close to the path. */
export function makeDust(count: number, zMin = -540, zMax = 30, spread = 60) {
  const pos = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = rand(-spread, spread);
    pos[i * 3 + 1] = rand(-spread * 0.5, spread * 0.5);
    pos[i * 3 + 2] = rand(zMin, zMax);
    phase[i] = rand(0, Math.PI * 2);
  }
  return { pos, phase };
}

/**
 * Hyperspace streaks — pairs of vertices for THREE.LineSegments.
 * Each pair forms a short line parallel to the camera's travel axis.
 */
export function makeStreaks(count: number, zMin = -540, zMax = 30) {
  const pos = new Float32Array(count * 6);
  const tint = new Float32Array(count * 6);
  const c1 = new THREE.Color("#9db4ff");
  const c2 = new THREE.Color("#e0b8ff");
  for (let i = 0; i < count; i++) {
    // keep streaks off the exact centre so they read as "passing by"
    const ang = rand(0, Math.PI * 2);
    const r = rand(6, 55);
    const x = Math.cos(ang) * r;
    const y = Math.sin(ang) * r * 0.6;
    const z = rand(zMin, zMax);
    const len = rand(1.5, 5);
    const c = Math.random() > 0.5 ? c1 : c2;
    pos.set([x, y, z, x, y, z - len], i * 6);
    tint.set([c.r, c.g, c.b, c.r * 0.1, c.g * 0.1, c.b * 0.1], i * 6);
  }
  return { pos, tint };
}

/** Cylinder of particles forming the cosmic tunnel. */
export function makeTunnelParticles(count: number, zMin = -150, zMax = -350, rMin = 4.5, rMax = 11) {
  const pos = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const palette = [new THREE.Color("#6a4dff"), new THREE.Color("#b06bff"), new THREE.Color("#5f8dff"), new THREE.Color("#ff9ddb"), new THREE.Color("#cfd8ff")];
  for (let i = 0; i < count; i++) {
    const a = rand(0, Math.PI * 2);
    const r = rand(rMin, rMax);
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = Math.sin(a) * r;
    pos[i * 3 + 2] = rand(zMin, zMax);
    const c = palette[(Math.random() * palette.length) | 0];
    color.set([c.r, c.g, c.b], i * 3);
    phase[i] = rand(0, Math.PI * 2);
  }
  return { pos, color, phase };
}

/** Helical light trails for the tunnel (THREE.Line geometry). */
export function makeHelix(zMin: number, zMax: number, radius: number, turns: number, phase: number) {
  const pts: THREE.Vector3[] = [];
  const steps = 220;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = phase + t * Math.PI * 2 * turns;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, zMin + t * (zMax - zMin)));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
}
