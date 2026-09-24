"use client";

import * as React from "react";
import {
  Armchair,
  Bed,
  Box,
  Check,
  Monitor,
  Plus,
  Search,
  SlidersHorizontal,
  Sofa,
  Table2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ALL_FURNITURE_CATEGORIES,
  getDefaultFurnitureCatalog,
} from "@/lib/floor-plan/furniture-catalog";
import { addFurnitureInstance } from "@/lib/floor-plan/furniture-operations";
import { useFloorPlanI18n } from "@/lib/floor-plan/i18n";
import type {
  FloorPlan,
  FurnitureCatalog,
  FurnitureCategory,
  FurnitureDefinition,
} from "@/lib/floor-plan/types";
import { cn } from "@/lib/utils";
import type { SelectedEntity } from "./types";

interface FurnitureCatalogPaletteProps {
  locale?: string;
  plan: FloorPlan;
  catalog?: FurnitureCatalog;
  onUpdatePlan?: (updatedPlan: FloorPlan) => void;
  onSelect?: (entity: SelectedEntity | null) => void;
  onSelectDefinition?: (definitionId: string, specificationId?: string) => void;
  onClose?: () => void;
  className?: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  bed: <Bed className="h-3.5 w-3.5" />,
  sofa: <Sofa className="h-3.5 w-3.5" />,
  table: <Table2 className="h-3.5 w-3.5" />,
  chair: <Armchair className="h-3.5 w-3.5" />,
  storage: <Box className="h-3.5 w-3.5" />,
  desk: <SlidersHorizontal className="h-3.5 w-3.5" />,
  tv_stand: <Monitor className="h-3.5 w-3.5" />,
};

