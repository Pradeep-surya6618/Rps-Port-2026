/** Nav links, each with its section's theme colour (see "Section themes" in globals.css). */
export const navigation = [
  { id: "about", label: "About", rgb: "251 146 60" },
  { id: "experience", label: "Experience", rgb: "167 139 250" },
  { id: "work", label: "Work", rgb: "250 204 21" },
  { id: "stack", label: "Stack", rgb: "34 211 238" },
  { id: "contact", label: "Contact", rgb: "248 113 113" },
] as const;

export type SectionId = (typeof navigation)[number]["id"];
