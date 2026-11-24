import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RoyalLetter from "./RoyalLetter";

/**
 * A glowing sealed-letter relic that appears at the final reveal —
 * tap to open the royal letter with living flames on both edges.
 */
export default function LetterRelic({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <AnimatePresence>
        {visible && !open && (
          <motion.button
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 4.6, duration: 1.2 }}
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-[7vh] left-1/2 z-[65] -translate-x-1/2 rounded-full px-7 py-2.5 text-[0.62rem] font-light tracking-[0.4em] text-stardust"
            style={{
              background: "linear-gradient(135deg, rgba(122,92,255,.22), rgba(255,120,60,.12))",
              border: "1px solid rgba(255,180,120,.45)",
              boxShadow: "0 0 26px rgba(255,140,60,.35), inset 0 0 14px rgba(255,160,80,.18)",
              backdropFilter: "blur(8px)",
            }}
          >
            ✉&nbsp;&nbsp;A ROYAL LETTER AWAITS
          </motion.button>
        )}
      </AnimatePresence>
      <RoyalLetter open={open} onClose={() => setOpen(false)} />
    </>
  );
}
