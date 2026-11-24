import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useHeartGeometry } from "../experience/Heart";
import { makeGlowTexture } from "../../utils/textures";
import { land } from "../../utils/landing";
import { isMobile } from "../../utils/journey";

const RIM_VERT = /* glsl */ `
varying vec3 vN;
varying vec3 vV;
void main() {
  vN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const RIM_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
varying vec3 vN;
varying vec3 vV;
void main() {
  float f = pow(1.0 - abs(dot(vN, vV)), 2.2);
  gl_FragColor = vec4(uColor, f * uIntensity);
}`;

export const ORB_R = 1.85;
export const ORB_Y = 1.35;

const RINGS = [
  { r: ORB_R * 1.5, tube: 0.014, tilt: [1.32, 0, 0.14] as [number, number, number], color: "#8a6bff", opacity: 0.8, speed: 0.15, dir: 1 as const },
  { r: ORB_R * 1.78, tube: 0.01, tilt: [1.6, 0.3, -0.22] as [number, number, number], color: "#5fb8ff", opacity: 0.55, speed: 0.09, dir: -1 as const },
  { r: ORB_R * 2.1, tube: 0.008, tilt: [1.15, -0.28, 0.4] as [number, number, number], color: "#ff9ddb", opacity: 0.4, speed: 0.05, dir: 1 as const },
];

/**
 * The landing hero — a glass cosmic sphere holding a glowing heart,
 * wrapped in thin counter-rotating orbital rings with travelling sparks.
 */
export default function HeartOrb() {
  const group = useRef<THREE.Group>(null);
  const heart = useRef<THREE.Group>(null);
  const ringsRoot = useRef<THREE.Group>(null);
  const sparks = useRef<THREE.Points>(null);
  const heartMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const glowTex = useMemo(() => makeGlowTexture("rgba(200,160,255,1)"), []);
  const heartGeo = useHeartGeometry();
  const rimUniforms = useMemo(() => ({
    uColor: { value: new THREE.Color("#8a6bff") },
    uIntensity: { value: 1.6 },
  }), []);

  const dustGeo = useMemo(() => {
    const n = isMobile ? 80 : 200;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(Math.pow(Math.random(), 0.4) * ORB_R * 0.9);
      pos.set([v.x, v.y, v.z], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  const sparkGeo = useMemo(() => {
    const per = 40;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(RINGS.length * per * 3), 3));
    return { geo: g, per };
  }, []);

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    const d = land.depart;
    const boost = 1 + d * 7;
    if (group.current) {
      group.current.scale.setScalar(1 + Math.sin(t * (Math.PI * 2) / 5.2) * 0.015 + d * 0.6);
      group.current.rotation.y = t * 0.06;
    }
    if (heart.current) {
      heart.current.position.y = Math.sin(t * 0.85) * 0.09;
      heart.current.rotation.y = t * 0.3;
      heart.current.scale.setScalar(1 + Math.sin(t * 2.1) * 0.045);
    }
    if (heartMat.current) heartMat.current.emissiveIntensity = 1.4 + Math.sin(t * 2.1) * 0.35 + d * 2.2;
    if (ringsRoot.current) {
      RINGS.forEach((r, i) => {
        const g = ringsRoot.current!.children[i] as THREE.Group;
        if (g) g.rotation.z += dt * r.speed * r.dir * boost;
      });
    }
    const pos = sparkGeo.geo.attributes.position as THREE.BufferAttribute;
    RINGS.forEach((r, ri) => {
      const e = new THREE.Euler(...r.tilt);
      for (let k = 0; k < sparkGeo.per; k++) {
        const a = t * r.speed * 3 * r.dir * boost + (k / sparkGeo.per) * Math.PI * 2 + ri * 2;
        const v = new THREE.Vector3(Math.cos(a) * r.r, 0, Math.sin(a) * r.r).applyEuler(e);
        pos.setXYZ(ri * sparkGeo.per + k, v.x, v.y, v.z);
      }
    });
    pos.needsUpdate = true;
  });

  return (
    <group position={[0, ORB_Y, 0]}>
      <group ref={group}>
        {/* glass sphere */}
        <mesh>
          <sphereGeometry args={[ORB_R, 64, 64]} />
          <meshPhysicalMaterial color="#141a55" transparent opacity={0.16}
            roughness={0.08} metalness={0} clearcoat={1} depthWrite={false} />
        </mesh>
        {/* violet rim */}
        <mesh>
          <sphereGeometry args={[ORB_R * 1.015, 48, 48]} />
          <shaderMaterial args={[{ uniforms: rimUniforms, vertexShader: RIM_VERT, fragmentShader: RIM_FRAG }]}
            transparent side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {/* internal dust */}
        <points geometry={dustGeo}>
          <pointsMaterial size={0.05} color="#c8b8ff" transparent opacity={0.7}
            depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
        {/* glowing heart */}
        <group ref={heart}>
          <mesh geometry={heartGeo} scale={0.8}>
            <meshPhysicalMaterial ref={heartMat} color="#b06bff" emissive="#8a3fff"
              emissiveIntensity={1.4} roughness={0.2} metalness={0.1} clearcoat={1} />
          </mesh>
          <sprite scale={[3.6, 3.6, 1]}>
            <spriteMaterial map={glowTex} transparent opacity={0.65}
              blending={THREE.AdditiveBlending} depthWrite={false} />
          </sprite>
          <pointLight color="#9a5fff" intensity={26} distance={18} decay={2} />
        </group>
        {/* ambient halo */}
        <sprite scale={[11, 11, 1]} position={[0, 0, -1]}>
          <spriteMaterial map={glowTex} color="#5a3fd8" transparent opacity={0.3}
            blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
      </group>
      {/* orbital rings */}
      <group ref={ringsRoot}>
        {RINGS.map((r, i) => (
          <group key={i} rotation={r.tilt}>
            <mesh>
              <torusGeometry args={[r.r, r.tube, 8, 180]} />
              <meshBasicMaterial color={r.color} transparent opacity={r.opacity}
                blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          </group>
        ))}
      </group>
      <points ref={sparks} geometry={sparkGeo.geo} frustumCulled={false}>
        <pointsMaterial size={0.055} map={glowTex} color="#d8c8ff" transparent opacity={0.85}
          depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
    </group>
  );
}
