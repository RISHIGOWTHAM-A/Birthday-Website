import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeStreaks } from "../../utils/particleGenerator";
import { isMobile, journey, STAGES, sstep } from "../../utils/journey";

/**
 * Hyperspace streaks — short light-trails parallel to the flight path.
 * Intensity follows scroll velocity + the acceleration stage.
 */
export default function WarpStreaks() {
  const mat = useRef<THREE.LineBasicMaterial>(null);
  const geo = useMemo(() => {
    const { pos, tint } = makeStreaks(isMobile ? 160 : 340);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(tint, 3));
    return g;
  }, []);

  useFrame(() => {
    if (!mat.current) return;
    const p = journey.smooth;
    const stage = sstep(p, STAGES.hyperspace[0], STAGES.hyperspace[1] + 0.15) * (1 - sstep(p, 0.86, 0.97));
    const speed = Math.min(1, journey.velocity * 3);
    mat.current.opacity = Math.min(1, stage * 0.5 + speed * 0.9);
  });

  return (
    <lineSegments geometry={geo} frustumCulled={false}>
      <lineBasicMaterial ref={mat} vertexColors transparent opacity={0}
        blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  );
}
