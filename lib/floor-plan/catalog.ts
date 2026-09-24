import { FLOOR_PLAN_CATALOG_DATA } from "./catalog-data";
import { computePlanTotalArea } from "./geometry";
import type { StandardFloorPlan } from "./types";

export type FloorPlanCategoryKey =
  | "all"
  | "studio"
  | "1b1l"
  | "2b1l"
  | "2b2l"
  | "3b1l"
  | "3b2l"
  | "4b_plus";

export interface FloorPlanCategoryOption {
  key: FloorPlanCategoryKey;
  labelZh: string;
  labelEn: string;
}

export const FLOOR_PLAN_CATEGORIES: FloorPlanCategoryOption[] = [
  { key: "all", labelZh: "全部", labelEn: "All" },
  { key: "studio", labelZh: "开间", labelEn: "Studio" },
  { key: "1b1l", labelZh: "一室一厅", labelEn: "1B1L" },
  { key: "2b1l", labelZh: "两室一厅", labelEn: "2B1L" },
  { key: "2b2l", labelZh: "两室两厅", labelEn: "2B2L" },
  { key: "3b1l", labelZh: "三室一厅", labelEn: "3B1L" },
  { key: "3b2l", labelZh: "三室两厅", labelEn: "3B2L" },
  { key: "4b_plus", labelZh: "四室及以上", labelEn: "4B+" },
];

export interface StandardPlanSummary {
  id: string;
  name: string;
  description: string;
  areaM2: number;
  formattedArea: string;
  roomCount: number;
  roomBreakdown: string;
  tags: string[];
  categoryKey: FloorPlanCategoryKey;
  plan: StandardFloorPlan;
}

import { getFloorPlanI18n } from "./i18n";

export function formatRoomBreakdown(plan: StandardFloorPlan, locale?: string): string {
  const i18n = getFloorPlanI18n(locale);
  return i18n.formatRoomBreakdown(plan);
}

function countBedrooms(plan: StandardFloorPlan): number {
  return plan.rooms.filter(
    (r) => r.type === "bedroom" || r.type === "master_bedroom",
  ).length;
}

function countLivingAreas(plan: StandardFloorPlan): number {
  return plan.rooms.filter(
    (r) => r.type === "living_room" || r.type === "dining_room",
  ).length;
}

/** Parse `1br` / `2br0` / `3br` style tokens from realistic Chinese plan IDs. */
function parseBrToken(id: string): { bedrooms: number; livingHint: number | null } | null {
  const match = id.match(/(?:^|-)(\d)br(0?)(?:-|$)/i);
  if (!match) return null;
  const bedrooms = Number(match[1]);
  const livingHint = match[2] === "0" ? 0 : null;
  return { bedrooms, livingHint };
}

function categoryFromCounts(
  bedroomCount: number,
  livingCount: number,
): FloorPlanCategoryKey {
  if (bedroomCount === 0 || (bedroomCount === 1 && livingCount === 0)) return "studio";
  if (bedroomCount === 1) return "1b1l";
  if (bedroomCount === 2) return livingCount >= 2 ? "2b2l" : "2b1l";
  if (bedroomCount === 3) return livingCount >= 2 ? "3b2l" : "3b1l";
  return "4b_plus";
}

function tagFromCounts(
  bedroomCount: number,
  livingCount: number,
  isZh: boolean,
): string[] {
  if (bedroomCount === 0 || (bedroomCount === 1 && livingCount === 0)) {
    return [isZh ? "开间" : "Studio"];
  }
  if (bedroomCount === 1) return [isZh ? "一室一厅" : "1B1L"];
  if (bedroomCount === 2) {
    return livingCount >= 2
      ? [isZh ? "两室两厅" : "2B2L"]
      : [isZh ? "两室一厅" : "2B1L"];
  }
  if (bedroomCount === 3) {
    return livingCount >= 2
      ? [isZh ? "三室两厅" : "3B2L"]
      : [isZh ? "三室一厅" : "3B1L"];
  }
  if (bedroomCount === 4) return [isZh ? "四室两厅" : "4B2L"];
  if (bedroomCount === 5) return [isZh ? "五室两厅" : "5B2L"];
  return [isZh ? "四室及以上" : "4B+"];
}

export function resolvePlanCategory(plan: StandardFloorPlan): FloorPlanCategoryKey {
  const id = (plan.meta.id ?? "").toLowerCase();
  if (id.includes("studio")) return "studio";
  if (id.includes("1b1l")) return "1b1l";
  if (id.includes("2b1l")) return "2b1l";
  if (id.includes("2b2l")) return "2b2l";
  if (id.includes("3b1l")) return "3b1l";
  if (id.includes("3b2l")) return "3b2l";
  if (id.includes("4b2l") || id.includes("5b2l")) return "4b_plus";

  const br = parseBrToken(id);
  const bedroomCount = br?.bedrooms ?? countBedrooms(plan);
  const livingCount =
    br?.livingHint !== null && br?.livingHint !== undefined
      ? br.livingHint
      : countLivingAreas(plan);

  return categoryFromCounts(bedroomCount, livingCount);
}

