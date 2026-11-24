/**
 * ═══════════════════════════════════════════════════════════════
 *  BIRTHDAY CONFIG — edit this ONE file to personalise everything.
 *  • name / date / message shown in the reveal
 *  • photos → drop files into  public/assets/photos/  and list them here
 *  • music  → drop an mp3 into  public/assets/music/  and set the path
 *             (if missing, a soft ambient pad is generated instead)
 * ═══════════════════════════════════════════════════════════════
 */
export const birthdayConfig = {
  name: "Jayashree",
  nameDisplay: "JAYASHREE",
  date: "04 December",
  introLine: "SOMEONE SPECIAL HAS A BIRTHDAY...",
  enterLabel: "Enter Her Universe ✦",

  message: "Happy Birthday",
  subMessage: "May your universe always be filled with beautiful moments.",
  personalNote:
    "Every star you pass on this journey was placed here for you. " +
    "You make ordinary space feel like a universe worth exploring. " +
    "Happy Birthday — with all my heart.",
  signature: "Made with ❤️",

  /** Journey captions shown as the camera travels deeper. */
  captions: [
    { at: 0.16, text: "hold on — we're crossing the stars" },
    { at: 0.33, text: "a whole galaxy, spinning just for you" },
    { at: 0.55, text: "entering her galaxy" },
    { at: 0.71, text: "through rivers of nebula light" },
    { at: 0.83, text: "every memory — a world of its own" },
  ] as { at: number; text: string }[],

  /** The royal letter — opened from the final reveal. */
  letterTitle: "A LETTER FROM THE RAJA",
  letter: [
    "Dear Jayashree,",
    "By the light of a thousand stars, this letter travels across the cosmos to reach you on your special day.",
    "May your year be filled with courage like a warrior, wisdom like the ancients, and joy that burns brighter than any flame.",
    "Wherever your journey takes you, remember — you are cherished beyond measure, and your presence makes every world brighter.",
    "Happy Birthday. The universe celebrates you today.",
    "— with love, Rishi",
  ] as string[],

  /** Replace the .svg placeholders with real photos (photo01.jpg …) */
  photos: [
    "/assets/photos/photo01.svg",
    "/assets/photos/photo02.svg",
    "/assets/photos/photo03.svg",
    "/assets/photos/photo04.svg",
    "/assets/photos/photo05.svg",
    "/assets/photos/photo06.svg",
    "/assets/photos/photo07.svg",
    "/assets/photos/photo08.svg",
  ],

  /** Drop an mp3 at public/assets/music/track.mp3, or leave as-is. */
  music: "/assets/music/track.mp3",
} as const;
