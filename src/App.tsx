import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import CosmicExperience from "./components/experience/CosmicExperience";
import LoadingScreen from "./components/ui/LoadingScreen";
import IntroOverlay from "./components/ui/IntroOverlay";
import ScrollProgress from "./components/ui/ScrollProgress";
import MusicControl from "./components/ui/MusicControl";
import CaptionLayer from "./components/ui/CaptionLayer";
import { useScrollJourney } from "./hooks/useScrollJourney";
import { useMouseParallax } from "./hooks/useMouseParallax";
import { journey } from "./utils/journey";
import { startMusic, sfxWhoosh, sfxChime } from "./utils/audio";

export default function App() {
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const spacer = useRef<HTMLDivElement>(null);
  const chimed = useRef(false);

  const progress = useScrollJourney(spacer);
  useMouseParallax();

  // cinematic minimum-load — gives the "Preparing the Universe" beat
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // lock scroll until the user enters the universe
  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [entered]);

  // soft chime once the reveal arrives
  useEffect(() => {
    if (progress > 0.94 && !chimed.current && entered) {
      chimed.current = true;
      sfxChime();
    }
  }, [progress, entered]);

  const enter = () => {
    setEntered(true);
    journey.active = true;
    startMusic();
    sfxWhoosh();
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="relative bg-void">
      {/* single continuous 3D universe — fixed behind everything */}
      <div className="fixed inset-0 z-0">
        <CosmicExperience />
      </div>

      {/* the scroll track: height IS the journey */}
      <div ref={spacer} className="relative z-10 h-[900vh]" />

      {/* DOM overlays — the only "UI" that ever appears */}
      {entered && (
        <>
          <IntroOverlay visible={progress < 0.05} />
          <CaptionLayer progress={progress} />
          <ScrollProgress progress={progress} />
          <MusicControl />
        </>
      )}

      <AnimatePresence>
        {!entered && <LoadingScreen ready={ready} onEnter={enter} />}
      </AnimatePresence>
    </div>
  );
}
