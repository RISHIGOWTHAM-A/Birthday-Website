import { motion } from "framer-motion";

/** Glowing orb travelling down a cosmic line — the journey meter. */
export default function ScrollProgress({ progress }: { progress: number }) {
  return (
    <div className="pointer-events-none fixed right-4 top-1/2 z-[70] flex -translate-y-1/2 flex-col items-center gap-3 md:right-7">
      <span className="text-[0.5rem] font-light tracking-[0.35em] text-lavender/50 [writing-mode:vertical-rl]">
        UNIVERSE JOURNEY
      </span>
      <div className="relative h-[38vh] w-px overflow-visible bg-gradient-to-b from-transparent via-violet2/40 to-transparent">
        <motion.div
          className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-lavender"
          style={{
            top: `${progress * 100}%`,
            boxShadow: "0 0 14px 4px rgba(190,150,255,.85), 0 0 34px 10px rgba(140,90,255,.35)",
          }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
        />
      </div>
    </div>
  );
}
