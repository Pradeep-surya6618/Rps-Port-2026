import {
  siCss,
  siGit,
  siGithub,
  siHtml5,
  siInstagram,
  siJavascript,
  siMongodb,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostman,
  siReact,
} from "simple-icons";

type Glyph = { path: string; color: string };

// Brand paths from simple-icons. Colours are nudged where the official one
// disappears on a near-black background (Next.js, GitHub).
const brands = {
  nextjs: { path: siNextdotjs.path, color: "#F5F7F6" },
  react: { path: siReact.path, color: "#61DAFB" },
  nodejs: { path: siNodedotjs.path, color: "#6CC24A" },
  mongodb: { path: siMongodb.path, color: "#47A248" },
  javascript: { path: siJavascript.path, color: "#F7DF1E" },
  html: { path: siHtml5.path, color: "#E34F26" },
  css: { path: siCss.path, color: "#8A63D2" },
  nestjs: { path: siNestjs.path, color: "#E0234E" },
  git: { path: siGit.path, color: "#F05032" },
  github: { path: siGithub.path, color: "#F5F7F6" },
  postman: { path: siPostman.path, color: "#FF6C37" },
  instagram: { path: siInstagram.path, color: "#F5F7F6" },
} satisfies Record<string, Glyph>;

export type IconName =
  | keyof typeof brands
  | "dynamodb"
  | "vscode"
  | "api"
  | "linkedin"
  | "email";

type IconProps = {
  name: IconName;
  size?: number;
  /** Use the brand colour instead of currentColor. */
  brand?: boolean;
  className?: string;
};

export function Icon({ name, size = 24, brand = false, className }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    className,
    "aria-hidden": true,
    focusable: false,
  } as const;

  if (name in brands) {
    const glyph = brands[name as keyof typeof brands];
    return (
      <svg {...common} fill={brand ? glyph.color : "currentColor"}>
        <path d={glyph.path} />
      </svg>
    );
  }

  switch (name) {
    case "dynamodb":
      // Stacked table glyph (DynamoDB is not in simple-icons).
      return (
        <svg {...common} fill="none" stroke={brand ? "#4D7CFE" : "currentColor"} strokeWidth={1.6}>
          <ellipse cx="12" cy="5" rx="7.5" ry="2.6" fill={brand ? "#4D7CFE" : "none"} fillOpacity={0.35} />
          <path d="M4.5 5v4.6c0 1.4 3.4 2.6 7.5 2.6s7.5-1.2 7.5-2.6V5" />
          <path d="M4.5 9.6v4.6c0 1.4 3.4 2.6 7.5 2.6s7.5-1.2 7.5-2.6V9.6" />
          <path d="M4.5 14.2v4.6c0 1.4 3.4 2.6 7.5 2.6s7.5-1.2 7.5-2.6v-4.6" />
        </svg>
      );
    case "vscode":
      return (
        <svg {...common} fill="none" stroke={brand ? "#3FA9F5" : "currentColor"} strokeWidth={1.7} strokeLinejoin="round">
          <path d="M16.5 2.8 21 5v14l-4.5 2.2L6 12.3l-2.6 2L2 13.5v-3l1.4-.8L6 11.7Z" />
          <path d="M16.5 2.8v18.4M6 11.7 16.5 7M6 12.3 16.5 17" />
        </svg>
      );
    case "api":
      return (
        <svg {...common} fill="none" stroke={brand ? "#35FF8A" : "currentColor"} strokeWidth={1.7} strokeLinecap="round">
          <path d="M8 7 3 12l5 5M16 7l5 5-5 5M13.5 5l-3 14" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
        </svg>
      );
    case "email":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round">
          <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
          <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
        </svg>
      );
  }
}
