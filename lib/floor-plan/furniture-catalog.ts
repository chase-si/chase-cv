import type { FurnitureCatalog, FurnitureCategory, FurnitureDefinition } from "./types";

export const STANDARD_FURNITURE_DEFINITIONS: readonly FurnitureDefinition[] = Object.freeze([
  {
    id: "bed-double",
    name: "Double Bed (1.8m)",
    category: "bed",
    defaultSize: {
      width: 1800,
      depth: 2000,
      height: 900,
    },
    allowedSizeRanges: {
      width: { min: 1500, max: 2000, step: 100 },
      depth: { min: 1900, max: 2200, step: 50 },
    },
    clearanceRules: {
      left: 600,
      right: 600,
      front: 600,
    },
  },
  {
    id: "bed-single",
    name: "Single Bed (1.2m)",
    category: "bed",
    defaultSize: {
      width: 1200,
      depth: 2000,
      height: 800,
    },
    allowedSizeRanges: {
      width: { min: 900, max: 1350, step: 50 },
      depth: { min: 1900, max: 2100, step: 50 },
    },
    clearanceRules: {
      left: 500,
      front: 600,
    },
  },
  {
    id: "sofa-3seat",
    name: "3-Seat Sofa",
    category: "sofa",
    defaultSize: {
      width: 2100,
      depth: 900,
      height: 850,
    },
    allowedSizeRanges: {
      width: { min: 1800, max: 2600, step: 100 },
      depth: { min: 800, max: 1050, step: 50 },
    },
    clearanceRules: {
      front: 450,
    },
  },
  {
    id: "sofa-2seat",
    name: "2-Seat Loveseat",
    category: "sofa",
    defaultSize: {
      width: 1500,
      depth: 850,
      height: 850,
    },
    allowedSizeRanges: {
      width: { min: 1300, max: 1700, step: 100 },
      depth: { min: 800, max: 1000, step: 50 },
    },
    clearanceRules: {
      front: 450,
    },
  },
  {
    id: "dining-table-4",
    name: "Dining Table (4-Seat)",
    category: "table",
    defaultSize: {
      width: 1400,
      depth: 800,
      height: 750,
    },
    allowedSizeRanges: {
      width: { min: 1200, max: 1600, step: 100 },
      depth: { min: 700, max: 900, step: 50 },
    },
    clearanceRules: {
      all: 750,
    },
  },
  {
    id: "coffee-table",
    name: "Coffee Table",
    category: "table",
    defaultSize: {
      width: 1100,
      depth: 600,
      height: 450,
    },
    allowedSizeRanges: {
      width: { min: 900, max: 1300, step: 100 },
      depth: { min: 500, max: 700, step: 50 },
    },
    clearanceRules: {
      all: 400,
    },
  },
  {
    id: "dining-chair",
    name: "Dining Chair",
    category: "chair",
    defaultSize: {
      width: 500,
      depth: 500,
      height: 850,
    },
    allowedSizeRanges: {
      width: { min: 450, max: 600, step: 50 },
      depth: { min: 450, max: 600, step: 50 },
    },
    clearanceRules: {
      front: 500,
    },
  },
  {
    id: "armchair",
    name: "Armchair",
    category: "chair",
    defaultSize: {
      width: 850,
      depth: 850,
      height: 800,
    },
    allowedSizeRanges: {
      width: { min: 750, max: 1000, step: 50 },
      depth: { min: 750, max: 1000, step: 50 },
    },
    clearanceRules: {
      front: 450,
    },
  },
  {
    id: "wardrobe-large",
    name: "Large Wardrobe",
    category: "storage",
    defaultSize: {
      width: 1800,
      depth: 600,
      height: 2200,
    },
    allowedSizeRanges: {
      width: { min: 1200, max: 2400, step: 200 },
      depth: { min: 550, max: 650, step: 50 },
    },
    clearanceRules: {
      front: 800,
    },
  },
  {
    id: "bookcase",
    name: "Bookcase",
    category: "storage",
    defaultSize: {
      width: 900,
      depth: 350,
      height: 1800,
    },
    allowedSizeRanges: {
      width: { min: 600, max: 1200, step: 100 },
      depth: { min: 300, max: 450, step: 50 },
    },
    clearanceRules: {
      front: 600,
    },
  },
  {
    id: "desk",
    name: "Work Desk",
    category: "desk",
    defaultSize: {
      width: 1200,
      depth: 600,
      height: 750,
    },
    allowedSizeRanges: {
      width: { min: 1000, max: 1600, step: 100 },
      depth: { min: 500, max: 750, step: 50 },
    },
    clearanceRules: {
      front: 750,
    },
  },
  {
    id: "tv-stand",
    name: "TV Stand Console",
    category: "tv_stand",
    defaultSize: {
      width: 1600,
      depth: 400,
      height: 500,
    },
    allowedSizeRanges: {
      width: { min: 1200, max: 2200, step: 100 },
      depth: { min: 350, max: 500, step: 50 },
    },
    clearanceRules: {
      front: 800,
    },
  },
]);

export const STANDARD_FURNITURE_CATALOG: FurnitureCatalog = Object.freeze({
  version: 1,
  unit: "mm",
  definitions: [...STANDARD_FURNITURE_DEFINITIONS],
});

export const ALL_FURNITURE_CATEGORIES: readonly FurnitureCategory[] = [
  "bed",
  "sofa",
  "table",
  "chair",
  "storage",
  "desk",
  "tv_stand",
] as const;

export function getDefaultFurnitureCatalog(): FurnitureCatalog {
  return {
    version: 1,
    unit: "mm",
    definitions: STANDARD_FURNITURE_DEFINITIONS.map((def) => ({
      ...def,
      defaultSize: { ...def.defaultSize },
      allowedSizeRanges: def.allowedSizeRanges
        ? {
            width: def.allowedSizeRanges.width ? { ...def.allowedSizeRanges.width } : undefined,
            depth: def.allowedSizeRanges.depth ? { ...def.allowedSizeRanges.depth } : undefined,
            height: def.allowedSizeRanges.height ? { ...def.allowedSizeRanges.height } : undefined,
          }
        : undefined,
      clearanceRules: def.clearanceRules ? { ...def.clearanceRules } : undefined,
    })),
  };
}

export function getFurnitureDefinitionById(
  catalog: FurnitureCatalog,
  id: string,
): FurnitureDefinition | undefined {
  return catalog.definitions.find((d) => d.id === id);
}

export function getFurnitureDefinitionsByCategory(
  catalog: FurnitureCatalog,
  category: FurnitureCategory,
): FurnitureDefinition[] {
  return catalog.definitions.filter((d) => d.category === category);
}

export function getFurnitureCategories(): readonly FurnitureCategory[] {
  return ALL_FURNITURE_CATEGORIES;
}