export function resolvePlanTags(plan: StandardFloorPlan, locale?: string): string[] {
  const id = (plan.meta.id ?? "").toLowerCase();
  const isZh = locale === "zh" || (typeof window !== "undefined" && window.location.pathname.startsWith("/zh"));

  if (id.includes("studio")) {
    return [isZh ? "开间" : "Studio"];
  }
  if (id.includes("1b1l")) {
    return [isZh ? "一室一厅" : "1B1L"];
  }
  if (id.includes("2b1l")) {
    return [isZh ? "两室一厅" : "2B1L"];
  }
  if (id.includes("2b2l")) {
    return [isZh ? "两室两厅" : "2B2L"];
  }
  if (id.includes("3b1l")) {
    return [isZh ? "三室一厅" : "3B1L"];
  }
  if (id.includes("3b2l")) {
    return [isZh ? "三室两厅" : "3B2L"];
  }
  if (id.includes("4b2l")) {
    return [isZh ? "四室两厅" : "4B2L"];
  }
  if (id.includes("5b2l")) {
    return [isZh ? "五室两厅" : "5B2L"];
  }

  const br = parseBrToken(id);
  const bedroomCount = br?.bedrooms ?? countBedrooms(plan);
  const livingCount =
    br?.livingHint !== null && br?.livingHint !== undefined
      ? br.livingHint
      : countLivingAreas(plan);

  return tagFromCounts(bedroomCount, livingCount, isZh);
}

export function buildStandardPlanSummary(plan: StandardFloorPlan, locale?: string): StandardPlanSummary {
  const id = plan.meta.id ?? plan.meta.name;
  const areaResult = computePlanTotalArea(plan);
  const i18n = getFloorPlanI18n(locale);
  const tags = resolvePlanTags(plan, i18n.locale);
  const categoryKey = resolvePlanCategory(plan);

  return {
    id,
    name: i18n.getPlanName(id, plan.meta.name),
    description: i18n.getPlanDescription(id, plan.meta.description ?? ""),
    areaM2: areaResult.areaM2,
    formattedArea: areaResult.formattedAreaM2,
    roomCount: plan.rooms.length,
    roomBreakdown: i18n.formatRoomBreakdown(plan),
    tags,
    categoryKey,
    plan,
  };
}

import { validateCandidateFloorPlan } from "./validators";
import type { ValidationError, ValidationResult } from "./types";

export interface CatalogAssetValidationFailure {
  planId: string;
  planName: string;
  errors: ValidationError[];
}

export function validateStandardPlanCatalog(
  plans: readonly StandardFloorPlan[] = FLOOR_PLAN_CATALOG_DATA,
): ValidationResult<readonly StandardFloorPlan[]> & {
  failures?: CatalogAssetValidationFailure[];
} {
  const allErrors: ValidationError[] = [];
  const failures: CatalogAssetValidationFailure[] = [];

  plans.forEach((plan, index) => {
    const planId = plan?.meta?.id || plan?.meta?.name || `plan[${index}]`;
    const planName = plan?.meta?.name || planId;
    const res = validateCandidateFloorPlan(plan);
    if (!res.ok) {
      failures.push({
        planId,
        planName,
        errors: res.errors,
      });
      for (const err of res.errors) {
        allErrors.push({
          path: err.path ? `${planId}.${err.path}` : planId,
          message: `[${planId}] ${err.message}`,
          code: err.code,
        });
      }
    }
  });

  if (allErrors.length > 0) {
    return {
      ok: false,
      errors: allErrors,
      failures,
    };
  }

  return {
    ok: true,
    value: plans,
  };
}

let defaultCatalogValidated = false;

export function assertValidStandardPlanCatalog(
  plans: readonly StandardFloorPlan[] = FLOOR_PLAN_CATALOG_DATA,
): void {
  if (plans === FLOOR_PLAN_CATALOG_DATA && defaultCatalogValidated) {
    return;
  }

  const result = validateStandardPlanCatalog(plans);
  if (!result.ok) {
    const details = result.errors
      .map((e) => `${e.path}: ${e.message}`)
      .join("; ");
    throw new Error(
      `Standard floor plan catalog validation failed: ${details}`,
    );
  }

  if (plans === FLOOR_PLAN_CATALOG_DATA) {
    defaultCatalogValidated = true;
  }
}

export function getStandardPlans(
  locale?: string,
  plansData: readonly StandardFloorPlan[] = FLOOR_PLAN_CATALOG_DATA,
): StandardPlanSummary[] {
  assertValidStandardPlanCatalog(plansData);
  return plansData.map((p) => buildStandardPlanSummary(p, locale));
}

export function getStandardPlanById(
  id: string,
  locale?: string,
  plansData: readonly StandardFloorPlan[] = FLOOR_PLAN_CATALOG_DATA,
): StandardPlanSummary | undefined {
  const all = getStandardPlans(locale, plansData);
  return all.find((p) => p.id === id);
}
