import type { Metadata, Viewport } from "next";
import { Inter, Mr_Dafoe, Orbitron, Sora } from "next/font/google";
import { profile } from "@/data/profile";
import { personJsonLd, siteDescription, siteKeywords, siteTitle, siteUrl } from "@/lib/site";
import { perfInitScript } from "@/lib/perf";
import "./globals.css";

const display = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Wide futuristic face, used only for the name on the loading screen.
const hud = Orbitron({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-hud",
  display: "swap",
});

// Brush script, used only for the "Surya" signature.
const script = Mr_Dafoe({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: `%s | ${profile.fullName}` },
  description: siteDescription,
  applicationName: `${profile.fullName} — Portfolio`,
  authors: [{ name: profile.fullName, url: siteUrl }],
  creator: profile.fullName,
  publisher: profile.fullName,
  category: "technology",
  keywords: siteKeywords,
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, address: false, email: false },
  // The share image comes from app/opengraph-image.png (and its .alt.txt).
  openGraph: {
    type: "profile",
    url: "/",
    title: siteTitle,
    description: siteDescription,
    siteName: `${profile.fullName} — Portfolio`,
    locale: "en_IN",
    firstName: profile.firstName,
    lastName: profile.lastName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#020807",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${script.variable} ${hud.variable} intro-active`}
      suppressHydrationWarning
    >
      <head>
        {/* Picks the performance tier (full / lite) before the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: perfInitScript }} />
      </head>
      {/* Extensions such as Grammarly add attributes to <body> before React
          loads; this ignores those attribute differences on <body> only. */}
      <body suppressHydrationWarning>
        <noscript>
          <style>{`html.intro-active{overflow:auto}[data-intro]{display:none!important}`}</style>
        </noscript>
        {children}
        {/* Structured data: tells search engines this site is about a person. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
