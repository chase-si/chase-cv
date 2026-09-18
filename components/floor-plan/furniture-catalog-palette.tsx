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
import type {
  FloorPlan,
  FurnitureCatalog,
  FurnitureCategory,
  FurnitureDefinition,
} from "@/lib/floor-plan/types";
import { cn } from "@/lib/utils";
import type { SelectedEntity } from "./types";

interface FurnitureCatalogPaletteProps {
  plan: FloorPlan;
  catalog?: FurnitureCatalog;
  onUpdatePlan?: (updatedPlan: FloorPlan) => void;
  onSelect?: (entity: SelectedEntity | null) => void;
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

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  bed: "Beds",
  sofa: "Sofas",
  table: "Tables",
  chair: "Chairs",
  storage: "Storage",
  desk: "Desks",
  tv_stand: "TV Stands",
};

export function FurnitureCatalogPalette({
  plan,
  catalog: propCatalog,
  onUpdatePlan,
  onSelect,
  onClose,
  className = "",
}: FurnitureCatalogPaletteProps) {
  const catalog = React.useMemo(
    () => propCatalog ?? getDefaultFurnitureCatalog(),
    [propCatalog],
  );

  const [selectedCategory, setSelectedCategory] = React.useState<
    FurnitureCategory | "all"
  >("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [recentlyAddedId, setRecentlyAddedId] = React.useState<string | null>(null);

  // Filter definitions based on category and search query (AC-10)
  const filteredDefinitions = React.useMemo(() => {
    return catalog.definitions.filter((def) => {
      if (selectedCategory !== "all" && def.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          def.name.toLowerCase().includes(q) ||
          def.id.toLowerCase().includes(q) ||
          def.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [catalog.definitions, selectedCategory, searchQuery]);

  // Add furniture item using default dimensions (AC-10)
  const handleAddFurniture = (def: FurnitureDefinition) => {
    const res = addFurnitureInstance(plan, catalog, def.id);
    if (res.success) {
      setRecentlyAddedId(res.instance.id);
      onUpdatePlan?.(res.plan);
      onSelect?.({ type: "furniture", id: res.instance.id });
      setTimeout(() => {
        setRecentlyAddedId(null);
      }, 1500);
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
          placeholder="Search furniture..."
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
          <span>All</span>
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
              <span>{CATEGORY_LABELS[cat] ?? cat}</span>
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
            No furniture definitions match your selection.
          </div>
        ) : (
          filteredDefinitions.map((def) => {
            const width = def.defaultSize.width;
            const depth = def.defaultSize.depth;
            const widthRange = def.allowedSizeRanges?.width;
            const depthRange = def.allowedSizeRanges?.depth;

            return (
              <Card
                key={def.id}
                data-testid={`furniture-catalog-card-${def.id}`}
                className="overflow-hidden border-border/80 hover:border-primary/50 transition-colors bg-card/60 p-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground text-xs truncate">
                        {def.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className="font-mono text-[9px] uppercase px-1.5 py-0"
                      >
                        {def.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                      <span>
                        Default: <strong className="text-foreground">{width} × {depth} mm</strong>
                      </span>
                      {def.defaultSize.height && (
                        <span>(H: {def.defaultSize.height} mm)</span>
                      )}
                    </div>

                    {(widthRange || depthRange) && (
                      <p className="text-[10px] text-muted-foreground/80 leading-tight">
                        Range: W {widthRange?.min}–{widthRange?.max}mm, D {depthRange?.min}–{depthRange?.max}mm
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    data-testid={`add-furniture-item-${def.id}`}
                    onClick={() => handleAddFurniture(def)}
                    className="h-7 px-2 text-xs shrink-0 flex items-center gap-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
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
