import { describe, expect, it } from "vitest";
import * as furnitureCatalogModule from "./furniture-catalog";
import {
  ALL_FURNITURE_CATEGORIES,
  getDefaultFurnitureCatalog,
  getDefaultSpecification,
  getFurnitureCatalog,
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
import * as floorPlanIndex from "./index";
import {
  validateFurnitureCatalog,
  validateFurnitureDefinition,
} from "./validators";

describe("Furniture Catalog v2 Contract (AC-4, AC-19, AC-21)", () => {
  it("STANDARD_FURNITURE_CATALOG passes strict v2 contract validation (AC-21)", () => {
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

  it("all definitions in STANDARD_FURNITURE_DEFINITIONS pass validateFurnitureDefinition individually and contain no legacy v1 fields (AC-4, AC-21)", () => {
    for (const def of STANDARD_FURNITURE_DEFINITIONS) {
      const res = validateFurnitureDefinition(def);
      expect(
        res.ok,
        `Definition '${def.id}' failed validation: ${!res.ok ? JSON.stringify(res.errors) : ""}`,
      ).toBe(true);
      expect("defaultSize" in def).toBe(false);
      expect("allowedSizeRanges" in def).toBe(false);
      expect("clearanceRules" in def).toBe(false);
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

  describe("V1 Compatibility Removal Contract Verification (AC-4, Issue #225)", () => {
    it("removes legacy v1 adapter functions from furniture-catalog and floor-plan barrel exports", () => {
      const removedExports = [
        "adaptLegacyFurnitureDefinition",
        "adaptLegacyFurnitureCatalog",
        "furnitureDefinitionToLegacy",
        "furnitureCatalogToLegacy",
      ];

      for (const name of removedExports) {
        expect(name in furnitureCatalogModule, `${name} must be removed from furniture-catalog`).toBe(false);
        expect(name in floorPlanIndex, `${name} must be removed from floor-plan index`).toBe(false);
      }
    });

    it("getFurnitureCatalog rejects legacy v1 catalog and definitions with defaultSize or allowedSizeRanges", () => {
      const v1Catalog = {
        version: 1,
        unit: "mm",
        definitions: [
          {
            id: "legacy-bed",
            name: "Legacy Bed",
            category: "bed",
            defaultSize: { width: 1800, depth: 2000 },
            allowedSizeRanges: {
              width: { min: 1500, max: 2000, step: 100 },
            },
          },
        ],
      };

      expect(() => getFurnitureCatalog(v1Catalog)).toThrow(/Invalid FurnitureCatalog/);
    });
  });
});
