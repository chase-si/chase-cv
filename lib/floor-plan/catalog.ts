import { STANDARD_FLOOR_PLANS } from "./fixtures/standard-plans";
import { computePlanTotalArea } from "./geometry";
import type { StandardFloorPlan } from "./types";

export interface StandardPlanSummary {
  id: string;
  name: string;
  description: string;
  areaM2: number;
  formattedArea: string;
  roomCount: number;
  roomBreakdown: string;
  tags: string[];
  plan: StandardFloorPlan;
}

const ROOM_TYPE_LABELS: Record<string, string> = {
  living_room: "Living Room",
  bedroom: "Bedroom",
  master_bedroom: "Master Suite",
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  balcony: "Balcony",
  dining_room: "Dining Room",
  study: "Study",
  hallway: "Hallway",
  storage: "Storage",
  other: "Other",
};

function formatRoomBreakdown(plan: StandardFloorPlan): string {
  const counts: Record<string, number> = {};
  for (const r of plan.rooms) {
    counts[r.type] = (counts[r.type] ?? 0) + 1;
  }

  const parts = Object.entries(counts).map(([type, count]) => {
    const label = ROOM_TYPE_LABELS[type] ?? type;
    return `${count} ${label.toLowerCase()}`;
  });

  return `${plan.rooms.length} ${plan.rooms.length === 1 ? "room" : "rooms"} (${parts.join(", ")})`;
}

const PLAN_TAGS: Record<string, string[]> = {
  "plan-std-2br-01": ["Nordic", "2-Room", "Standard"],
  "plan-std-studio-01": ["Studio", "Compact", "Open Plan"],
  "plan-std-3br-01": ["Family", "3-Room", "Spacious"],
};

export function resolvePlanTags(plan: StandardFloorPlan): string[] {
  const id = (plan.meta.id ?? "").toLowerCase();
  if (PLAN_TAGS[id]) {
    return PLAN_TAGS[id];
  }

  const tags: string[] = [];
  if (id.includes("studio")) {
    tags.push("Studio", "Compact", "Open Plan");
  } else if (id.includes("1b1l")) {
    tags.push("1-Bedroom", "Couples", "Standard");
  } else if (id.includes("2b1l")) {
    tags.push("2-Bedroom", "Single-Bath", "Starter");
  } else if (id.includes("2b2l")) {
    tags.push("2-Bedroom", "Double-Living", "Balanced");
  } else if (id.includes("3b1l")) {
    tags.push("3-Bedroom", "Family", "Practical");
  } else if (id.includes("3b2l")) {
    tags.push("3-Bedroom", "Double-Bath", "Comfort");
  } else if (id.includes("4b2l")) {
    tags.push("4-Bedroom", "Multi-Gen", "Spacious");
  } else if (id.includes("5b2l")) {
    tags.push("5-Bedroom", "Penthouse", "Luxury");
  } else {
    tags.push("Standard");
  }

  return tags;
}

export function buildStandardPlanSummary(plan: StandardFloorPlan): StandardPlanSummary {
  const id = plan.meta.id ?? plan.meta.name;
  const areaResult = computePlanTotalArea(plan);
  const tags = resolvePlanTags(plan);

  return {
    id,
    name: plan.meta.name,
    description: plan.meta.description ?? "",
    areaM2: areaResult.areaM2,
    formattedArea: areaResult.formattedAreaM2,
    roomCount: plan.rooms.length,
    roomBreakdown: formatRoomBreakdown(plan),
    tags,
    plan,
  };
}

export function getStandardPlans(): StandardPlanSummary[] {
  return STANDARD_FLOOR_PLANS.map(buildStandardPlanSummary);
}

export function getStandardPlanById(id: string): StandardPlanSummary | undefined {
  const all = getStandardPlans();
  return all.find((p) => p.id === id);
}
