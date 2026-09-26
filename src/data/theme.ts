/**
 * Brand colour for the site chrome: intro loader, navbar and hero.
 * "green" is the original look; "blue" matches the Education section.
 * Switching this one value recolours all three, including the hero's
 * mountain image and the intro's magic wave and lightning.
 */
export type BrandAccent = "green" | "blue";

export const brandAccent = "blue" as BrandAccent;

/** Colours used from JavaScript (WebGL wave, canvas lightning). */
const palettes = {
  green: {
    wipe: { a: "#022e1b", b: "#20e878", c: "#044d2d", glow: [0.05, 0.95, 0.45] as [number, number, number] },
    bolt: { rgb: "0, 255, 170", glow: "#00ffaa", core: "209, 250, 229" },
  },
  blue: {
    wipe: { a: "#06163a", b: "#3b82f6", c: "#0b2a66", glow: [0.25, 0.55, 1.0] as [number, number, number] },
    bolt: { rgb: "96, 165, 250", glow: "#60a5fa", core: "219, 234, 254" },
  },
} as const;

export const brandPalette = palettes[brandAccent];

/** Value for a data-accent attribute (green is the default, so no attribute). */
export const brandAccentAttr = brandAccent === "green" ? undefined : brandAccent;
