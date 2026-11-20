import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makePlanetTexture, makeRingTexture } from "../../utils/textures";
import { isMobile, journey } from "../../utils/journey";

interface PlanetDef {
  p: [number, number, number];
  r: number;
  colors: [string, string, string];
  glow: string;
  ring?: boolean;
  seed: number;
}

const PLANETS: PlanetDef[] = [
  { p: [15, 3, -356], r: 7.5, colors: ["#0a2a6e", "#1e5fc8", "#7fc4ff"], glow: "#4d8dff", seed: 1 }, // large blue
  { p: [-13, -4, -372], r: 4.2, colors: ["#2a1060", "#6a2fd0", "#c88bff"], glow: "#a05bff", seed: 2 }, // purple
  { p: [10, -2, -398], r: 1.6, colors: ["#4a4a55", "#9a9ab0", "#e8e8ff"], glow: "#bfc4ff", seed: 3 }, // moon
  { p: [-15, 5, -418], r: 5.2, colors: ["#3a1e6e", "#8a4fd0", "#ffb8e8"], glow: "#d88bff", ring: true, seed: 4 }, // ringed
  { p: [11, 4, -441], r: 4.4, colors: ["#0a3a5e", "#1e7f9e", "#9fe8d8"], glow: "#5fd8c8", seed: 5 }, // earth-like
];

function Planet({ def }: { def: PlanetDef }) {
  const mesh = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => makePlanetTexture(...def.colors, def.seed), [def]);
  const atmTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0.55, "rgba(255,255,255,0)");
    grad.addColorStop(0.78, def.glow + "66");
    grad.addColorStop(1, def.glow + "00");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, [def.glow]);
  const ringTex = useMemo(() => (def.ring ? makeRingTexture() : null), [def.ring]);

  useFrame((s) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = s.clock.elapsedTime * 0.05 + def.seed;
    mesh.current.position.y = def.p[1] + Math.sin(s.clock.elapsedTime * 0.14 + def.seed * 2) * 0.5;
    mesh.current.position.x = def.p[0] + journey.mouse.x * -1.4;
  });

  return (
    <group>
      <mesh ref={mesh} position={def.p}>
        <sphereGeometry args={[def.r, isMobile ? 32 : 48, isMobile ? 32 : 48]} />
        <meshStandardMaterial map={tex} roughness={0.85} metalness={0.1}
          emissive={def.colors[1]} emissiveIntensity={0.12} />
      </mesh>
      {/* atmosphere halo */}
      <sprite position={def.p} scale={[def.r * 3.1, def.r * 3.1, 1]}>
        <spriteMaterial map={atmTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.9} />
      </sprite>
      {def.ring && ringTex && (
        <mesh position={def.p} rotation={[-1.25, 0, -0.35]}>
          <ringGeometry args={[def.r * 1.35, def.r * 2.3, 64]} />
          <meshBasicMaterial map={ringTex} transparent side={THREE.DoubleSide}
            depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.85} />
        </mesh>
      )}
    </group>
  );
}

export default function Planets() {
  const defs = isMobile ? PLANETS.filter((_, i) => i !== 2) : PLANETS;
  return (
    <group>
      {defs.map((d) => <Planet key={d.seed} def={d} />)}
    </group>
  );
}
