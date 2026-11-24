import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { journey } from "../../utils/journey";

const VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uColC;
uniform float uSeed;
uniform float uOpacity;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float r = length(uv);
  vec2 q = uv * 2.1 + uSeed;
  float warp = fbm(q * 1.4 - uTime * 0.016);
  float n = fbm(q + warp * 1.6 + uTime * 0.02);
  vec3 col = mix(uColA, uColB, smoothstep(0.28, 0.72, n));
  col = mix(col, uColC, smoothstep(0.62, 0.95, fbm(q * 2.6 - uTime * 0.01)));
  float a = smoothstep(0.32, 0.78, n) * smoothstep(1.05, 0.25, r);
  gl_FragColor = vec4(col * 1.35, a * uOpacity);
}`;

/** A single volumetric-feeling cloud plane the camera flies through. */
export function Cloud({ p, size, seed, cols, spin = 1, parallax = 1 }: {
  p: [number, number, number]; size: number; seed: number;
  cols: [string, string, string]; spin?: number; parallax?: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uSeed: { value: seed }, uOpacity: { value: 1 },
    uColA: { value: new THREE.Color(cols[0]) },
    uColB: { value: new THREE.Color(cols[1]) },
    uColC: { value: new THREE.Color(cols[2]) },
  }), [seed, cols]);
  useFrame((s) => {
    if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime * spin;
    if (mesh.current) {
      mesh.current.rotation.z = s.clock.elapsedTime * 0.012 * spin;
      mesh.current.position.x = p[0] + journey.mouse.x * -2.2 * parallax;
      mesh.current.position.y = p[1] + journey.mouse.y * -1.4 * parallax;
    }
  });
  return (
    <mesh ref={mesh} position={p}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial ref={mat} args={[{ uniforms, vertexShader: VERT, fragmentShader: FRAG }]}
        transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
    </mesh>
  );
}

const VIOLET: [string, string, string] = ["#12043a", "#5a2fd0", "#c85bff"];
const BLUE: [string, string, string] = ["#050c3a", "#2448c8", "#6fb4ff"];
const PINK: [string, string, string] = ["#2a0a44", "#8a2fb8", "#ff9ddb"];

/** Layered nebula clouds scattered along the entire flight path. */
export default function Nebula() {
  return (
    <group>
      {/* ambient opening clouds */}
      <Cloud p={[-24, 10, -14]} size={120} seed={3.1} cols={VIOLET} />
      <Cloud p={[26, -12, -52]} size={140} seed={7.7} cols={BLUE} spin={-1} />
      {/* galaxy surroundings */}
      <Cloud p={[30, 18, -118]} size={160} seed={12.3} cols={PINK} />
      <Cloud p={[-34, -14, -135]} size={150} seed={4.9} cols={VIOLET} spin={-1} />
      {/* tunnel walls — the camera physically passes these */}
      <Cloud p={[16, 8, -190]} size={110} seed={9.2} cols={BLUE} />
      <Cloud p={[-18, -6, -232]} size={120} seed={15.4} cols={VIOLET} spin={-1} />
      <Cloud p={[12, -10, -278]} size={110} seed={6.6} cols={PINK} />
      <Cloud p={[-14, 12, -316]} size={120} seed={11.1} cols={BLUE} spin={-1} />
      {/* memory field + finale */}
      <Cloud p={[26, 14, -396]} size={140} seed={2.2} cols={VIOLET} />
      <Cloud p={[-22, -10, -440]} size={160} seed={17.8} cols={PINK} spin={-1} />
      <Cloud p={[0, 22, -478]} size={180} seed={8.8} cols={BLUE} />
    </group>
  );
}
