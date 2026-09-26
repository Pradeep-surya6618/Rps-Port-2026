import type { Metadata, Viewport } from "next";
import { Inter, Mr_Dafoe, Sora } from "next/font/google";
import { profile } from "@/data/profile";
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

// Brush script, used only for the "Surya" signature.
const script = Mr_Dafoe({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = `${profile.fullName} | ${profile.title}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: profile.siteDescription,
  applicationName: profile.fullName,
  authors: [{ name: profile.fullName, url: "https://github.com/Pradeep-surya6618" }],
  creator: profile.fullName,
  keywords: [
    "Pradeep Surya",
    "Full Stack Developer",
    "Next.js",
    "React",
    "NestJS",
    "Node.js",
    "MongoDB",
    "DynamoDB",
    "Kovilpatti",
    "Tamil Nadu",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description: profile.siteDescription,
    siteName: profile.fullName,
    locale: "en_IN",
    images: [{ url: "/images/port.png", width: 1609, height: 765, alt: `${profile.fullName}, ${profile.title}` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.siteDescription,
    images: ["/images/port.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
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
      className={`${display.variable} ${body.variable} ${script.variable} intro-active`}
      suppressHydrationWarning
    >
      {/* Extensions such as Grammarly add attributes to <body> before React
          loads; this ignores those attribute differences on <body> only. */}
      <body suppressHydrationWarning>
        <noscript>
          <style>{`html.intro-active{overflow:auto}[data-intro]{display:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
