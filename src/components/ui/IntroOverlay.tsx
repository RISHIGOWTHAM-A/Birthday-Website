import { motion, AnimatePresence } from "framer-motion";
import { birthdayConfig as c } from "../../config/birthdayConfig";

/** Opening title over the live scene — fades as the journey begins. */
export default function IntroOverlay({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0, y: -30, transition: { duration: 1, ease: "easeInOut" } }}
          className="pointer-events-none fixed inset-0 z-[60] flex flex-col items-center justify-center px-6 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.4 }}
            className="text-[0.62rem] font-light tracking-[0.55em] text-lavender/75 md:text-xs"
          >
            {c.introLine}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 1.1, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="name-glow font-script mt-4 text-7xl leading-tight md:text-9xl"
          >
            {c.name}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4, duration: 1.4 }}
            className="mt-14 flex flex-col items-center gap-3"
          >
            <span className="text-[0.6rem] font-light tracking-[0.4em] text-lavender/60">SCROLL TO TRAVEL DEEPER</span>
            <motion.span
              animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-lavender/70"
            >
              ↓
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
