import { socialById } from "./social";

const ig = socialById("instagram");

/** Figures and bio as shown on the Instagram profile. */
export const instagram = {
  handle: "html_css_js_codings_",
  url: ig.href,
  name: "Pradeep Surya",
  category: "Education",
  /** Followers in thousands, for the count-up (17.2K). */
  followersK: 17.2,
  posts: 11,
  following: 8,
  bio: [
    { icon: "rocket", text: "Full Stack Dev | Creator" },
    { icon: "wrench", text: "Breaking & Building the Web" },
    { icon: "bulb", text: "Coding Tips • Digital Journeys" },
    { icon: "zap", text: "Powered by #TeamIncrix" },
  ],
  link: "pradeepsurya-dev.vercel.app",
  /** What the page is about, used for the tag marquee. */
  topics: ["#HTML", "#CSS", "#JavaScript", "#WebDev", "#CodingTips", "#Frontend", "#DigitalJourneys", "#TeamIncrix"],
} as const;

export type BioIcon = (typeof instagram.bio)[number]["icon"];
