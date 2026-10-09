import { describe, expect, it } from "vitest";
import {
  getFloorPlanI18n,
  getFloorPlanLocale,
  ROOM_TYPE_LABELS_EN,
  ROOM_TYPE_LABELS_ZH,
  FURNITURE_CATEGORY_LABELS_ZH,
  FURNITURE_NAMES_ZH,
} from "./i18n";
import { STUDIO_STANDARD_FLOOR_PLAN } from "./fixtures/standard-plans";

describe("Floor Plan i18n module", () => {
  it("resolves locales correctly", () => {
    expect(getFloorPlanLocale("zh")).toBe("zh");
    expect(getFloorPlanLocale("zh-CN")).toBe("zh");
    expect(getFloorPlanLocale("ZH")).toBe("zh");
    expect(getFloorPlanLocale("en")).toBe("en");
    expect(getFloorPlanLocale("en-US")).toBe("en");
    expect(getFloorPlanLocale(undefined)).toBe("en");
  });

  it("provides Chinese translations and helper labels", () => {
    const zh = getFloorPlanI18n("zh");
    expect(zh.locale).toBe("zh");
    expect(zh.t.pageTitle).toBe("我家适合买多大的床或沙发？");
    expect(zh.t.inspector.title).toBe("空间属性检查器");
    expect(zh.t.rules.title).toBe("空间规范审查");

    // Room type translation
    expect(zh.getRoomTypeLabel("living_room")).toBe("客厅");
    expect(zh.getRoomTypeLabel("bedroom")).toBe("卧室");
    expect(zh.getRoomTypeLabel("unknown_type")).toBe("unknown_type");

    // Furniture categories and names
    expect(zh.getFurnitureCategoryLabel("bed")).toBe("床具");
    expect(zh.getFurnitureCategoryLabel("sofa")).toBe("沙发");
    expect(zh.getFurnitureName("bed-double", "Double Bed")).toBe("双人床 (1.8m)");
    expect(zh.getFurnitureName("custom-item", "Custom Item")).toBe("Custom Item");

    // Plan tags & names
    expect(zh.getPlanName("floor-plan-std-studio-01", "Fallback")).toBe("现代简约单身开间 (24m²)");
    expect(zh.getPlanTag("Standard")).toBe("标准户型");
    expect(zh.getPlanTag("CustomTag")).toBe("CustomTag");

    // Spatial rules translation
    expect(zh.getRuleTitle("furniture-boundary", "Boundary")).toBe("房间边界越界");
    expect(zh.getRuleTitle("furniture-wall-collision", "Collision")).toBe("墙体结构穿插碰撞");
    expect(zh.getRuleTitle("furniture-overlap", "Overlap")).toBe("家具重叠冲突");
    expect(zh.getRuleTitle("opening-keep-clear", "Clear")).toBe("门窗开启通行净区受阻");
    expect(zh.getRuleTitle("furniture-clearance", "Clearance")).toBe("家具使用净距不足");
    expect(zh.getRuleTitle("passage-clearance", "Passage")).toBe("通道通行净宽不足");

    // Workflow stages translation
    expect(zh.t.workflow.steps.plan).toBe("户型");
    expect(zh.t.workflow.steps.room).toBe("房间");
    expect(zh.t.workflow.steps.furniture).toBe("家具");
    expect(zh.t.workflow.steps.decision).toBe("结论");
    expect(zh.t.workflow.actions.usePlan).toContain("使用这个户型");
  });

  it("provides English translations and fallback behavior", () => {
    const en = getFloorPlanI18n("en");
    expect(en.locale).toBe("en");
    expect(en.t.pageTitle).toBe("What size bed or sofa fits my home?");
    expect(en.t.workflow.steps.plan).toBe("Plan");
    expect(en.t.workflow.steps.room).toBe("Room");
    expect(en.t.workflow.steps.furniture).toBe("Furniture");
    expect(en.t.workflow.steps.decision).toBe("Decision");
    expect(en.t.workflow.actions.usePlan).toContain("Use this floor plan");
    expect(en.getRoomTypeLabel("living_room")).toBe("Living Room");
    expect(en.getFurnitureCategoryLabel("bed")).toBe("Beds");
    expect(en.getFurnitureName("bed-double", "Double Bed")).toBe("Double Bed");

    // Rule title falls back to provided title
    expect(en.getRuleTitle("furniture-boundary", "Boundary Violation")).toBe("Boundary Violation");

    const breakdown = en.formatRoomBreakdown(STUDIO_STANDARD_FLOOR_PLAN);
    expect(breakdown).toContain("rooms");
  });

  it("AC-25: guarantees complete zh and en dictionary keys and localized names for all standard furniture definitions", async () => {
    const { STANDARD_FURNITURE_DEFINITIONS } = await import("./furniture-catalog");
    const { FLOOR_PLAN_ZH, FLOOR_PLAN_EN, FURNITURE_NAMES_ZH, FURNITURE_NAMES_EN } = await import(
      "./i18n"
    );

    // Every standard furniture definition has non-empty Chinese and English localized names
    for (const def of STANDARD_FURNITURE_DEFINITIONS) {
      expect(FURNITURE_NAMES_ZH[def.id]).toBeTruthy();
      expect(FURNITURE_NAMES_EN[def.id]).toBeTruthy();
      expect(def.specifications.length).toBeGreaterThan(0);
      for (const spec of def.specifications) {
        expect(spec.name).toMatch(/\d+\s*×\s*\d+\s*mm/);
      }
    }

    // Recursively verify FLOOR_PLAN_ZH and FLOOR_PLAN_EN have identical keys and non-empty string values
    const collectEntries = (obj: Record<string, any>, prefix = ""): Array<[string, string]> => {
      const entries: Array<[string, string]> = [];
      for (const [k, v] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${k}` : k;
        if (typeof v === "string") {
          entries.push([path, v]);
        } else if (v && typeof v === "object") {
          entries.push(...collectEntries(v, path));
        }
      }
      return entries;
    };

    const zhEntries = collectEntries(FLOOR_PLAN_ZH);
    const enEntries = collectEntries(FLOOR_PLAN_EN);

    expect(zhEntries.map(([k]) => k)).toEqual(enEntries.map(([k]) => k));
    for (const [, val] of zhEntries) {
      expect(val.trim().length).toBeGreaterThan(0);
    }
    for (const [, val] of enEntries) {
      expect(val.trim().length).toBeGreaterThan(0);
    }
  });
});
