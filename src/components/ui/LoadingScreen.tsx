import { motion } from "framer-motion";
import { birthdayConfig } from "../../config/birthdayConfig";

/** Cinematic loader → "Ready?" → glowing enter button. */
export default function LoadingScreen({ ready, onEnter }: { ready: boolean; onEnter: () => void }) {
  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-void"
    >
      {/* cosmic ring loader */}
      <div className="relative h-28 w-28">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{ background: "conic-gradient(from 0deg, transparent 10%, #7a5cff 45%, #ff9ddb 60%, transparent 75%)", mask: "radial-gradient(farthest-side, transparent 68%, #000 70%)", WebkitMask: "radial-gradient(farthest-side, transparent 68%, #000 70%)" }}
        />
        <motion.div
          animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="absolute inset-0 m-auto h-3 w-3 rounded-full bg-lavender"
          style={{ boxShadow: "0 0 24px 6px rgba(200,150,255,.8)" }}
        />
      </div>

      {!ready ? (
        <motion.p
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="mt-10 text-[0.68rem] font-light tracking-[0.45em] text-lavender/80"
        >
          PREPARING THE UNIVERSE...
        </motion.p>
      ) : (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="mt-10 flex flex-col items-center">
          <p className="mb-6 text-[0.68rem] font-light tracking-[0.45em] text-lavender/80">READY?</p>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEnter}
            className="group relative rounded-full px-10 py-4 text-sm font-light tracking-[0.25em] text-stardust"
            style={{
              background: "linear-gradient(135deg, rgba(122,92,255,.25), rgba(200,91,255,.18))",
              border: "1px solid rgba(200,170,255,.45)",
              boxShadow: "0 0 32px rgba(140,90,255,.45), inset 0 0 18px rgba(160,110,255,.25)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ boxShadow: "0 0 48px rgba(200,120,255,.7), inset 0 0 24px rgba(200,140,255,.4)" }} />
            {birthdayConfig.enterLabel}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
