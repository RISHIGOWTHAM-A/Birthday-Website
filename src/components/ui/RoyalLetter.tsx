import { motion, AnimatePresence } from "framer-motion";
import { birthdayConfig as c } from "../../config/birthdayConfig";

/**
 * The royal letter — a cream folded paper that unfolds upward.
 * "FOLD IT BACK" pill + heart wax seal.
 */
export default function RoyalLetter({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onClose}
          className="fixed inset-0 z-[75] flex items-center justify-center p-6"
          style={{ background: "rgba(2,0,16,.82)", backdropFilter: "blur(10px)" }}
        >
          <motion.div
            initial={{ rotateX: 75, y: 60, opacity: 0.4 }}
            animate={{ rotateX: 0, y: 0, opacity: 1 }}
            exit={{ rotateX: 70, y: 50, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "50% 100%", perspective: 900 }}
            onClick={(e) => e.stopPropagation()}
            className="relative"
          >
            {/* folded paper */}
            <div
              className="relative max-h-[78vh] w-[min(92vw,30rem)] overflow-y-auto px-8 py-10 sm:px-10"
              style={{
                background: "linear-gradient(180deg, #f7edd6, #f3e5c4 55%, #eedbb2)",
                borderRadius: "6px",
                boxShadow: "0 0 60px rgba(255,140,40,.24), inset 0 0 80px rgba(140,100,40,.12)",
                color: "#5a4326",
                scrollbarWidth: "thin",
              }}
            >
              {/* fold creases */}
              <div className="pointer-events-none absolute inset-x-0 top-1/3 h-px" style={{ background: "rgba(120,90,40,.14)" }} />
              <div className="pointer-events-none absolute inset-x-0 top-2/3 h-px" style={{ background: "rgba(120,90,40,.14)" }} />
              <div className="font-serif space-y-4 text-[0.95rem] italic leading-[1.7]" style={{ color: "#6b5232" }}>
                {c.letter.map((line, i) => (
                  <p key={i} className={i === 0 ? "font-script text-3xl not-italic" : i === c.letter.length - 1 ? "text-right" : ""}>
                    {line}
                  </p>
                ))}
              </div>
              {/* FOLD IT BACK pill */}
              <div className="mt-8 text-center">
                <button
                  onClick={onClose}
                  className="rounded-full px-6 py-2 text-[0.6rem] font-medium tracking-[0.28em]"
                  style={{ background: "#232a4a", color: "#e8dcc0" }}
                >
                  FOLD IT BACK&nbsp;&nbsp;⌃
                </button>
              </div>
              {/* heart wax seal — bottom right */}
              <div
                className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full text-lg"
                style={{
                  background: "radial-gradient(circle at 35% 30%, #ff7a6e, #c2263a 65%, #8c1226)",
                  boxShadow: "0 3px 12px rgba(140,18,38,.55), inset 0 -3px 6px rgba(0,0,0,.3)",
                  color: "#ffd8d4",
                }}
              >
                ❤
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
