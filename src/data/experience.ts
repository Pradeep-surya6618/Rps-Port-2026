export type ExperienceItem = {
  role: string;
  company: string;
  place: string;
  period: string;
  current: boolean;
  points: string[];
  tech: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Full Stack Web Developer",
    company: "Incrix Techlutions",
    place: "Kovilpatti",
    period: "2025 – Present",
    current: true,
    points: [
      "Develop and maintain scalable full-stack web applications with Next.js and NestJS.",
      "Design and implement RESTful APIs in NestJS for backend services.",
      "Model data with MongoDB and DynamoDB.",
      "Delivered 10+ projects across production websites and web applications.",
      "Design responsive interfaces and work with the team on performance and reliability.",
      "Debug issues and optimise code across the stack.",
    ],
    tech: ["Next.js", "NestJS", "MongoDB", "DynamoDB", "REST APIs"],
  },
  {
    role: "Independent builds",
    company: "Personal projects",
    place: "Free time",
    period: "Alongside work",
    current: false,
    points: [
      "Build my own websites and web apps outside work, including this portfolio (Next.js, GSAP, Lenis).",
      "Explore mobile with React Native: Spofi, a duo-listening music app, and FuFi, an AI money-saving app.",
      "Use these projects to try new tools and practise scalable architecture and performance.",
    ],
    tech: ["Next.js", "React", "React Native", "GSAP"],
  },
  {
    role: "Web Development Intern",
    company: "Technify",
    place: "Internship",
    period: "Before 2025",
    current: false,
    points: [
      "Trained on practical web development workflows.",
      "Contributed to client-facing website builds with HTML, CSS, Bootstrap and JavaScript.",
    ],
    tech: ["HTML", "CSS", "Bootstrap", "JavaScript"],
  },
];
