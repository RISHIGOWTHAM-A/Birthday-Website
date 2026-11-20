import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeGalaxy } from "../../utils/galaxyGenerator";
import { makeGlowTexture } from "../../utils/textures";
import { isMobile, journey, sstep } from "../../utils/journey";

const VERT = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
uniform float uTime;
uniform float uPixelRatio;
varying vec3 vColor;
varying float vA;
void main() {
  vColor = aColor;
  vA = 0.7 + 0.3 * sin(uTime * 1.2 + aPhase);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio * (200.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform float uOpacity;
varying vec3 vColor;
varying float vA;
void main() {
  float a = texture2D(uMap, gl_PointCoord).a;
  gl_FragColor = vec4(vColor, a * vA * uOpacity);
}`;

/**
 * Procedural spiral galaxy parked at z≈-115. It fades in on approach,
 * spins slowly, and the camera path threads it through the arms.
 */
export default function Galaxy() {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const halo = useRef<THREE.Sprite>(null);
  const data = useMemo(() => makeGalaxy({ count: isMobile ? 12000 : 26000 }), []);
  const tex = useMemo(() => makeGlowTexture(), []);
  const haloTex = useMemo(() => makeGlowTexture("rgba(255,205,240,1)"), []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.pos, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(data.color, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(data.size, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(data.phase, 1));
    return g;
  }, [data]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: Math.min(devicePixelRatio, 2) }, uMap: { value: tex }, uOpacity: { value: 0 } }),
    [tex]
  );

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const p = journey.smooth;
    if (mat.current) {
      mat.current.uniforms.uTime.value = t;
      mat.current.uniforms.uOpacity.value = sstep(p, 0.16, 0.4);
    }
    if (group.current) {
      group.current.rotation.z = t * 0.022 + p * 1.4;
      group.current.position.x = 4 + journey.mouse.x * -2.5;
      group.current.position.y = -2 + journey.mouse.y * -1.6;
    }
    if (halo.current) (halo.current.material as THREE.SpriteMaterial).opacity = 0.5 * sstep(p, 0.16, 0.42);
  });

  return (
    <group ref={group} position={[4, -2, -115]} rotation={[-0.42, 0.15, 0]}>
      <points geometry={geo} frustumCulled={false}>
        <shaderMaterial ref={mat} args={[{ uniforms, vertexShader: VERT, fragmentShader: FRAG }]}
          transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      {/* blazing core */}
      <sprite ref={halo} scale={[26, 26, 1]}>
        <spriteMaterial map={haloTex} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
    </group>
  );
}