export function FurnitureCatalogPalette({
  locale,
  plan,
  catalog: propCatalog,
  onUpdatePlan,
  onSelect,
  onSelectDefinition,
  onClose,
  className = "",
}: FurnitureCatalogPaletteProps) {
  const i18n = useFloorPlanI18n(locale);
  const t = i18n.t.furniturePalette;

  const catalog = React.useMemo(
    () => propCatalog ?? getDefaultFurnitureCatalog(),
    [propCatalog],
  );

  const [selectedCategory, setSelectedCategory] = React.useState<
    FurnitureCategory | "all"
  >("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedSpecs, setSelectedSpecs] = React.useState<Record<string, string>>({});

  // Filter definitions based on category and search query (AC-10)
  const filteredDefinitions = React.useMemo(() => {
    return catalog.definitions.filter((def) => {
      if (selectedCategory !== "all" && def.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const localizedName = i18n.getFurnitureName(def.id, def.name).toLowerCase();
        const categoryLabel = i18n.getFurnitureCategoryLabel(def.category).toLowerCase();
        return (
          def.name.toLowerCase().includes(q) ||
          localizedName.includes(q) ||
          def.id.toLowerCase().includes(q) ||
          def.category.toLowerCase().includes(q) ||
          categoryLabel.includes(q)
        );
      }
      return true;
    });
  }, [catalog.definitions, selectedCategory, searchQuery, i18n]);

  // Add furniture item using selected predefined specification (AC-4, AC-10, AC-12)
  const handleAddFurniture = (def: FurnitureDefinition) => {
    const defaultSpec = def.specifications?.[0];
    const chosenSpecId = selectedSpecs[def.id] ?? defaultSpec?.id;

    if (onSelectDefinition) {
      if (chosenSpecId && chosenSpecId !== defaultSpec?.id) {
        onSelectDefinition(def.id, chosenSpecId);
      } else {
        onSelectDefinition(def.id);
      }
      if (onClose) {
        onClose();
      }
      return;
    }

    const res = addFurnitureInstance(plan, catalog, def.id, {
      specificationId: chosenSpecId,
    });
    if (res.success) {
      onUpdatePlan?.(res.plan);
      onSelect?.({ type: "furniture", id: res.instance.id });
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div
      data-testid="furniture-catalog-palette"
      className={cn("flex flex-col gap-3 text-xs", className)}
    >
      {/* Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          data-testid="furniture-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="h-8 pl-8 text-xs bg-background"
        />
      </div>

      {/* Category Filter Pills / Tabs (AC-10) */}
      <div
        data-testid="furniture-category-filters"
        className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none"
      >
        <button
          type="button"
          data-testid="category-filter-all"
          onClick={() => setSelectedCategory("all")}
          className={cn(
            "h-7 px-2.5 rounded-md text-[11px] font-medium shrink-0 transition-colors flex items-center gap-1.5",
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
        >
          <span>{t.allCategory}</span>
          <span className="opacity-70 text-[10px]">({catalog.definitions.length})</span>
        </button>

        {ALL_FURNITURE_CATEGORIES.map((cat) => {
          const count = catalog.definitions.filter((d) => d.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              data-testid={`category-filter-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "h-7 px-2.5 rounded-md text-[11px] font-medium shrink-0 transition-colors flex items-center gap-1.5",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {CATEGORY_ICONS[cat]}
              <span>{i18n.getFurnitureCategoryLabel(cat)}</span>
              <span className="opacity-70 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Furniture List */}
      <div
        data-testid="furniture-definition-list"
        className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1"
      >
        {filteredDefinitions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
            {t.noResults}
          </div>
        ) : (
          filteredDefinitions.map((def) => {
            const defaultSpec = def.specifications?.[0];
            const activeSpecId = selectedSpecs[def.id] ?? defaultSpec?.id;
            const activeSpec =
              def.specifications?.find((s) => s.id === activeSpecId) ?? defaultSpec;
            const width = activeSpec?.width ?? def.defaultSize?.width ?? 0;
            const depth = activeSpec?.depth ?? def.defaultSize?.depth ?? 0;
            const height = activeSpec?.height ?? def.defaultSize?.height;

            return (
              <Card
                key={def.id}
                data-testid={`furniture-catalog-card-${def.id}`}
                className="overflow-hidden border-border/80 hover:border-primary/50 transition-colors bg-card/60 p-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground text-xs truncate">
                        {i18n.getFurnitureName(def.id, def.name)}
                      </span>
                      <Badge
                        variant="secondary"
                        className="font-mono text-[9px] uppercase px-1.5 py-0"
                      >
                        {i18n.getFurnitureCategoryLabel(def.category)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                      <span>
                        {i18n.locale === "zh" ? "当前规格：" : "Selected: "}
                        <strong className="text-foreground">{width} × {depth} mm</strong>
                      </span>
                      {height && (
                        <span>({i18n.locale === "zh" ? `高：${height} mm` : `H: ${height} mm`})</span>
                      )}
                    </div>

                    {/* Predefined Specifications List (AC-4) */}
                    {def.specifications && def.specifications.length > 0 && (
                      <div
                        data-testid={`furniture-spec-list-${def.id}`}
                        className="flex flex-wrap items-center gap-1 pt-0.5"
                      >
                        <span className="text-[10px] text-muted-foreground mr-0.5">
                          {i18n.locale === "zh" ? "预设规格：" : "Specs:"}
                        </span>
                        {def.specifications.map((spec) => {
                          const isSelected = activeSpec?.id === spec.id;
                          const localizedDefName = i18n.getFurnitureName(def.id, def.name);
                          return (
                            <Button
                              key={spec.id}
                              type="button"
                              size="sm"
                              variant={isSelected ? "default" : "outline"}
                              data-testid={`catalog-spec-option-${spec.id}`}
                              data-selected={isSelected ? "true" : "false"}
                              aria-pressed={isSelected}
                              aria-label={
                                i18n.locale === "zh"
                                  ? `选择 ${localizedDefName} 规格 ${spec.name}`
                                  : `Select ${localizedDefName} specification ${spec.name}`
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
                    variant="outline"
                    data-testid={`add-furniture-item-${def.id}`}
                    aria-label={
                      i18n.locale === "zh"
                        ? `添加 ${i18n.getFurnitureName(def.id, def.name)}`
                        : `Add ${i18n.getFurnitureName(def.id, def.name)}`
                    }
                    onClick={() => handleAddFurniture(def)}
                    className="min-h-11 min-w-11 lg:h-7 lg:min-h-0 lg:min-w-0 px-2 text-xs shrink-0 flex items-center gap-1 hover:bg-primary hover:text-primary-foreground transition-colors touch-manipulation focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{i18n.locale === "zh" ? "添加" : "Add"}</span>
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
