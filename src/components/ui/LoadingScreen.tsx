import { motion } from "framer-motion";

/** Cinematic loader — auto-fades into the living universe when ready. */
export default function LoadingScreen() {
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
      <motion.p
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        className="mt-10 text-[0.68rem] font-light tracking-[0.45em] text-lavender/80"
      >
        PREPARING THE UNIVERSE...
      </motion.p>
    </motion.div>
  );
}
