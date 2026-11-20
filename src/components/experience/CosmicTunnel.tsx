import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeTunnelParticles, makeHelix } from "../../utils/particleGenerator";
import { makeGlowTexture } from "../../utils/textures";
import { isMobile, journey, sstep } from "../../utils/journey";

const VERT = /* glsl */ `
attribute float aPhase;
attribute vec3 aColor;
uniform float uTime;
uniform float uFlow;
uniform float uPixelRatio;
varying vec3 vColor;
varying float vTw;
void main() {
  vColor = aColor;
  vTw = 0.55 + 0.45 * sin(uTime * 2.0 + aPhase);
  vec3 p = position;
  // swirl around the tunnel axis, faster as we go deeper
  float a = uTime * 0.12 + aPhase * 0.05;
  p.xy = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xy;
  // particles stream past the camera
  p.z += mod(uFlow + aPhase * 37.0, 200.0) - 100.0;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (140.0 / -mv.z) * uPixelRatio * (0.6 + 0.6 * vTw);
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform float uOpacity;
varying vec3 vColor;
varying float vTw;
void main() {
  float a = texture2D(uMap, gl_PointCoord).a;
  gl_FragColor = vec4(vColor, a * vTw * uOpacity);
}`;

const Z_CENTER = -250; // tunnel midpoint; particles wrap ±100 around it

/**
 * Cosmic tunnel — a swirling cylinder of glowing dust + helical light
 * trails with a clear vanishing point ahead of the camera.
 */
export default function CosmicTunnel() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const lines = useRef<THREE.Group>(null);
  const data = useMemo(() => makeTunnelParticles(isMobile ? 1800 : 4200), []);
  const tex = useMemo(() => makeGlowTexture(), []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.pos, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(data.color, 3));
    g.setAttribute("aPhase", new THREE.BufferAttribute(data.phase, 1));
    return g;
  }, [data]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 }, uFlow: { value: 0 }, uOpacity: { value: 0 },
      uPixelRatio: { value: Math.min(devicePixelRatio, 2) }, uMap: { value: tex },
    }),
    [tex]
  );

  const helices = useMemo(() => {
    const cols = ["#7a5cff", "#c86bff", "#5f9dff", "#ff9ddb", "#8f7bff", "#6fc8ff"];
    return cols.map((c, i) => {
      const line = new THREE.Line(
        makeHelix(Z_CENTER - 100, Z_CENTER + 100, 6.5 + (i % 3) * 1.8, 3 + (i % 2), (i * Math.PI) / 3),
        new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      line.frustumCulled = false;
      return line;
    });
  }, []);

  useFrame((s) => {
    const p = journey.smooth;
    const visible = sstep(p, 0.5, 0.66) * (1 - sstep(p, 0.94, 1.0));
    if (mat.current) {
      mat.current.uniforms.uTime.value = s.clock.elapsedTime;
      mat.current.uniforms.uOpacity.value = visible;
      mat.current.uniforms.uFlow.value = s.clock.elapsedTime * (4 + p * 26) + p * 90;
    }
    if (lines.current) {
      lines.current.rotation.z = s.clock.elapsedTime * 0.08;
      helices.forEach((l) => { (l.material as THREE.LineBasicMaterial).opacity = 0.35 * visible; });
    }
  });

  return (
    <group>
      <points geometry={geo} frustumCulled={false} position={[0, 0, Z_CENTER]}>
        <shaderMaterial ref={mat} args={[{ uniforms, vertexShader: VERT, fragmentShader: FRAG }]}
          transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <group ref={lines}>
        {helices.map((h, i) => <primitive key={i} object={h} />)}
      </group>
    </group>
  );
}
