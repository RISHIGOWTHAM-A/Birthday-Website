import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeGlowTexture } from "../../utils/textures";

export function useHeartGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.9);
    s.bezierCurveTo(0, 1.25, -0.55, 1.55, -0.95, 1.2);
    s.bezierCurveTo(-1.45, 0.75, -1.05, 0.05, 0, -0.85);
    s.bezierCurveTo(1.05, 0.05, 1.45, 0.75, 0.95, 1.2);
    s.bezierCurveTo(0.55, 1.55, 0, 1.25, 0, 0.9);
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: 0.45, bevelEnabled: true, bevelThickness: 0.22, bevelSize: 0.22, bevelSegments: 5, curveSegments: 24,
    });
    geo.center();
    return geo;
  }, []);
}

/** Glowing 3D heart with halo + inner light. */
export default function Heart({ position, scale = 1, intensity = 1 }: {
  position: [number, number, number];
  scale?: number;
  intensity?: number;
}) {
  const geo = useHeartGeometry();
  const group = useRef<THREE.Group>(null);
  const glowTex = useMemo(() => makeGlowTexture("rgba(255,120,190,1)"), []);
  const mat = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.35;
      group.current.position.y = position[1] + Math.sin(t * 0.8) * 0.25;
      const beat = 1 + Math.sin(t * 2.2) * 0.03;
      group.current.scale.setScalar(scale * beat);
    }
    if (mat.current) mat.current.emissiveIntensity = intensity * (1.1 + Math.sin(t * 2.2) * 0.25);
  });

  return (
    <group position={position}>
      <group ref={group}>
        <mesh geometry={geo}>
          <meshPhysicalMaterial ref={mat} color="#ff4f9e" emissive="#ff2d78"
            emissiveIntensity={1.2} roughness={0.25} metalness={0.1}
            clearcoat={1} clearcoatRoughness={0.3} />
        </mesh>
      </group>
      <sprite scale={[9 * scale, 9 * scale, 1]}>
        <spriteMaterial map={glowTex} transparent opacity={0.55 * intensity}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <pointLight color="#ff6ab0" intensity={30 * intensity} distance={30} decay={2} />
    </group>
  );
}
