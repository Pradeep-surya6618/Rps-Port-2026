import type { IconName } from "@/components/ui/Icon";

export type Skill = { name: string; icon: IconName };

export type SkillGroup = {
  id: string;
  label: string;
  /** Hub position inside the constellation, in % of the stage. */
  hub: { x: number; y: number };
  /** Direction (degrees) the skills fan out towards, away from the centre. */
  fan: number;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    hub: { x: 24, y: 30 },
    fan: 205,
    skills: [
      { name: "Next.js", icon: "nextjs" },
      { name: "React", icon: "react" },
      { name: "JavaScript", icon: "javascript" },
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    hub: { x: 76, y: 28 },
    fan: -25,
    skills: [
      { name: "NestJS", icon: "nestjs" },
      { name: "Node.js", icon: "nodejs" },
      { name: "REST APIs", icon: "api" },
    ],
  },
  {
    id: "database",
    label: "Database",
    hub: { x: 28, y: 76 },
    fan: 150,
    skills: [
      { name: "MongoDB", icon: "mongodb" },
      { name: "DynamoDB", icon: "dynamodb" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    hub: { x: 73, y: 75 },
    fan: 8,
    skills: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "VS Code", icon: "vscode" },
      { name: "Postman", icon: "postman" },
    ],
  },
];

export const alsoWorkWith = [
  "React Native",
  "AWS database services",
  "Authentication",
  "Role-based access",
  "Responsive UI",
  "SaaS / EdTech",
];

export type PlacedSkill = Skill & { x: number; y: number; group: string };

/**
 * Lays each group's skills out on an arc around its hub, fanning away from
 * the stage centre. Deterministic, so server and client markup match.
 */
export function placeSkills(groups: SkillGroup[]): PlacedSkill[] {
  const spread = 34; // degrees between neighbours
  const rx = 15; // % of stage width
  const ry = 17; // % of stage height
  return groups.flatMap((group) => {
    const n = group.skills.length;
    return group.skills.map((skill, i) => {
      const angle = ((group.fan + (i - (n - 1) / 2) * spread) * Math.PI) / 180;
      return {
        ...skill,
        group: group.id,
        x: round(group.hub.x + Math.cos(angle) * rx),
        y: round(group.hub.y + Math.sin(angle) * ry),
      };
    });
  });
}

const round = (v: number) => Math.round(v * 100) / 100;

/* ─── Phone layout: an oval "orbit" instead of the wide network ─── */

/** Stage proportions the orbit is designed for (width : height). */
export const ORBIT_ASPECT = { w: 358, h: 700 };

export type OrbitLayout = {
  skills: Record<string, { x: number; y: number }>;
  hubs: Record<string, { x: number; y: number }>;
};

/**
 * Places every skill at equal distances along an oval, grouped by category,
 * with the category hubs in a column through the middle.
 * Coordinates are % of the stage. Deterministic, so SSR and client match.
 */
export function placeSkillsOrbit(groups: SkillGroup[]): OrbitLayout {
  const { w, h } = ORBIT_ASPECT;
  const cx = w / 2;
  const cy = h / 2;
  const outer = { rx: 118, ry: 300 };
  // Start angle chosen so Frontend sits top-left, Backend and Database on the
  // right, Tools along the bottom-left.
  const t0 = (-186 * Math.PI) / 180;

  // Sample the outer ellipse to space skills by arc length, not by angle
  // (equal angles would bunch chips together at the top and bottom).
  const N = 2000;
  const pts: { t: number; len: number }[] = [];
  let len = 0;
  let px = cx + outer.rx * Math.cos(t0);
  let py = cy + outer.ry * Math.sin(t0);
  for (let i = 0; i <= N; i++) {
    const t = t0 + (i / N) * Math.PI * 2;
    const x = cx + outer.rx * Math.cos(t);
    const y = cy + outer.ry * Math.sin(t);
    len += Math.hypot(x - px, y - py);
    pts.push({ t, len });
    px = x;
    py = y;
  }

  const all = groups.flatMap((g) => g.skills.map((s) => ({ g: g.id, s })));
  const step = len / all.length;
  const skills: OrbitLayout["skills"] = {};

  all.forEach(({ g, s }, i) => {
    const target = (i + 0.5) * step;
    const t = pts.find((p) => p.len >= target)?.t ?? t0;
    skills[`${g}:${s.name}`] = {
      x: round(((cx + outer.rx * Math.cos(t)) / w) * 100),
      y: round(((cy + outer.ry * Math.sin(t)) / h) * 100),
    };
  });

  // Hubs sit in the free column down the middle, two above the core and two
  // below, so they never collide with the chips on the ring; their lines fan
  // out to their skills.
  const column = [25, 37, 63, 75];
  const hubs: OrbitLayout["hubs"] = {};
  groups.forEach((g, i) => {
    hubs[g.id] = { x: 50, y: column[i] ?? 50 };
  });
  return { skills, hubs };
}

