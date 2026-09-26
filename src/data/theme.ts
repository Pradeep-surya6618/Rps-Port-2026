/**
 * Brand colour for the site chrome: intro loader, navbar and hero.
 * "green" is the original look; "blue" matches the Education section.
 * Switching this one value recolours all three, including the hero's
 * mountain image and the intro's lightning and portal.
 */
export type BrandAccent = "green" | "blue";

export const brandAccent = "blue" as BrandAccent;

/** Colours used from JavaScript (canvas lightning). */
const palettes = {
  green: {
    bolt: { rgb: "0, 255, 170", glow: "#00ffaa", core: "209, 250, 229" },
  },
  blue: {
    bolt: { rgb: "96, 165, 250", glow: "#60a5fa", core: "219, 234, 254" },
  },
} as const;

export const brandPalette = palettes[brandAccent];

/** Value for a data-accent attribute (green is the default, so no attribute). */
export const brandAccentAttr = brandAccent === "green" ? undefined : brandAccent;
