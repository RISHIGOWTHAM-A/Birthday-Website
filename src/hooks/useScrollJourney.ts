import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "../utils/journey";

gsap.registerPlugin(ScrollTrigger);

/**
 * One master ScrollTrigger driving the whole cinematic journey.
 * Raw progress lands in `journey.progress` (read every frame by the
 * CameraRig) and a throttled copy is returned for DOM overlays.
 */
export function useScrollJourney(triggerRef: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!triggerRef.current) return;
    let last = -1;
    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate(self) {
        journey.progress = self.progress;
        const q = Math.round(self.progress * 500) / 500;
        if (q !== last) { last = q; setProgress(q); }
      },
    });
    return () => st.kill();
  }, [triggerRef]);

  return progress;
}
