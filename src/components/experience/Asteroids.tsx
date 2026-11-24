import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { isMobile } from "../../utils/journey";

/** Floating asteroid field — one InstancedMesh, slow tumble + drift. */
export default function Asteroids() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = isMobile ? 45 : 90;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (Math.random() - 0.5) * 55,
        y: (Math.random() - 0.5) * 32,
        z: -300 - Math.random() * 52, // belt ends before the memory corridor (-358+)
        s: 0.25 + Math.random() * (Math.random() < 0.12 ? 2.4 : 0.9),
        rx: Math.random() * Math.PI * 2,
        ry: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.1,
        wx: (Math.random() - 0.5) * 0.24,
        wy: (Math.random() - 0.5) * 0.24,
        ph: i * 0.37,
      })),
    [count]
  );

  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const a = seeds[i];
      dummy.position.set(
        a.x + Math.sin(t * a.vx + a.ph) * 2.2,
        a.y + Math.cos(t * a.vy + a.ph) * 1.8,
        a.z
      );
      dummy.rotation.set(a.rx + t * a.wx, a.ry + t * a.wy, 0);
      dummy.scale.setScalar(a.s);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#6b6480" roughness={0.95} metalness={0.15}
        emissive="#241d4a" emissiveIntensity={0.25} />
    </instancedMesh>
  );
}
