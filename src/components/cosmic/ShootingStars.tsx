import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeGlowTexture } from "../../utils/textures";

interface Meteor { pos: THREE.Vector3; vel: THREE.Vector3; life: number; wait: number }

/**
 * Occasional shooting stars — a bright head + fading tail crosses the
 * upper sky every few seconds. Pooled, never constant.
 */
export default function ShootingStars() {
  const pool = useRef<Meteor[]>([]);
  const heads = useRef<(THREE.Sprite | null)[]>([]);
  const lines = useRef<(THREE.Line | null)[]>([]);
  const glowTex = useMemo(() => makeGlowTexture("rgba(220,225,255,1)"), []);
  const N = 3;

  const spawn = (m: Meteor) => {
    m.pos.set(THREE.MathUtils.randFloat(-22, 22), THREE.MathUtils.randFloat(6, 13), THREE.MathUtils.randFloat(-26, -14));
    const dir = new THREE.Vector3(Math.random() > 0.5 ? 1 : -1, -0.35 - Math.random() * 0.3, 0).normalize();
    m.vel = dir.multiplyScalar(THREE.MathUtils.randFloat(14, 26));
    m.life = 1;
    m.wait = 0;
  };

  useFrame((_, dt) => {
    for (let i = 0; i < N; i++) {
      if (!pool.current[i]) {
        pool.current[i] = { pos: new THREE.Vector3(), vel: new THREE.Vector3(), life: 0, wait: THREE.MathUtils.randFloat(3, 12) };
      }
      const m = pool.current[i];
      if (m.wait > 0) { m.wait -= dt; if (m.wait <= 0) spawn(m); continue; }
      m.life -= dt * 0.9;
      m.pos.addScaledVector(m.vel, dt);
      const head = heads.current[i], line = lines.current[i];
      if (m.life <= 0) {
        if (head) head.material.opacity = 0;
        if (line) (line.material as THREE.LineBasicMaterial).opacity = 0;
        m.wait = THREE.MathUtils.randFloat(4, 11);
        continue;
      }
      const a = Math.min(1, m.life * 1.6);
      if (head) { head.position.copy(m.pos); head.material.opacity = a * 0.95; }
      if (line) {
        const p = line.geometry.attributes.position as THREE.BufferAttribute;
        const tail = m.pos.clone().addScaledVector(m.vel, -0.16);
        p.setXYZ(0, m.pos.x, m.pos.y, m.pos.z);
        p.setXYZ(1, tail.x, tail.y, tail.z);
        p.needsUpdate = true;
        (line.material as THREE.LineBasicMaterial).opacity = a * 0.7;
      }
    }
  });

  return (
    <group>
      {Array.from({ length: N }, (_, i) => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
        return (
          <group key={i}>
            <sprite ref={(s) => { heads.current[i] = s; }} scale={[0.7, 0.7, 1]}>
              <spriteMaterial map={glowTex} transparent opacity={0}
                blending={THREE.AdditiveBlending} depthWrite={false} />
            </sprite>
            <primitive object={new THREE.Line(geo, new THREE.LineBasicMaterial({
              color: "#cdd8ff", transparent: true, opacity: 0,
              blending: THREE.AdditiveBlending, depthWrite: false,
            }))} ref={(l: THREE.Line | null) => { lines.current[i] = l; }} />
          </group>
        );
      })}
    </group>
  );
}
