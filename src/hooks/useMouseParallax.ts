import { useEffect } from "react";
import { journey } from "../utils/journey";

/** Feeds normalised pointer position into `journey.mouse` (-1..1). */
export function useMouseParallax() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      journey.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      journey.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
}
