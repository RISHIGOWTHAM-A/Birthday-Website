import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import StarField from "../experience/StarField";
import { Cloud } from "../experience/Nebula";
import HeartOrb, { ORB_Y } from "./HeartOrb";
import ShootingStars from "./ShootingStars";
import { makeStreaks } from "../../utils/particleGenerator";
import { isMobile, journey } from "../../utils/journey";
import { land } from "../../utils/landing";

const BASE_POS = new THREE.Vector3(0, 1.3, 10.5);
const BASE_FOV = isMobile ? 62 : 50;
const LOOK = new THREE.Vector3(0, ORB_Y, 0);

/** Gentle float + mouse parallax + departure dive through the orb. */
function LandingRig() {
  const { camera } = useThree();
  const par = useRef({ x: 0, y: 0 });
  const look = useRef(new THREE.Vector3());
  const persp = camera as THREE.PerspectiveCamera;

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    const d = land.depart;
    par.current.x = THREE.MathUtils.damp(par.current.x, journey.mouse.x, 2.6, dt);
    par.current.y = THREE.MathUtils.damp(par.current.y, journey.mouse.y, 2.6, dt);
    camera.position.set(
      BASE_POS.x + Math.sin(t * 0.15) * 0.08 + par.current.x * 0.9,
      BASE_POS.y + Math.cos(t * 0.12) * 0.05 + par.current.y * 0.55 + d * 0.3,
      BASE_POS.z - d * 7.4
    );
    look.current.set(LOOK.x + par.current.x * 0.5, LOOK.y + par.current.y * 0.35, LOOK.z - d * 9);
    camera.lookAt(look.current);
    const fov = BASE_FOV + d * 18;
    if (persp.fov !== fov) { persp.fov = fov; persp.updateProjectionMatrix(); }
  });
  return null;
}

/** Blue/violet streaks rushing past during the departure dive. */
function DepartStreaks() {
  const mat = useRef<THREE.LineBasicMaterial>(null);
  const geo = useMemo(() => {
    const { pos, tint } = makeStreaks(240, -80, 8);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(tint, 3));
    return g;
  }, []);
  useFrame(() => { if (mat.current) mat.current.opacity = land.depart * 0.9; });
  return (
    <lineSegments geometry={geo} frustumCulled={false}>
      <lineBasicMaterial ref={mat} vertexColors transparent opacity={0}
        blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  );
}

const VIOLET: [string, string, string] = ["#12043a", "#5a2fd0", "#c85bff"];
const BLUE: [string, string, string] = ["#050c3a", "#2448c8", "#6fb4ff"];
const PINK: [string, string, string] = ["#2a0a44", "#8a2fb8", "#ff9ddb"];

/**
 * Landing — the same universe as the journey, framed on the heart orb.
 * Nebula edges, layered stars, shooting stars, orbiting rings.
 */
export default function LandingScene() {
  return (
    <Canvas
      style={{ pointerEvents: "none" }}
      dpr={isMobile ? [1, 1.2] : [1, 1.5]}
      gl={{ antialias: !isMobile, powerPreference: "high-performance", alpha: false }}
      camera={{ fov: BASE_FOV, near: 0.1, far: 400, position: BASE_POS.toArray() }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        scene.background = new THREE.Color("#020010");
        scene.fog = new THREE.Fog("#030018", 30, 110);
      }}
    >
      <Suspense fallback={null}>
        <LandingRig />
        <ambientLight intensity={0.3} color="#8a7fd8" />
        <StarField />
        {/* nebula framing the edges */}
        <Cloud p={[-22, 10, -22]} size={90} seed={3.1} cols={VIOLET} parallax={0.5} />
        <Cloud p={[24, -8, -34]} size={100} seed={7.7} cols={BLUE} spin={-1} parallax={0.7} />
        <Cloud p={[20, 14, -50]} size={110} seed={12.3} cols={PINK} parallax={0.9} />
        <Cloud p={[-26, -12, -44]} size={95} seed={4.9} cols={BLUE} spin={-1} parallax={0.6} />
        <Cloud p={[0, 18, -70]} size={130} seed={9.2} cols={VIOLET} parallax={1.1} />
        <HeartOrb />
        <ShootingStars />
        <DepartStreaks />
      </Suspense>
    </Canvas>
  );
}
