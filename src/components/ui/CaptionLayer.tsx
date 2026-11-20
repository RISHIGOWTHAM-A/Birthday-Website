import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthdayConfig as c } from "../../config/birthdayConfig";

/**
 * Cinematic captions + the final birthday reveal, keyed to scroll
 * progress. These are the ONLY DOM overlays over the 3D journey.
 */
export default function CaptionLayer({ progress }: { progress: number }) {
  const caption = useMemo(() => {
    let text: string | null = null;
    for (const cap of c.captions) {
      if (progress >= cap.at && progress < cap.at + 0.13) text = cap.text;
    }
    return text;
  }, [progress]);

  const reveal = progress > 0.94;

  return (
    <>
      {/* mid-journey captions */}
      <AnimatePresence mode="wait">
        {caption && !reveal && (
          <motion.div
            key={caption}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-x-0 bottom-[16%] z-[60] px-6 text-center"
          >
            <p className="font-serif text-xl font-light italic tracking-wide text-stardust/90 md:text-3xl"
              style={{ textShadow: "0 0 30px rgba(160,110,255,.7)" }}>
              {caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* final reveal */}
      <AnimatePresence>
        {reveal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.6, ease: "easeOut" } }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="pointer-events-none fixed inset-0 z-[60] flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1.2 }}
              className="text-[0.62rem] font-light tracking-[0.55em] text-lavender/80 md:text-xs"
            >
              AT THE CENTER OF IT ALL
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, scale: 0.9, filter: "blur(14px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.9, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif mt-6 text-4xl font-light tracking-[0.12em] text-stardust md:text-6xl"
            >
              {c.message}
            </motion.h2>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9, filter: "blur(14px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: 1.5, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="name-glow font-script mt-2 text-7xl leading-tight md:text-9xl"
            >
              {c.name} ❤️
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4, duration: 1.4 }}
              className="font-serif mt-8 max-w-md text-base font-light italic leading-relaxed text-lavender/90 md:text-lg"
            >
              {c.subMessage}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2, duration: 1.6 }}
              className="font-serif mt-6 max-w-sm text-sm font-light leading-relaxed text-stardust/70"
            >
              {c.personalNote}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4, duration: 1.6 }}
              className="mt-10 text-[0.6rem] font-light tracking-[0.4em] text-lavender/60"
            >
              {c.signature}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
