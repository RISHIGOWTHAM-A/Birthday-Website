import { useEffect, useState } from "react";
import { toggleMusic, onMusicChange } from "../../utils/audio";

/** Corner music toggle — animated bars while playing. */
export default function MusicControl() {
  const [playing, setPlaying] = useState(false);
  useEffect(() => onMusicChange(setPlaying), []);

  return (
    <button
      onClick={toggleMusic}
      aria-label={playing ? "Pause music" : "Play music"}
      className="fixed bottom-5 right-5 z-[70] flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110"
      style={{
        background: "rgba(20,10,50,.45)",
        border: "1px solid rgba(200,170,255,.35)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 20px rgba(140,90,255,.3)",
      }}
    >
      <span className="flex h-4 items-end gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[2.5px] rounded-full bg-lavender"
            style={
              playing
                ? { animation: `eq 1s ease-in-out ${i * 0.14}s infinite` }
                : { height: 4, opacity: 0.6 }
            }
          />
        ))}
      </span>
    </button>
  );
}
