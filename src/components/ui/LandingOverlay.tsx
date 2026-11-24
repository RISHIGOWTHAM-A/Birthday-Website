import { motion, AnimatePresence } from "framer-motion";
import { birthdayConfig as c } from "../../config/birthdayConfig";

/**
 * Landing copy — intro line + name above the orb, ENTER button below,
 * fading out once the departure begins.
 */
export default function LandingOverlay({ departing, onEnter }: { departing: boolean; onEnter: () => void }) {
  return (
    <AnimatePresence>
      {!departing && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeInOut" } }}
          className="pointer-events-none fixed inset-0 z-[60] flex flex-col items-center justify-between px-6 py-[9vh] text-center"
        >
          <div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1.4 }}
              className="text-[0.6rem] font-light tracking-[0.55em] text-lavender/75 md:text-xs"
            >
              {c.introLine}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: 1.1, duration: 1.9, ease: [0.22, 1, 0.36, 1] }}
              className="name-glow font-script mt-3 text-6xl leading-tight md:text-8xl"
            >
              {c.name}
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1.4 }}
            className="flex flex-col items-center"
          >
            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="font-serif mb-6 text-[0.7rem] font-light tracking-[0.8em] text-stardust/85"
              style={{ marginLeft: "0.8em" }}
            >
              READY?
            </motion.p>
            <motion.button
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onEnter}
              className="group pointer-events-auto relative rounded-full px-10 py-3.5 text-[0.7rem] font-light tracking-[0.3em] text-stardust"
              style={{
                background: "linear-gradient(135deg, rgba(122,92,255,.22), rgba(200,91,255,.14))",
                border: "1px solid rgba(200,170,255,.5)",
                boxShadow: "0 0 30px rgba(140,90,255,.45), inset 0 0 16px rgba(160,110,255,.22)",
                backdropFilter: "blur(10px)",
              }}
            >
              <span
                className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: "0 0 48px rgba(200,120,255,.65), inset 0 0 24px rgba(200,140,255,.35)" }}
              />
              {c.enterLabel}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
