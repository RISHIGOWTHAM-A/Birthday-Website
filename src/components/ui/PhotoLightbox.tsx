import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthdayConfig as c } from "../../config/birthdayConfig";

/** Enlarged memory — opened by tapping a floating photo in the 3D scene. */
export default function PhotoLightbox() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const h = (e: Event) => setOpen((e as CustomEvent<number>).detail);
    window.addEventListener("open-photo", h);
    return () => window.removeEventListener("open-photo", h);
  }, []);

  const url = open === null ? "" : c.photos[open];

  return (
    <AnimatePresence>
      {open !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center p-6"
          style={{ background: "rgba(2,0,16,.82)", backdropFilter: "blur(12px)" }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 30, filter: "blur(10px)" }}
            animate={{ scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ scale: 0.85, y: 20, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[78vh] w-auto max-w-[86vw]"
            style={{ boxShadow: "0 0 60px rgba(140,100,255,.45), 0 0 140px rgba(140,100,255,.2)" }}
          >
            <img
              src={url}
              alt={`memory ${open + 1}`}
              className="max-h-[78vh] w-auto max-w-full rounded-xl"
              style={{ border: "1px solid rgba(200,170,255,.5)" }}
            />
            <button
              onClick={() => setOpen(null)}
              className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full text-sm text-stardust"
              style={{ background: "rgba(20,10,50,.9)", border: "1px solid rgba(200,170,255,.5)" }}
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
