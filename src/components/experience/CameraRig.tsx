import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { journey } from "../../utils/journey";

/**
 * Cinematic camera — travels a smooth Catmull-Rom spline through the
 * whole universe, driven purely by damped scroll progress.
 * Also applies gentle mouse parallax + a whisper of roll.
 */
export const JOURNEY_POINTS = [
  new THREE.Vector3(0, 0.6, 26),     // opening — heart ahead
  new THREE.Vector3(0, 0.2, 6),      // drift in
  new THREE.Vector3(2, 1.2, -34),    // hyperspace begins
  new THREE.Vector3(7, 3, -72),      // curve toward the galaxy
  new THREE.Vector3(-4, -0.5, -110), // through the spiral arms
  new THREE.Vector3(-1, 1.5, -150),  // exit into the tunnel
  new THREE.Vector3(-6, -2, -205),
  new THREE.Vector3(5.5, 2, -255),
  new THREE.Vector3(-3.5, -1, -305),
  new THREE.Vector3(2.5, 1, -350),   // planets + memories corridor
  new THREE.Vector3(-1, 0.4, -392),
  new THREE.Vector3(0, 0.6, -428),   // arrive — heart of the universe
];

export default function CameraRig() {
  const { camera } = useThree();
  const curve = useMemo(() => new THREE.CatmullRomCurve3(JOURNEY_POINTS, false, "catmullrom", 0.35), []);
  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const par = useRef({ x: 0, y: 0 });
  const lastP = useRef(0);

  useFrame((_, dt) => {
    // damped scroll → buttery motion, never a teleport
    journey.smooth = THREE.MathUtils.damp(journey.smooth, journey.progress, 2.2, dt);
    // velocity proxy: raw scroll speed (progress units / second)
    const speed = dt > 0 ? Math.abs(journey.progress - lastP.current) / dt : 0;
    lastP.current = journey.progress;
    journey.velocity = THREE.MathUtils.damp(journey.velocity, Math.min(speed * 0.5, 1), 5, dt);

    const p = journey.smooth;
    // ease the raw t so the end lingers gently at the heart
    const eased = p < 0.92 ? p * 1.005 : 0.9246 + (p - 0.92) * 0.9425;
    const t = THREE.MathUtils.clamp(eased, 0, 1);

    curve.getPoint(t, pos.current);
    curve.getPoint(Math.min(t + 0.018, 1), look.current);

    // mouse parallax — subtle, cinematic
    par.current.x = THREE.MathUtils.damp(par.current.x, journey.mouse.x, 3, dt);
    par.current.y = THREE.MathUtils.damp(par.current.y, journey.mouse.y, 3, dt);

    const idle = Math.sin(performance.now() * 0.00035) * 0.15;
    camera.position.set(
      pos.current.x + par.current.x * 1.1,
      pos.current.y + par.current.y * 0.7 + idle * 0.3,
      pos.current.z
    );
    camera.lookAt(look.current.x + par.current.x * 2.2, look.current.y + par.current.y * 1.4, look.current.z);
    // whisper of roll through the tunnel section
    const roll = Math.sin(p * Math.PI * 3) * 0.04 * (p > 0.55 && p < 0.9 ? 1 : 0.2);
    camera.rotation.z += roll;
  });

  return null;
}
