import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { siteDescription } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.fullName} — ${profile.title}`,
    short_name: profile.fullName,
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#020807",
    theme_color: "#020807",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
