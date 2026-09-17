"use client";

import * as React from "react";
import {
  Compass,
  Home,
  Layers,
  PanelLeft,
  PanelRight,
  SlidersHorizontal,
} from "lucide-react";
import { ToolPageChrome } from "@/components/tool-page-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardScrollArea,
  CardTitle,
} from "@/components/ui/card";
import { getStandardPlans, type StandardPlanSummary } from "@/lib/floor-plan/catalog";
import type { SelectedEntity } from "./types";
import { FloorPlanCatalog } from "./floor-plan-catalog";
import { FloorPlanInspector } from "./floor-plan-inspector";
import { FloorPlanSvgViewer } from "./floor-plan-svg-viewer";

interface FloorPlanShellProps {
  initialPlans?: StandardPlanSummary[];
}

export function FloorPlanShell({ initialPlans }: FloorPlanShellProps) {
  const plans = React.useMemo(() => initialPlans ?? getStandardPlans(), [initialPlans]);
  const [activePlanId, setActivePlanId] = React.useState<string>(
    plans[0]?.id ?? "plan-std-2br-01",
  );
  const [selectedEntity, setSelectedEntity] = React.useState<SelectedEntity | null>(null);

  // Mobile navigation tabs: "catalog" | "canvas" | "inspector"
  const [mobileTab, setMobileTab] = React.useState<"catalog" | "canvas" | "inspector">("canvas");

  const activePlanSummary = React.useMemo(
    () => plans.find((p) => p.id === activePlanId) ?? plans[0],
    [plans, activePlanId],
  );

  const handleSelectPlan = React.useCallback((planId: string) => {
    setActivePlanId(planId);
    setSelectedEntity(null);
    setMobileTab("canvas");
  }, []);

  const handleSelectEntity = React.useCallback((entity: SelectedEntity | null) => {
    setSelectedEntity(entity);
    if (entity) {
      setMobileTab("inspector");
    }
  }, []);

  if (!activePlanSummary) {
    return null;
  }

  const headerActions = (
    <div className="flex items-center gap-2">
      <Badge
        variant="secondary"
        className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1"
      >
        <Home className="h-3.5 w-3.5 text-primary" />
        <span>{activePlanSummary.name}</span>
        <span className="text-muted-foreground">({activePlanSummary.formattedArea})</span>
      </Badge>

      {/* Mobile view toggle buttons */}
      <div className="flex items-center rounded-lg border border-border bg-card p-0.5 lg:hidden">
        <Button
          type="button"
          size="sm"
          variant={mobileTab === "catalog" ? "default" : "ghost"}
          onClick={() => setMobileTab("catalog")}
          className="h-7 px-2 text-xs"
        >
          Catalog
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mobileTab === "canvas" ? "default" : "ghost"}
          onClick={() => setMobileTab("canvas")}
          className="h-7 px-2 text-xs"
        >
          Plan
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mobileTab === "inspector" ? "default" : "ghost"}
          onClick={() => setMobileTab("inspector")}
          className="h-7 px-2 text-xs"
        >
          Details
        </Button>
      </div>
    </div>
  );

  return (
    <ToolPageChrome
      title="Floor Plan Space Validator"
      description="Browse standard plans in responsive SVG viewer, verify room boundaries, openings, and furniture dimensions."
      actions={headerActions}
    >
      {/* 3-Pane Desktop Layout, Responsive Mobile Layout */}
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[19rem_minmax(0,1fr)_18rem] lg:items-stretch">
        {/* Left Pane: Standard Plans Catalog */}
        <aside
          className={`min-h-0 flex-col lg:flex ${
            mobileTab === "catalog" ? "flex flex-1" : "hidden"
          }`}
        >
          <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <CardHeader className="shrink-0 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Compass className="h-4 w-4 text-primary" />
                  <span>Standard Plans</span>
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {plans.length} approved
                </Badge>
              </div>
            </CardHeader>
            <CardScrollArea className="min-h-0 flex-1 px-4 pb-4">
              <FloorPlanCatalog
                plans={plans}
                activePlanId={activePlanId}
                onSelectPlan={handleSelectPlan}
              />
            </CardScrollArea>
          </Card>
        </aside>

        {/* Center Pane: Interactive Responsive SVG Viewer Canvas */}
        <section
          className={`min-h-0 flex-col lg:flex ${
            mobileTab === "canvas" ? "flex flex-1" : "hidden"
          }`}
        >
          <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border-border bg-card p-0">
            <FloorPlanSvgViewer
              plan={activePlanSummary.plan}
              selectedEntity={selectedEntity}
              onSelect={handleSelectEntity}
              className="flex-1"
            />
          </Card>
        </section>

        {/* Right Pane: Entity Inspector / Plan Details */}
        <aside
          className={`min-h-0 flex-col lg:flex ${
            mobileTab === "inspector" ? "flex flex-1" : "hidden"
          }`}
        >
          <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <CardHeader className="shrink-0 pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span>Spatial Inspector</span>
              </CardTitle>
            </CardHeader>
            <CardScrollArea className="min-h-0 flex-1 px-4 pb-4">
              <FloorPlanInspector
                plan={activePlanSummary.plan}
                selectedEntity={selectedEntity}
                onSelect={handleSelectEntity}
              />
            </CardScrollArea>
          </Card>
        </aside>
      </div>
    </ToolPageChrome>
  );
}
