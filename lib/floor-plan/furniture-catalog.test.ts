import { describe, expect, it } from "vitest";
import {
  ALL_FURNITURE_CATEGORIES,
  getDefaultFurnitureCatalog,
  getFurnitureCategories,
  getFurnitureDefinitionById,
  getFurnitureDefinitionsByCategory,
  STANDARD_FURNITURE_CATALOG,
  STANDARD_FURNITURE_DEFINITIONS,
} from "./furniture-catalog";
import { validateFurnitureCatalog } from "./validators";

describe("Furniture Catalog (US-10, AC-10)", () => {
  it("STANDARD_FURNITURE_CATALOG passes strict contract validation", () => {
    const res = validateFurnitureCatalog(STANDARD_FURNITURE_CATALOG);
    expect(res.ok).toBe(true);
  });

  it("covers all required categories (bed, sofa, table, chair, storage, desk, tv_stand)", () => {
    const required = ["bed", "sofa", "table", "chair", "storage", "desk", "tv_stand"];
    const existingCategories = new Set(
      STANDARD_FURNITURE_DEFINITIONS.map((def) => def.category),
    );

    for (const cat of required) {
      expect(existingCategories.has(cat as any)).toBe(true);
    }
  });

  it("getDefaultFurnitureCatalog returns deep clone copies", () => {
    const cat1 = getDefaultFurnitureCatalog();
    const cat2 = getDefaultFurnitureCatalog();
    expect(cat1).not.toBe(cat2);
    expect(cat1.definitions).not.toBe(cat2.definitions);
    expect(cat1.definitions[0]).not.toBe(cat2.definitions[0]);
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
});
