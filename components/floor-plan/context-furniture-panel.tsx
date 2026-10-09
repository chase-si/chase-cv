"use client";

import * as React from "react";
import {
  Bed,
  LayoutGrid,
  Plus,
  SlidersHorizontal,
  Sofa,
  Table2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getDefaultFurnitureCatalog,
} from "@/lib/floor-plan/furniture-catalog";
import { useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import type {
  FloorPlan,
  FurnitureCatalog,
  FurnitureDefinition,
  Room,
} from "@/lib/floor-plan/types";
import { cn } from "@/lib/utils";

export interface ContextFurniturePanelProps {
  plan: FloorPlan;
  targetRoomId: string | null;
  catalog?: FurnitureCatalog;
  onAddFurniture: (definitionId: string, specificationId?: string) => void;
  onOpenFullCatalog: () => void;
  locale?: string;
  className?: string;
}

export function ContextFurniturePanel({
  plan,
  targetRoomId,
  catalog: propCatalog,
  onAddFurniture,
  onOpenFullCatalog,
  locale,
  className = "",
}: ContextFurniturePanelProps) {
  const i18n = useFloorPlanI18n(locale);
  const t = i18n.t;
  const cfT = t.contextFurniture;

  const catalog = React.useMemo(
    () => propCatalog ?? getDefaultFurnitureCatalog(),
    [propCatalog],
  );

  const [selectedSpecs, setSelectedSpecs] = React.useState<Record<string, string>>({});

  const targetRoom = React.useMemo<Room | null>(() => {
    if (!targetRoomId) return null;
    return plan.rooms.find((r) => r.id === targetRoomId) ?? null;
  }, [plan.rooms, targetRoomId]);

  // Determine recommended furniture category based on target room type (AC-10, AC-11)
  const { category, sectionTitle, icon } = React.useMemo<{
    category: "bed" | "sofa" | "table" | "desk" | "all";
    sectionTitle: string;
    icon: React.ReactNode;
  }>(() => {
    if (!targetRoom) {
      return {
        category: "all",
        sectionTitle: cfT.recommendedTitle,
        icon: <LayoutGrid className="h-4 w-4 text-primary" />,
      };
    }

    switch (targetRoom.type) {
      case "bedroom":
      case "master_bedroom":
        return {
          category: "bed",
          sectionTitle: cfT.recommendedBeds,
          icon: <Bed className="h-4 w-4 text-primary" />,
        };
      case "living_room":
        return {
          category: "sofa",
          sectionTitle: cfT.recommendedSofas,
          icon: <Sofa className="h-4 w-4 text-primary" />,
        };
      case "dining_room":
        return {
          category: "table",
          sectionTitle: cfT.recommendedTables,
          icon: <Table2 className="h-4 w-4 text-primary" />,
        };
      case "study":
        return {
          category: "desk",
          sectionTitle: cfT.recommendedDesks,
          icon: <SlidersHorizontal className="h-4 w-4 text-primary" />,
        };
      default:
        return {
          category: "all",
          sectionTitle: cfT.recommendedTitle,
          icon: <LayoutGrid className="h-4 w-4 text-primary" />,
        };
    }
  }, [targetRoom, cfT]);

  // Filter definitions for context recommendations
  const recommendedDefinitions = React.useMemo<FurnitureDefinition[]>(() => {
    if (category === "all") {
      return catalog.definitions.slice(0, 4);
    }
    return catalog.definitions.filter((def) => def.category === category);
  }, [catalog.definitions, category]);

  const targetRoomName = targetRoom
    ? targetRoom.name ??
      (locale === "zh"
        ? i18n.getRoomTypeLabel(targetRoom.type)
        : targetRoom.type.replace("_", " "))
    : null;

  return (
    <div
      data-testid="context-furniture-panel"
      className={cn("space-y-3 text-xs", className)}
    >
      {/* Recommendation Header */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-semibold text-foreground text-xs">
              {sectionTitle}
            </span>
          </div>
          {targetRoomName && (
            <Badge variant="outline" className="text-[10px] font-medium border-primary/40 text-primary">
              {targetRoomName}
            </Badge>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {cfT.promptText}
        </p>
      </div>

      {/* Recommended Furniture Items (AC-4, AC-10, AC-11) */}
      <div className="space-y-2">
        {recommendedDefinitions.map((def) => {
          const defaultSpec = def.specifications?.[0];
          const activeSpecId = selectedSpecs[def.id] ?? defaultSpec?.id;
          const activeSpec =
            def.specifications?.find((s) => s.id === activeSpecId) ?? defaultSpec;
          const width = activeSpec?.width ?? 0;
          const depth = activeSpec?.depth ?? 0;
          const localizedName = i18n.getFurnitureName(def.id, def.name);

          return (
            <Card
              key={def.id}
              data-testid={`recommended-furniture-${def.id}`}
              className="overflow-hidden border-border bg-card p-3 transition-colors hover:border-primary/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground text-xs truncate">
                      {localizedName}
                    </span>
                    <Badge
                      variant="secondary"
                      className="font-mono text-[9px] uppercase px-1.5 py-0"
                    >
                      {i18n.getFurnitureCategoryLabel(def.category)}
                    </Badge>
                  </div>
                  <div
                    data-testid={`furniture-default-size-${def.id}`}
                    className="font-mono text-[11px] text-muted-foreground"
                  >
                    <span>{cfT.defaultDimensions}: </span>
                    <strong className="text-foreground">{width} × {depth} mm</strong>
                  </div>
                  {def.specifications && def.specifications.length > 0 && (
                    <div
                      data-testid={`context-spec-list-${def.id}`}
                      className="flex flex-wrap items-center gap-1 pt-0.5"
                    >
                      {def.specifications.map((spec) => {
                        const isSelected = activeSpec?.id === spec.id;
                        return (
                          <Button
                            key={spec.id}
                            type="button"
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            data-testid={`context-spec-option-${spec.id}`}
                            data-selected={isSelected ? "true" : "false"}
                            aria-pressed={isSelected}
                            aria-label={
                              locale === "zh"
                                ? `选择 ${localizedName} 规格 ${spec.name}`
                                : `Select ${localizedName} specification ${spec.name}`
                            }
                            onClick={() =>
                              setSelectedSpecs((prev) => ({
                                ...prev,
                                [def.id]: spec.id,
                              }))
                            }
                            className="min-h-11 min-w-11 lg:h-6 lg:min-h-0 lg:min-w-0 px-2 text-[10px] font-mono touch-manipulation focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                          >
                            {spec.name}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  data-testid={`add-context-furniture-${def.id}`}
                  aria-label={`${cfT.addBtn} ${localizedName}`}
                  onClick={() => {
                    if (activeSpecId && activeSpecId !== defaultSpec?.id) {
                      onAddFurniture(def.id, activeSpecId);
                    } else {
                      onAddFurniture(def.id);
                    }
                  }}
                  className="h-11 min-h-11 min-w-11 sm:h-8 sm:min-h-0 px-3 text-xs font-medium gap-1 shrink-0 touch-manipulation shadow-xs focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{cfT.addBtn}</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Entry to full furniture catalog (AC-12) */}
      <div className="pt-2 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-testid="browse-full-catalog-btn"
          onClick={onOpenFullCatalog}
          className="w-full text-xs font-medium gap-1.5 h-11 min-h-[44px] sm:h-9 sm:min-h-0 touch-manipulation focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <LayoutGrid className="h-3.5 w-3.5 text-primary" />
          <span>{cfT.browseFullCatalog}</span>
        </Button>
      </div>
    </div>
  );
}
