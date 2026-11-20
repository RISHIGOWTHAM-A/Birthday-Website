export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: {
      void: "#030014",
      deep: "#07012a",
      nebula: "#2a1668",
      indigo2: "#4b2fd6",
      violet2: "#7a3ff0",
      electric: "#4d8dff",
      magenta: "#c85bff",
      lavender: "#c9b8ff",
      stardust: "#f4f0ff"
    },
    fontFamily: {
      script: ["'Great Vibes'", "cursive"],
      serif: ["'Cormorant Garamond'", "serif"],
      sans: ["Inter", "system-ui", "sans-serif"]
    }
  } },
  plugins: []
};
