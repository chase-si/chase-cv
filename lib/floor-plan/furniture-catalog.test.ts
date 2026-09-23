import { describe, expect, it } from "vitest";
import {
  adaptLegacyFurnitureCatalog,
  adaptLegacyFurnitureDefinition,
  ALL_FURNITURE_CATEGORIES,
  furnitureCatalogToLegacy,
  furnitureDefinitionToLegacy,
  getDefaultFurnitureCatalog,
  getDefaultSpecification,
  getFurnitureCategories,
  getFurnitureDefinitionById,
  getFurnitureDefinitionsByCategory,
  getFurnitureSpecification,
  getFurnitureSpecificationById,
  resolveSpecificationDimensions,
  STANDARD_FURNITURE_CATALOG,
  STANDARD_FURNITURE_CATALOG_V2,
  STANDARD_FURNITURE_DEFINITIONS,
} from "./furniture-catalog";
import type { FurnitureDefinitionV1 } from "./types";
import {
  validateFurnitureCatalog,
  validateFurnitureDefinition,
} from "./validators";

describe("Furniture Catalog (AC-4, AC-19, AC-21)", () => {
  it("STANDARD_FURNITURE_CATALOG passes strict contract validation (AC-21)", () => {
    const res = validateFurnitureCatalog(STANDARD_FURNITURE_CATALOG);
    expect(res.ok, !res.ok ? JSON.stringify(res.errors) : undefined).toBe(true);
    if (res.ok) {
      expect(res.value.version).toBe(2);
      expect(res.value.unit).toBe("mm");
      expect(res.value.definitions.length).toBeGreaterThanOrEqual(12);
    }
  });

  it("STANDARD_FURNITURE_CATALOG_V2 is an alias of STANDARD_FURNITURE_CATALOG", () => {
    expect(STANDARD_FURNITURE_CATALOG_V2).toBe(STANDARD_FURNITURE_CATALOG);
  });

  it("all definitions in STANDARD_FURNITURE_DEFINITIONS pass validateFurnitureDefinition individually (AC-21)", () => {
    for (const def of STANDARD_FURNITURE_DEFINITIONS) {
      const res = validateFurnitureDefinition(def);
      expect(
        res.ok,
        `Definition '${def.id}' failed validation: ${!res.ok ? JSON.stringify(res.errors) : ""}`,
      ).toBe(true);
    }
  });

  it("verifies AC-4 contract: every definition has a list of predefined specifications with clearances", () => {
    for (const def of STANDARD_FURNITURE_DEFINITIONS) {
      expect(def.specifications.length).toBeGreaterThanOrEqual(1);

      for (const spec of def.specifications) {
        expect(spec.id).toBeTruthy();
        expect(spec.name).toBeTruthy();
        expect(spec.width).toBeGreaterThan(0);
        expect(spec.depth).toBeGreaterThan(0);

        const { front, back, left, right } = spec.clearance;
        expect(front.minimum).toBeGreaterThanOrEqual(0);
        expect(front.minimum).toBeLessThanOrEqual(front.recommended);
        expect(back.minimum).toBeGreaterThanOrEqual(0);
        expect(back.minimum).toBeLessThanOrEqual(back.recommended);
        expect(left.minimum).toBeGreaterThanOrEqual(0);
        expect(left.minimum).toBeLessThanOrEqual(left.recommended);
        expect(right.minimum).toBeGreaterThanOrEqual(0);
        expect(right.minimum).toBeLessThanOrEqual(right.recommended);
      }
    }
  });

  it("verifies orientation conventions: beds and sofas allow 0 mm back clearance against walls", () => {
    const doubleBed = getFurnitureDefinitionById(STANDARD_FURNITURE_CATALOG, "bed-double");
    expect(doubleBed).toBeDefined();
    for (const spec of doubleBed!.specifications) {
      expect(spec.clearance.back.minimum).toBe(0);
      expect(spec.clearance.front.minimum).toBeGreaterThan(0);
    }

    const sofa = getFurnitureDefinitionById(STANDARD_FURNITURE_CATALOG, "sofa-3seat");
    expect(sofa).toBeDefined();
    for (const spec of sofa!.specifications) {
      expect(spec.clearance.back.minimum).toBe(0);
      expect(spec.clearance.front.minimum).toBeGreaterThan(0);
    }
  });

  it("ensures all specification IDs are globally unique across the standard catalog (AC-19)", () => {
    const specIdSet = new Set<string>();
    for (const def of STANDARD_FURNITURE_DEFINITIONS) {
      for (const spec of def.specifications) {
        expect(specIdSet.has(spec.id), `Duplicate specification id '${spec.id}' found`).toBe(false);
        specIdSet.add(spec.id);
      }
    }
  });

  it("covers all required categories (bed, sofa, table, chair, storage, desk, tv_stand)", () => {
    const required = ["bed", "sofa", "table", "chair", "storage", "desk", "tv_stand"];
    const existingCategories = new Set(
      STANDARD_FURNITURE_DEFINITIONS.map((def) => def.category),
    );

    for (const cat of required) {
      expect(existingCategories.has(cat as any)).toBe(true);
    }
    expect(getFurnitureCategories()).toEqual(ALL_FURNITURE_CATEGORIES);
  });

  it("getDefaultFurnitureCatalog returns deep clone copies", () => {
    const cat1 = getDefaultFurnitureCatalog();
    const cat2 = getDefaultFurnitureCatalog();
    expect(cat1).not.toBe(cat2);
    expect(cat1.definitions).not.toBe(cat2.definitions);
    expect(cat1.definitions[0]).not.toBe(cat2.definitions[0]);
    expect(cat1.definitions[0].specifications).not.toBe(cat2.definitions[0].specifications);
    expect(cat1.definitions[0].specifications[0].clearance).not.toBe(
      cat2.definitions[0].specifications[0].clearance,
    );
  });

  it("finds definition by ID and returns undefined for unknown ID", () => {
    const catalog = getDefaultFurnitureCatalog();
    const bed = getFurnitureDefinitionById(catalog, "bed-double");
    expect(bed).toBeDefined();
    expect(bed?.category).toBe("bed");

    const unknown = getFurnitureDefinitionById(catalog, "unknown-id");
    expect(unknown).toBeUndefined();
  });

  it("filters definitions by category", () => {
    const catalog = getDefaultFurnitureCatalog();
    const beds = getFurnitureDefinitionsByCategory(catalog, "bed");
    expect(beds.length).toBeGreaterThanOrEqual(2);
    expect(beds.every((b) => b.category === "bed")).toBe(true);

    const chairs = getFurnitureDefinitionsByCategory(catalog, "chair");
    expect(chairs.length).toBeGreaterThanOrEqual(1);
    expect(chairs.every((c) => c.category === "chair")).toBe(true);
  });

  it("specification lookup and resolution helpers work accurately", () => {
    const catalog = getDefaultFurnitureCatalog();
    const bed = getFurnitureDefinitionById(catalog, "bed-double")!;
    expect(bed).toBeDefined();

    const spec1800 = getFurnitureSpecificationById(bed, "bed-double-1800");
    expect(spec1800).toBeDefined();
    expect(spec1800?.width).toBe(1800);
    expect(spec1800?.depth).toBe(2000);

    const defaultSpec = getDefaultSpecification(bed);
    expect(defaultSpec).toEqual(bed.specifications[0]);

    const directLookup = getFurnitureSpecification(catalog, "bed-double", "bed-double-1500");
    expect(directLookup).toBeDefined();
    expect(directLookup?.width).toBe(1500);

    const unknownLookup = getFurnitureSpecification(catalog, "bed-double", "non-existent");
    expect(unknownLookup).toBeUndefined();

    const unknownDef = getFurnitureSpecification(catalog, "non-existent", "bed-double-1800");
    expect(unknownDef).toBeUndefined();

    const resolved1500 = resolveSpecificationDimensions(bed, "bed-double-1500");
    expect(resolved1500).toEqual({ width: 1500, depth: 2000, height: 900 });

    const resolvedDefault = resolveSpecificationDimensions(bed);
    expect(resolvedDefault.width).toBe(bed.specifications[0].width);
  });

  describe("Compatibility Adapters (AC-4, Contract Sec 7)", () => {
    const legacyDefinition: FurnitureDefinitionV1 = {
      id: "legacy-sofa",
      name: "Legacy Custom Sofa",
      category: "sofa",
      defaultSize: { width: 1900, depth: 850, height: 800 },
      allowedSizeRanges: {
        width: { min: 1600, max: 2200, step: 100 },
      },
      clearanceRules: {
        front: 500,
        back: 50,
      },
    };

    it("adaptLegacyFurnitureDefinition creates valid FurnitureDefinition with specifications", () => {
      const adapted = adaptLegacyFurnitureDefinition(legacyDefinition);
      expect(adapted.id).toBe("legacy-sofa");
      expect(adapted.specifications.length).toBe(1);
      expect(adapted.specifications[0].width).toBe(1900);
      expect(adapted.specifications[0].depth).toBe(850);
      expect(adapted.specifications[0].clearance.front.minimum).toBe(500);
      expect(adapted.specifications[0].clearance.front.recommended).toBeGreaterThanOrEqual(500);

      // Validate through the official validator
      const res = validateFurnitureDefinition(adapted);
      expect(res.ok).toBe(true);
    });

    it("adaptLegacyFurnitureCatalog converts legacy v1 catalog into valid v2 catalog", () => {
      const legacyCatalog = {
        version: 1 as const,
        unit: "mm" as const,
        definitions: [legacyDefinition],
      };

      const adaptedCatalog = adaptLegacyFurnitureCatalog(legacyCatalog);
      expect(adaptedCatalog.version).toBe(2);
      expect(adaptedCatalog.unit).toBe("mm");
      expect(adaptedCatalog.definitions.length).toBe(1);

      const res = validateFurnitureCatalog(adaptedCatalog);
      expect(res.ok).toBe(true);
    });

    it("furnitureDefinitionToLegacy and furnitureCatalogToLegacy convert v2 back to v1", () => {
      const def = STANDARD_FURNITURE_DEFINITIONS[0];
      const legacy = furnitureDefinitionToLegacy(def);
      expect(legacy.id).toBe(def.id);
      expect(legacy.defaultSize.width).toBe(def.specifications[0].width);
      expect(legacy.defaultSize.depth).toBe(def.specifications[0].depth);

      const catalog = getDefaultFurnitureCatalog();
      const legacyCatalog = furnitureCatalogToLegacy(catalog);
      expect(legacyCatalog.version).toBe(1);
      expect(legacyCatalog.definitions.length).toBe(catalog.definitions.length);
    });
  });
});
