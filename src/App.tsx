import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import LandingScene from "./components/cosmic/LandingScene";
import LandingOverlay from "./components/ui/LandingOverlay";
import CosmicExperience from "./components/experience/CosmicExperience";
import LoadingScreen from "./components/ui/LoadingScreen";
import IntroOverlay from "./components/ui/IntroOverlay";
import ScrollProgress from "./components/ui/ScrollProgress";
import MusicControl from "./components/ui/MusicControl";
import CaptionLayer from "./components/ui/CaptionLayer";
import PhotoLightbox from "./components/ui/PhotoLightbox";
import LetterRelic from "./components/ui/LetterRelic";
import { useScrollJourney } from "./hooks/useScrollJourney";
import { useMouseParallax } from "./hooks/useMouseParallax";
import { journey } from "./utils/journey";
import { land } from "./utils/landing";
import { startMusic, sfxWhoosh, sfxChime } from "./utils/audio";

type Phase = "loading" | "landing" | "departing" | "journey";

/** Mounts the journey canvas with a soft fade-in during departure. */
function FadeInCanvas({ children }: { children: React.ReactNode }) {
  const [o, setO] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setO(1)));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="fixed inset-0 z-0 transition-opacity duration-[1700ms] ease-out" style={{ opacity: o }}>
      {children}
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [ready, setReady] = useState(false);
  const [journeyOn, setJourneyOn] = useState(false);
  const spacer = useRef<HTMLDivElement>(null);
  const chimed = useRef(false);

  const progress = useScrollJourney(spacer);
  useMouseParallax();

  // cinematic minimum-load — gives the "Preparing the Universe" beat
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // loader auto-fades into the landing once ready
  useEffect(() => {
    if (ready && phase === "loading") {
      const t = setTimeout(() => setPhase("landing"), 300);
      return () => clearTimeout(t);
    }
  }, [ready, phase]);

  // lock scroll until the user enters the universe
  useEffect(() => {
    document.body.style.overflow = journeyOn ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [journeyOn]);

  // soft chime once the reveal arrives
  useEffect(() => {
    if (progress > 0.94 && !chimed.current && phase === "journey") {
      chimed.current = true;
      sfxChime();
    }
  }, [progress, phase]);

  const enter = () => {
    if (phase !== "landing") return;
    setPhase("departing");
    journey.active = true;
    startMusic();
    sfxWhoosh();
    // bring the journey canvas up underneath mid-transition
    setTimeout(() => {
      setJourneyOn(true);
      window.scrollTo({ top: 0 });
    }, 1000);
    gsap.to(land, {
      depart: 1,
      duration: 2.6,
      ease: "power2.inOut",
      onComplete: () => setPhase("journey"),
    });
  };

  return (
    <div className="relative bg-void">
      {/* LANDING — the living universe framed on the heart orb */}
      {phase !== "journey" && (
        <div className="fixed inset-0 z-0">
          <LandingScene />
        </div>
      )}

      {/* JOURNEY — the scroll-driven universe, faded in during departure */}
      {journeyOn && (
        <FadeInCanvas>
          <CosmicExperience />
        </FadeInCanvas>
      )}

      {/* the scroll track: height IS the journey */}
      <div ref={spacer} className="pointer-events-none relative z-10 h-[900vh]" />

      {/* DOM overlays — the only "UI" that ever appears */}
      {(phase === "landing" || phase === "departing") && (
        <LandingOverlay departing={phase === "departing"} onEnter={enter} />
      )}
      {journeyOn && (
        <>
          <IntroOverlay visible={progress < 0.05} />
          <CaptionLayer progress={progress} />
          <ScrollProgress progress={progress} />
          <MusicControl />
          <PhotoLightbox />
          <LetterRelic visible={progress > 0.94} />
        </>
      )}

      <AnimatePresence>
        {phase === "loading" && <LoadingScreen />}
      </AnimatePresence>
    </div>
  );
}
