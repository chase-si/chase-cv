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

export type PosterSpecId = "1:1" | "4:5" | "16:9";

export type PosterSpec = {
  height: number;
  id: PosterSpecId;
  label: string;
  width: number;
};

export const posterTemplates: PosterTemplate[] = [
  {
    id: "minimalist",
    name: "Minimalist",
    category: "Clean",
    cssPath: "/poster-templates/generated/minimalist.css",
    description: "Quiet spacing, crisp dividers, and a focused title lockup.",
  },
  {
    id: "magazine",
    name: "Magazine",
    category: "Editorial",
    cssPath: "/poster-templates/generated/magazine.css",
    description: "Large editorial headline, column rhythm, and issue-style tags.",
  },
  {
    id: "retro",
    name: "Retro",
    category: "Vintage",
    cssPath: "/poster-templates/generated/retro.css",
    description: "Warm poster blocks, chunky borders, and badge-like metadata.",
  },
  {
    id: "tech",
    name: "Tech",
    category: "Digital",
    cssPath: "/poster-templates/generated/tech.css",
    description: "Terminal-inspired panels, grid accents, and product update energy.",
  },
];

export const posterTemplateCategories = [
  "All",
  ...posterTemplates.map((template) => template.category),
].filter((category, index, categories) => categories.indexOf(category) === index);

export const posterSpecs: PosterSpec[] = [
  { height: 1080, id: "1:1", label: "Square", width: 1080 },
  { height: 1350, id: "4:5", label: "Portrait", width: 1080 },
  { height: 1080, id: "16:9", label: "Wide", width: 1920 },
];

export const defaultPosterSpecId: PosterSpecId = "4:5";
