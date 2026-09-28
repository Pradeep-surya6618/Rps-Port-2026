import { education, profile } from "@/data/profile";
import { socials } from "@/data/social";

/**
 * Public URL of the site. Set NEXT_PUBLIC_SITE_URL for a custom domain;
 * on Vercel the production domain is picked up automatically.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export const siteTitle = `${profile.fullName} | ${profile.title}`;

/** Search results show ~155 characters; this stays within that. */
export const siteDescription =
  "Pradeep Surya is a Full Stack Developer from Tamil Nadu, India, building fast, scalable web apps with Next.js, React, NestJS, Node.js and MongoDB.";

export const siteKeywords = [
  "Pradeep Surya",
  "Full Stack Developer",
  "Full Stack Web Developer",
  "Next.js Developer",
  "React Developer",
  "NestJS Developer",
  "Node.js",
  "MongoDB",
  "DynamoDB",
  "React Native",
  "SaaS",
  "Web Developer Portfolio",
  "Kovilpatti",
  "Tamil Nadu",
  "India",
];

/** schema.org Person, so search engines understand who the site is about. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    jobTitle: profile.title,
    description: siteDescription,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image.jpg`,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kovilpatti",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
    worksFor: { "@type": "Organization", name: "Incrix Techlutions" },
    knowsAbout: ["Next.js", "React", "JavaScript", "NestJS", "Node.js", "REST APIs", "MongoDB", "DynamoDB", "React Native"],
    sameAs: socials.filter((s) => s.id !== "email").map((s) => s.href),
  };
}
