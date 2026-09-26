export type SocialId = "email" | "linkedin" | "github" | "instagram";

export type SocialLink = {
  id: SocialId;
  label: string;
  handle: string;
  href: string;
};

export const socials: SocialLink[] = [
  {
    id: "email",
    label: "Email",
    handle: "pradeepsurya6618@gmail.com",
    href: "mailto:pradeepsurya6618@gmail.com",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "in/pradeep-surya-b0a2a61a2",
    href: "https://www.linkedin.com/in/pradeep-surya-b0a2a61a2",
  },
  {
    id: "github",
    label: "GitHub",
    handle: "Pradeep-surya6618",
    href: "https://github.com/Pradeep-surya6618",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@html_css_js_codings_",
    href: "https://www.instagram.com/html_css_js_codings_",
  },
];

export const socialById = (id: SocialId) => socials.find((s) => s.id === id)!;
