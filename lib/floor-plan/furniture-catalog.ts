import type {
  ClearanceThreshold,
  FurnitureCatalog,
  FurnitureCatalogV1,
  FurnitureCategory,
  FurnitureDefinition,
  FurnitureDefinitionV1,
  FurnitureSide,
  FurnitureSpecification,
} from "./types";

export const STANDARD_FURNITURE_DEFINITIONS: readonly FurnitureDefinition[] = Object.freeze([
  {
    id: "bed-double",
    name: "Double Bed (1.8m)",
    category: "bed",
    specifications: [
      {
        id: "bed-double-1800",
        name: "1800 × 2000 mm",
        width: 1800,
        depth: 2000,
        height: 900,
        clearance: {
          front: { minimum: 600, recommended: 900 },
          back: { minimum: 0, recommended: 0 },
          left: { minimum: 600, recommended: 750 },
          right: { minimum: 600, recommended: 750 },
        },
      },
      {
        id: "bed-double-1500",
        name: "1500 × 2000 mm",
        width: 1500,
        depth: 2000,
        height: 900,
        clearance: {
          front: { minimum: 600, recommended: 900 },
          back: { minimum: 0, recommended: 0 },
          left: { minimum: 600, recommended: 750 },
          right: { minimum: 600, recommended: 750 },
        },
      },
    ],
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
    specifications: [
      {
        id: "bed-single-1200",
        name: "1200 × 2000 mm",
        width: 1200,
        depth: 2000,
        height: 800,
        clearance: {
          front: { minimum: 600, recommended: 800 },
          back: { minimum: 0, recommended: 0 },
          left: { minimum: 500, recommended: 650 },
          right: { minimum: 0, recommended: 500 },
        },
      },
      {
        id: "bed-single-900",
        name: "900 × 1900 mm",
        width: 900,
        depth: 1900,
        height: 800,
        clearance: {
          front: { minimum: 600, recommended: 800 },
          back: { minimum: 0, recommended: 0 },
          left: { minimum: 500, recommended: 650 },
          right: { minimum: 0, recommended: 500 },
        },
      },
    ],
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
    specifications: [
      {
        id: "sofa-3seat-2100",
        name: "2100 × 900 mm",
        width: 2100,
        depth: 900,
        height: 850,
        clearance: {
          front: { minimum: 450, recommended: 600 },
          back: { minimum: 0, recommended: 100 },
          left: { minimum: 100, recommended: 300 },
          right: { minimum: 100, recommended: 300 },
        },
      },
      {
        id: "sofa-3seat-2400",
        name: "2400 × 950 mm",
        width: 2400,
        depth: 950,
        height: 850,
        clearance: {
          front: { minimum: 450, recommended: 600 },
          back: { minimum: 0, recommended: 100 },
          left: { minimum: 100, recommended: 300 },
          right: { minimum: 100, recommended: 300 },
        },
      },
    ],
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
    specifications: [
      {
        id: "sofa-2seat-1500",
        name: "1500 × 850 mm",
        width: 1500,
        depth: 850,
        height: 850,
        clearance: {
          front: { minimum: 450, recommended: 600 },
          back: { minimum: 0, recommended: 100 },
          left: { minimum: 100, recommended: 300 },
          right: { minimum: 100, recommended: 300 },
        },
      },
      {
        id: "sofa-2seat-1300",
        name: "1300 × 800 mm",
        width: 1300,
        depth: 800,
        height: 850,
        clearance: {
          front: { minimum: 450, recommended: 600 },
          back: { minimum: 0, recommended: 100 },
          left: { minimum: 100, recommended: 300 },
          right: { minimum: 100, recommended: 300 },
        },
      },
    ],
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
    specifications: [
      {
        id: "dining-table-4-1400",
        name: "1400 × 800 mm",
        width: 1400,
        depth: 800,
        height: 750,
        clearance: {
          front: { minimum: 750, recommended: 900 },
          back: { minimum: 750, recommended: 900 },
          left: { minimum: 600, recommended: 750 },
          right: { minimum: 600, recommended: 750 },
        },
      },
      {
        id: "dining-table-4-1200",
        name: "1200 × 750 mm",
        width: 1200,
        depth: 750,
        height: 750,
        clearance: {
          front: { minimum: 750, recommended: 900 },
          back: { minimum: 750, recommended: 900 },
          left: { minimum: 600, recommended: 750 },
          right: { minimum: 600, recommended: 750 },
        },
      },
    ],
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
    specifications: [
      {
        id: "coffee-table-1100",
        name: "1100 × 600 mm",
        width: 1100,
        depth: 600,
        height: 450,
        clearance: {
          front: { minimum: 400, recommended: 500 },
          back: { minimum: 400, recommended: 500 },
          left: { minimum: 300, recommended: 400 },
          right: { minimum: 300, recommended: 400 },
        },
      },
      {
        id: "coffee-table-900",
        name: "900 × 500 mm",
        width: 900,
        depth: 500,
        height: 450,
        clearance: {
          front: { minimum: 400, recommended: 500 },
          back: { minimum: 400, recommended: 500 },
          left: { minimum: 300, recommended: 400 },
          right: { minimum: 300, recommended: 400 },
        },
      },
    ],
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
    specifications: [
      {
        id: "dining-chair-500",
        name: "500 × 500 mm",
        width: 500,
        depth: 500,
        height: 850,
        clearance: {
          front: { minimum: 500, recommended: 600 },
          back: { minimum: 100, recommended: 200 },
          left: { minimum: 100, recommended: 200 },
          right: { minimum: 100, recommended: 200 },
        },
      },
      {
        id: "dining-chair-450",
        name: "450 × 450 mm",
        width: 450,
        depth: 450,
        height: 850,
        clearance: {
          front: { minimum: 500, recommended: 600 },
          back: { minimum: 100, recommended: 200 },
          left: { minimum: 100, recommended: 200 },
          right: { minimum: 100, recommended: 200 },
        },
      },
    ],
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
    specifications: [
      {
        id: "armchair-850",
        name: "850 × 850 mm",
        width: 850,
        depth: 850,
        height: 800,
        clearance: {
          front: { minimum: 450, recommended: 600 },
          back: { minimum: 100, recommended: 200 },
          left: { minimum: 150, recommended: 250 },
          right: { minimum: 150, recommended: 250 },
        },
      },
      {
        id: "armchair-750",
        name: "750 × 750 mm",
        width: 750,
        depth: 750,
        height: 800,
        clearance: {
          front: { minimum: 450, recommended: 600 },
          back: { minimum: 100, recommended: 200 },
          left: { minimum: 150, recommended: 250 },
          right: { minimum: 150, recommended: 250 },
        },
      },
    ],
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
    specifications: [
      {
        id: "wardrobe-large-1800",
        name: "1800 × 600 mm",
        width: 1800,
        depth: 600,
        height: 2200,
        clearance: {
          front: { minimum: 800, recommended: 1000 },
          back: { minimum: 0, recommended: 0 },
          left: { minimum: 0, recommended: 100 },
          right: { minimum: 0, recommended: 100 },
        },
      },
      {
        id: "wardrobe-large-1200",
        name: "1200 × 600 mm",
        width: 1200,
        depth: 600,
        height: 2200,
        clearance: {
          front: { minimum: 800, recommended: 1000 },
          back: { minimum: 0, recommended: 0 },
          left: { minimum: 0, recommended: 100 },
          right: { minimum: 0, recommended: 100 },
        },
      },
    ],
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
    specifications: [
      {
        id: "bookcase-900",
        name: "900 × 350 mm",
        width: 900,
        depth: 350,
        height: 1800,
        clearance: {
          front: { minimum: 600, recommended: 800 },
          back: { minimum: 0, recommended: 0 },
          left: { minimum: 0, recommended: 50 },
          right: { minimum: 0, recommended: 50 },
        },
      },
      {
        id: "bookcase-600",
        name: "600 × 350 mm",
        width: 600,
        depth: 350,
        height: 1800,
        clearance: {
          front: { minimum: 600, recommended: 800 },
          back: { minimum: 0, recommended: 0 },
          left: { minimum: 0, recommended: 50 },
          right: { minimum: 0, recommended: 50 },
        },
      },
    ],
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
    specifications: [
      {
        id: "desk-1200",
        name: "1200 × 600 mm",
        width: 1200,
        depth: 600,
        height: 750,
        clearance: {
          front: { minimum: 750, recommended: 900 },
          back: { minimum: 0, recommended: 100 },
          left: { minimum: 100, recommended: 200 },
          right: { minimum: 100, recommended: 200 },
        },
      },
      {
        id: "desk-1400",
        name: "1400 × 700 mm",
        width: 1400,
        depth: 700,
        height: 750,
        clearance: {
          front: { minimum: 750, recommended: 900 },
          back: { minimum: 0, recommended: 100 },
          left: { minimum: 100, recommended: 200 },
          right: { minimum: 100, recommended: 200 },
        },
      },
    ],
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
    specifications: [
      {
        id: "tv-stand-1600",
        name: "1600 × 400 mm",
        width: 1600,
        depth: 400,
        height: 500,
        clearance: {
          front: { minimum: 800, recommended: 1000 },
          back: { minimum: 0, recommended: 50 },
          left: { minimum: 0, recommended: 100 },
          right: { minimum: 0, recommended: 100 },
        },
      },
      {
        id: "tv-stand-2000",
        name: "2000 × 450 mm",
        width: 2000,
        depth: 450,
        height: 500,
        clearance: {
          front: { minimum: 800, recommended: 1000 },
          back: { minimum: 0, recommended: 50 },
          left: { minimum: 0, recommended: 100 },
          right: { minimum: 0, recommended: 100 },
        },
      },
    ],
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
  version: 2,
  unit: "mm",
  definitions: [...STANDARD_FURNITURE_DEFINITIONS],
});

export const STANDARD_FURNITURE_CATALOG_V2: FurnitureCatalog = STANDARD_FURNITURE_CATALOG;

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
    version: 2,
    unit: "mm",
    definitions: STANDARD_FURNITURE_DEFINITIONS.map((def) => ({
      ...def,
      specifications: def.specifications.map((s) => ({
        ...s,
        clearance: {
          front: { ...s.clearance.front },
          back: { ...s.clearance.back },
          left: { ...s.clearance.left },
          right: { ...s.clearance.right },
        },
      })),
      defaultSize: def.defaultSize ? { ...def.defaultSize } : undefined,
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

export function getFurnitureSpecificationById(
  definition: FurnitureDefinition,
  specId: string,
): FurnitureSpecification | undefined {
  return definition.specifications.find((s) => s.id === specId);
}

export function getDefaultSpecification(
  definition: FurnitureDefinition,
): FurnitureSpecification {
  return definition.specifications[0];
}

export function getFurnitureSpecification(
  catalog: FurnitureCatalog,
  definitionId: string,
  specId: string,
): FurnitureSpecification | undefined {
  const def = getFurnitureDefinitionById(catalog, definitionId);
  if (!def) return undefined;
  return getFurnitureSpecificationById(def, specId);
}

export function resolveSpecificationDimensions(
  definition: FurnitureDefinition,
  specId?: string,
): { width: number; depth: number; height?: number } {
  if (specId) {
    const spec = getFurnitureSpecificationById(definition, specId);
    if (spec) {
      return {
        width: spec.width,
        depth: spec.depth,
        height: spec.height,
      };
    }
  }

  if (definition.specifications.length > 0) {
    const defaultSpec = getDefaultSpecification(definition);
    return {
      width: defaultSpec.width,
      depth: defaultSpec.depth,
      height: defaultSpec.height,
    };
  }

  if (definition.defaultSize) {
    return {
      width: definition.defaultSize.width,
      depth: definition.defaultSize.depth,
      height: definition.defaultSize.height,
    };
  }

  return { width: 1000, depth: 1000 };
}

/**
 * Adapter: converts legacy FurnitureDefinitionV1 into target FurnitureDefinition v2 (AC-4, Contract Sec 7).
 */
export function adaptLegacyFurnitureDefinition(
  legacy: FurnitureDefinitionV1,
): FurnitureDefinition {
  const frontMin = legacy.clearanceRules?.front ?? legacy.clearanceRules?.all ?? 0;
  const backMin = legacy.clearanceRules?.back ?? legacy.clearanceRules?.all ?? 0;
  const leftMin = legacy.clearanceRules?.left ?? legacy.clearanceRules?.all ?? 0;
  const rightMin = legacy.clearanceRules?.right ?? legacy.clearanceRules?.all ?? 0;

  const defaultSpec: FurnitureSpecification = {
    id: `${legacy.id}-default`,
    name: `${legacy.defaultSize.width} × ${legacy.defaultSize.depth} mm`,
    width: legacy.defaultSize.width,
    depth: legacy.defaultSize.depth,
    height: legacy.defaultSize.height,
    clearance: {
      front: { minimum: frontMin, recommended: Math.max(frontMin, frontMin + 200) },
      back: { minimum: backMin, recommended: Math.max(backMin, backMin + 100) },
      left: { minimum: leftMin, recommended: Math.max(leftMin, leftMin + 150) },
      right: { minimum: rightMin, recommended: Math.max(rightMin, rightMin + 150) },
    },
  };

  return {
    id: legacy.id,
    name: legacy.name,
    category: legacy.category,
    specifications: [defaultSpec],
    defaultSize: { ...legacy.defaultSize },
    allowedSizeRanges: legacy.allowedSizeRanges ? { ...legacy.allowedSizeRanges } : undefined,
    clearanceRules: legacy.clearanceRules ? { ...legacy.clearanceRules } : undefined,
  };
}

/**
 * Adapter: converts legacy FurnitureCatalogV1 into target FurnitureCatalog v2.
 */
export function adaptLegacyFurnitureCatalog(
  legacy: FurnitureCatalogV1,
): FurnitureCatalog {
  return {
    version: 2,
    unit: "mm",
    definitions: legacy.definitions.map((def) => adaptLegacyFurnitureDefinition(def)),
  };
}

/**
 * Adapter: converts target FurnitureDefinition v2 into legacy FurnitureDefinitionV1.
 */
export function furnitureDefinitionToLegacy(
  def: FurnitureDefinition,
): FurnitureDefinitionV1 {
  const primarySpec = def.specifications[0];
  const defaultWidth = def.defaultSize?.width ?? primarySpec?.width ?? 1000;
  const defaultDepth = def.defaultSize?.depth ?? primarySpec?.depth ?? 1000;
  const defaultHeight = def.defaultSize?.height ?? primarySpec?.height;

  const clearanceRules = def.clearanceRules ?? (primarySpec
    ? {
        front: primarySpec.clearance.front.minimum,
        back: primarySpec.clearance.back.minimum,
        left: primarySpec.clearance.left.minimum,
        right: primarySpec.clearance.right.minimum,
      }
    : undefined);

  return {
    id: def.id,
    name: def.name,
    category: def.category,
    defaultSize: {
      width: defaultWidth,
      depth: defaultDepth,
      ...(defaultHeight !== undefined ? { height: defaultHeight } : {}),
    },
    allowedSizeRanges: def.allowedSizeRanges ? { ...def.allowedSizeRanges } : undefined,
    clearanceRules,
  };
}

/**
 * Adapter: converts target FurnitureCatalog v2 into legacy FurnitureCatalogV1.
 */
export function furnitureCatalogToLegacy(
  catalog: FurnitureCatalog,
): FurnitureCatalogV1 {
  return {
    version: 1,
    unit: "mm",
    definitions: catalog.definitions.map(furnitureDefinitionToLegacy),
  };
}
