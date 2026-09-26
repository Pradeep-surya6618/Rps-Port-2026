export type Project = {
  number: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  features?: string[];
  technologies: string[];
  image: { src: string; width: number; height: number; alt: string };
  /** How the screenshot is framed: a browser window or a board of phone screens. */
  frame: "browser" | "board";
  link?: { href: string; label: string };
  status: string;
  /** Scene tint, blended into the dark background of the panel. */
  tint: string;
};

export const projects: Project[] = [
  {
    number: "01",
    slug: "classory",
    title: "Classory",
    category: "SaaS / EdTech",
    description:
      "Full-stack feature development on a live multi-tenant learning platform — dashboards, learning paths and the APIs behind them.",
    technologies: ["Next.js", "Node.js / NestJS", "REST APIs", "AWS / database services"],
    image: {
      src: "/projects/Classory.png",
      width: 1901,
      height: 1058,
      alt: "Classory student dashboard with streak tracker, activity and quick stats",
    },
    frame: "browser",
    status: "Live platform",
    tint: "#0f5a3c",
  },
  {
    number: "02",
    slug: "esha-jobs",
    title: "Esha Jobs",
    category: "Recruitment website",
    description: "Website for an overseas nursing recruitment consultancy.",
    features: [
      "Dynamic job vacancies",
      "Online application flow",
      "Enquiry flow",
      "Responsive service pages",
    ],
    technologies: ["Next.js"],
    image: {
      src: "/projects/EshaJobs.png",
      width: 1888,
      height: 1067,
      alt: "Esha Jobs home page: “Your Gateway to Global Careers” over an aircraft in the sky",
    },
    frame: "browser",
    link: { href: "https://eshajobs.com", label: "Visit site" },
    status: "Live",
    tint: "#0d4a52",
  },
  {
    number: "03",
    slug: "spofi",
    title: "Spofi",
    category: "Mobile · Personal project",
    description:
      "A React Native music app exploring duo listening — two people on one session — and AI-powered recommendations.",
    technologies: ["React Native", "AI recommendations"],
    image: {
      src: "/projects/Spofi.png",
      width: 1536,
      height: 1024,
      alt: "Thirteen Spofi app screens, from splash and onboarding to genre and artist selection",
    },
    frame: "board",
    status: "In progress",
    tint: "#2a1f5c",
  },
  {
    number: "04",
    slug: "fufi",
    title: "FuFi",
    category: "Fintech · Personal project",
    description:
      "An AI-powered money-saving app in React Native that helps people track spending and build better savings habits.",
    technologies: ["React Native", "AI assistant"],
    image: {
      src: "/projects/Fufi.png",
      width: 1911,
      height: 1072,
      alt: "FuFi login screen: “Smart way to manage your salary, savings and future”",
    },
    frame: "browser",
    status: "In progress",
    tint: "#145c2c",
  },
];
