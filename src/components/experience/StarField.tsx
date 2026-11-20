import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeStarField, makeDust } from "../../utils/particleGenerator";
import { makeGlowTexture } from "../../utils/textures";
import { isMobile, journey } from "../../utils/journey";

const VERT = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
uniform float uTime;
uniform float uPixelRatio;
varying vec3 vColor;
varying float vTw;
void main() {
  vColor = aColor;
  float tw = 0.55 + 0.45 * sin(uTime * 1.7 + aPhase);
  vTw = tw;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio * tw * (140.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
uniform sampler2D uMap;
varying vec3 vColor;
varying float vTw;
void main() {
  float a = texture2D(uMap, gl_PointCoord).a;
  gl_FragColor = vec4(vColor, a * vTw);
}`;

function StarPoints({ data, scale = 1 }: { data: ReturnType<typeof makeStarField>; scale?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const tex = useMemo(() => makeGlowTexture(), []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(data.size, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(data.phase, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(data.color, 3));
    return g;
  }, [data]);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: Math.min(devicePixelRatio, 2) * scale }, uMap: { value: tex } }),
    [tex, scale]
  );
  useFrame((s) => { if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime; });
  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial ref={mat} args={[{ uniforms, vertexShader: VERT, fragmentShader: FRAG }]}
        transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/** Ambient starfield + a fine dust layer that drifts with mouse parallax. */
export default function StarField() {
  const stars = useMemo(() => makeStarField(isMobile ? 2600 : 7500), []);
  const dust = useMemo(() => makeDust(isMobile ? 700 : 1600), []);
  const dustRef = useRef<THREE.Points>(null);
  const dustGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(dust.pos, 3));
    return g;
  }, [dust]);

  useFrame((s) => {
    if (!dustRef.current) return;
    const t = s.clock.elapsedTime;
    dustRef.current.position.x = journey.mouse.x * 1.6 + Math.sin(t * 0.05) * 2;
    dustRef.current.position.y = journey.mouse.y * 1.0 + Math.cos(t * 0.04) * 1.5;
  });

  return (
    <group>
      <StarPoints data={stars} />
      <points ref={dustRef} geometry={dustGeo} frustumCulled={false}>
        <pointsMaterial size={0.14} color="#8d9dff" transparent opacity={0.4}
          sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}
