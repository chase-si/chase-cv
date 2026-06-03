export type PosterTemplateCategory =
  | "Clean"
  | "Editorial"
  | "Vintage"
  | "Digital";

export type PosterTemplateId = "minimalist" | "magazine" | "retro" | "tech";

export type PosterTemplate = {
  id: PosterTemplateId;
  name: string;
  category: PosterTemplateCategory;
  cssPath: string;
  description: string;
};

export const posterTemplates: PosterTemplate[] = [
  {
    id: "minimalist",
    name: "Minimalist",
    category: "Clean",
    cssPath: "/poster-templates/minimalist.css",
    description: "Quiet spacing, crisp dividers, and a focused title lockup.",
  },
  {
    id: "magazine",
    name: "Magazine",
    category: "Editorial",
    cssPath: "/poster-templates/magazine.css",
    description: "Large editorial headline, column rhythm, and issue-style tags.",
  },
  {
    id: "retro",
    name: "Retro",
    category: "Vintage",
    cssPath: "/poster-templates/retro.css",
    description: "Warm poster blocks, chunky borders, and badge-like metadata.",
  },
  {
    id: "tech",
    name: "Tech",
    category: "Digital",
    cssPath: "/poster-templates/tech.css",
    description: "Terminal-inspired panels, grid accents, and product update energy.",
  },
];

export const posterTemplateCategories = [
  "All",
  ...posterTemplates.map((template) => template.category),
].filter((category, index, categories) => categories.indexOf(category) === index);
