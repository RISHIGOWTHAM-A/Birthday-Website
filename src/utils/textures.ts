import * as THREE from "three";

function canvasTex(size: number, draw: (g: CanvasRenderingContext2D, s: number) => void) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Soft radial glow sprite (stars, halos, heart glow). */
export function makeGlowTexture(inner = "rgba(255,255,255,1)", outer = "rgba(255,255,255,0)") {
  return canvasTex(128, (g, s) => {
    const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, inner);
    grad.addColorStop(0.35, inner.replace(",1)", ",0.55)"));
    grad.addColorStop(1, outer);
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
  });
}

/** Procedural planet surface — gradient + horizontal noise bands + speckle. */
export function makePlanetTexture(top: string, mid: string, bottom: string, seed = 0) {
  return canvasTex(512, (g, s) => {
    const grad = g.createLinearGradient(0, 0, 0, s);
    grad.addColorStop(0, top);
    grad.addColorStop(0.5, mid);
    grad.addColorStop(1, bottom);
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
    let rnd = seed * 9301 + 49297;
    const rand = () => ((rnd = (rnd * 233280 + 9301) % 2147483647), rnd / 2147483647);
    for (let i = 0; i < 42; i++) {
      const y = rand() * s, h = 6 + rand() * 40, w = s * (0.4 + rand() * 0.6);
      g.globalAlpha = 0.05 + rand() * 0.13;
      g.fillStyle = rand() > 0.5 ? "#ffffff" : "#000020";
      g.beginPath();
      g.ellipse((rand() * s) | 0, y, w / 2, h / 2, 0, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 0.5;
    for (let i = 0; i < 500; i++) {
      g.fillStyle = `rgba(255,255,255,${rand() * 0.25})`;
      g.fillRect(rand() * s, rand() * s, 1.4, 1.4);
    }
    g.globalAlpha = 1;
  });
}

/** Ring texture for the ringed planet (transparent edges). */
export function makeRingTexture() {
  return canvasTex(256, (g, s) => {
    const grad = g.createRadialGradient(s / 2, s / 2, s * 0.28, s / 2, s / 2, s / 2);
    grad.addColorStop(0, "rgba(190,170,255,0)");
    grad.addColorStop(0.25, "rgba(190,170,255,0.5)");
    grad.addColorStop(0.55, "rgba(140,110,220,0.28)");
    grad.addColorStop(0.8, "rgba(230,220,255,0.4)");
    grad.addColorStop(1, "rgba(140,110,220,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
  });
}

/** Fallback "memory" texture when a photo file is missing. */
export function makePhotoFallback(label: string) {
  return canvasTex(512, (g, s) => {
    const grad = g.createLinearGradient(0, 0, s, s);
    grad.addColorStop(0, "#1a0f4a");
    grad.addColorStop(0.55, "#3c1d7a");
    grad.addColorStop(1, "#6b2f9e");
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
    let rnd = label.length * 7919;
    const rand = () => ((rnd = (rnd * 233280 + 12345) % 2147483647), rnd / 2147483647);
    for (let i = 0; i < 220; i++) {
      g.fillStyle = `rgba(255,255,255,${0.2 + rand() * 0.7})`;
      const r = rand() * 1.6 + 0.4;
      g.beginPath();
      g.arc(rand() * s, rand() * s, r, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = "rgba(244,240,255,0.85)";
    g.font = "300 34px 'Cormorant Garamond', serif";
    g.textAlign = "center";
    g.fillText(label, s / 2, s / 2 + 12);
  });
}
