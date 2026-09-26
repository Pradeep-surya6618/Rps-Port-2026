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
    fan: 25,
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
