export const profile = {
  firstName: "Pradeep",
  lastName: "Surya",
  fullName: "Pradeep Surya",
  title: "Full Stack Developer",
  statement: "Building scalable digital experiences, from interface to backend.",
  experience: "1.9 years",
  location: "Kovilpatti, Tamil Nadu, India",
  languages: "Tamil, English",
  email: "pradeepsurya6618@gmail.com",
  cv: "/pdf/PradeepSuryaCV.pdf",
  siteDescription:
    "Pradeep Surya is a Full Stack Developer building modern web applications, scalable backend systems and digital products.",
} as const;

export const about = {
  lead: "I’m Pradeep Surya, a Full Stack Web Developer focused on building modern web applications, scalable backend systems, and thoughtful user experiences.",
  body: [
    "I work across frontend, backend, APIs, databases, and product development.",
    "I enjoy turning ideas and designs into real, maintainable products.",
  ],
  facts: [
    { label: "Based in", value: "Kovilpatti, Tamil Nadu" },
    { label: "Experience", value: "1.9 years, full stack" },
    { label: "Speaks", value: "Tamil, English" },
    { label: "Off the clock", value: "React Native apps & sharing HTML/CSS/JS on Instagram" },
  ],
} as const;

export const philosophy = {
  lines: ["Clean code", "Better apps"],
  text: "I focus on building interfaces that are not only visually clear, but also maintainable, responsive and connected to reliable backend systems.",
} as const;

export const education = {
  degree: "B.E.",
  field: "Computer Science and Engineering",
  school: "P.A. College of Engineering and Technology",
  city: "Pollachi",
  years: "2019 – 2023",
  score: "CGPA 8.41",
  certifications: [
    { title: "Full Stack Web Development", issuer: "Innovate Technologies, Chennai" },
    { title: "HTML, CSS & JavaScript", issuer: "LetsUpgrade" },
  ],
} as const;
