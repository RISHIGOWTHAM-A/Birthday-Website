import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import CameraRig from "./CameraRig";
import StarField from "./StarField";
import WarpStreaks from "./WarpStreaks";
import Nebula from "./Nebula";
import Galaxy from "./Galaxy";
import CosmicTunnel from "./CosmicTunnel";
import Planets from "./Planets";
import Asteroids from "./Asteroids";
import FloatingPhotos from "./FloatingPhotos";
import Heart from "./Heart";
import { isMobile } from "../../utils/journey";

/**
 * The single continuous 3D universe. Everything lives in one scene;
 * scroll drives the camera — no separate "sections" exist.
 */
export default function CosmicExperience() {
  return (
    <Canvas
      className="!fixed inset-0"
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: !isMobile, powerPreference: "high-performance", alpha: false }}
      camera={{ fov: isMobile ? 70 : 58, near: 0.1, far: 900, position: [0, 0.6, 26] }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        scene.background = new THREE.Color("#020010");
        scene.fog = new THREE.Fog("#030018", 26, 150);
      }}
    >
      <Suspense fallback={null}>
        <CameraRig />
        <ambientLight intensity={0.35} color="#8a7fd8" />
        <directionalLight position={[30, 40, -60]} intensity={1.4} color="#cdd8ff" />
        <pointLight position={[4, -2, -115]} intensity={60} distance={140} color="#b070ff" />
        <pointLight position={[0, 0, -452]} intensity={50} distance={60} color="#ff5fa2" />

        <StarField />
        <WarpStreaks />
        <Nebula />
        <Galaxy />
        <CosmicTunnel />
        <Planets />
        <Asteroids />
        <FloatingPhotos />

        {/* heart glimpsed in the opening, far ahead */}
        <Heart position={[0, 0.6, -8]} scale={1.6} intensity={0.9} />
        {/* the heart of the universe — final reveal */}
        <Heart position={[0, 0.4, -452]} scale={3.4} intensity={1.5} />
      </Suspense>
    </Canvas>
  );
}
