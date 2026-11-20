import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { birthdayConfig } from "../../config/birthdayConfig";
import { makeGlowTexture, makePhotoFallback } from "../../utils/textures";
import { journey, sstep } from "../../utils/journey";

const W = 5.4, H = 3.6;

/** Positions alternating sides along the memory corridor (z -360..-440). */
const SLOT = (i: number): [number, number, number] => [
  (i % 2 === 0 ? -1 : 1) * (6.4 + (i % 3) * 1.6),
  (i % 3 === 0 ? 1.6 : -1.4) + ((i * 7) % 3) * 0.5,
  -358 - i * 11.5,
];

function FloatingPhoto({ url, i }: { url: string; i: number }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const glowTex = useMemo(() => makeGlowTexture("rgba(180,150,255,1)"), []);
  const fallback = useMemo(() => makePhotoFallback(`memory ${i + 1}`), [i]);
  const frameTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, "rgba(200,170,255,0.95)");
    grad.addColorStop(0.5, "rgba(120,90,220,0.75)");
    grad.addColorStop(1, "rgba(255,170,230,0.9)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    g.globalCompositeOperation = "destination-out";
    g.fillRect(10, 10, 236, 236);
    return new THREE.CanvasTexture(c);
  }, []);
  const pos = useMemo(() => SLOT(i), [i]);
  const threshold = 0.74 + i * 0.024;

  useEffect(() => {
    let alive = true;
    new THREE.TextureLoader().load(
      url,
      (t) => { t.colorSpace = THREE.SRGBColorSpace; if (alive) setTex(t); },
      undefined,
      () => { if (alive) setTex(makePhotoFallback(`memory ${i + 1}`)); }
    );
    return () => { alive = false; };
  }, [url, i]);

  useFrame((s) => {
    if (!group.current || !inner.current) return;
    const t = s.clock.elapsedTime;
    const p = journey.smooth;
    // soft spring-like reveal
    const v = sstep(p, threshold, threshold + 0.07);
    const ease = 1 - Math.pow(1 - v, 3);
    const dist = Math.abs(s.camera.position.z - pos[2]);
    const near = sstep(90 - dist, 0, 55); // fade if camera has flown far past
    group.current.visible = v > 0.001 && dist < 95;
    const sc = ease * (0.6 + near * 0.4);
    inner.current.scale.setScalar(Math.max(0.001, sc));
    group.current.position.set(
      pos[0] + Math.sin(t * 0.3 + i * 1.7) * 0.35 + journey.mouse.x * -1.8,
      pos[1] + Math.cos(t * 0.26 + i * 2.3) * 0.3 + journey.mouse.y * -1.1,
      pos[2]
    );
    // gently face the camera + lazy drift rotation
    group.current.rotation.y = Math.sin(t * 0.2 + i) * 0.14 + (pos[0] > 0 ? -0.22 : 0.22);
    group.current.rotation.z = Math.sin(t * 0.16 + i * 3) * 0.04;
    inner.current.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material & { opacity?: number };
      if (m && "opacity" in m) m.opacity = ease * (0.35 + near * 0.65);
    });
  });

  return (
    <group ref={group} position={pos}>
      <group ref={inner}>
        {/* glow halo */}
        <sprite scale={[W * 2.1, W * 2.1, 1]}>
          <spriteMaterial map={glowTex} transparent opacity={0}
            blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
        {/* luminous frame */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[W + 0.22, H + 0.22]} />
          <meshBasicMaterial map={frameTex} transparent opacity={0}
            blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        {/* the photo */}
        <mesh>
          <planeGeometry args={[W, H]} />
          <meshBasicMaterial map={tex ?? fallback}
            transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

/** Memories floating inside the universe — appear ~74–95% scroll. */
export default function FloatingPhotos() {
  return (
    <group>
      {birthdayConfig.photos.map((u, i) => <FloatingPhoto key={u + i} url={u} i={i} />)}
    </group>
  );
}
