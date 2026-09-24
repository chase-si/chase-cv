"use client";

import * as React from "react";
import { Armchair, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CandidatePlanPreview } from "./candidate-plan-preview";
import { FurnitureAssetPreview } from "./furniture-asset-preview";

export type FloorPlanLabMode = "candidate-plan" | "furniture-asset";

export interface FloorPlanLabWorkspaceProps {
  locale?: string;
  initialMode?: FloorPlanLabMode;
}

export function FloorPlanLabWorkspace({
  locale = "zh",
  initialMode = "candidate-plan",
}: FloorPlanLabWorkspaceProps) {
  const isZh = locale === "zh";
  const [mode, setMode] = React.useState<FloorPlanLabMode>(initialMode);

  const modeSwitcher = (
    <div
      data-testid="floor-plan-lab-mode-switcher"
      className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5"
    >
      <Button
        type="button"
        size="xs"
        variant={mode === "candidate-plan" ? "default" : "ghost"}
        data-testid="lab-mode-candidate-plan"
        onClick={() => setMode("candidate-plan")}
        className="gap-1.5 text-xs font-medium"
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        <span>{isZh ? "候选户型预览" : "Candidate Plan Preview"}</span>
      </Button>
      <Button
        type="button"
        size="xs"
        variant={mode === "furniture-asset" ? "default" : "ghost"}
        data-testid="lab-mode-furniture-asset"
        onClick={() => setMode("furniture-asset")}
        className="gap-1.5 text-xs font-medium"
      >
        <Armchair className="h-3.5 w-3.5" />
        <span>{isZh ? "家具规格预览" : "Furniture Asset Preview"}</span>
      </Button>
    </div>
  );

  if (mode === "furniture-asset") {
    return (
      <FurnitureAssetPreview locale={locale} headerExtra={modeSwitcher} />
    );
  }

  return (
    <CandidatePlanPreview locale={locale} headerExtra={modeSwitcher} />
  );
}
