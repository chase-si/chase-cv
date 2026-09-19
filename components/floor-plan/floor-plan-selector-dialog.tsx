"use client";

import * as React from "react";
import { Compass, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardScrollArea } from "@/components/ui/card";
import type { StandardPlanSummary } from "@/lib/floor-plan/catalog";
import type { FloorPlanDictionary } from "@/lib/floor-plan/i18n";
import { FloorPlanCatalog } from "./floor-plan-catalog";
import { cn } from "@/lib/utils";

export interface FloorPlanSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plans: StandardPlanSummary[];
  activePlanId: string;
  onSelectPlan: (planId: string) => void;
  locale?: string;
  t: FloorPlanDictionary;
  className?: string;
}

export function FloorPlanSelectorDialog({
  open,
  onOpenChange,
  plans,
  activePlanId,
  onSelectPlan,
  locale,
  t,
  className,
}: FloorPlanSelectorDialogProps) {
  // Handle escape key
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  const handleSelect = (planId: string) => {
    onSelectPlan(planId);
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        data-testid="floor-plan-selector-backdrop"
        className="fixed inset-0 bg-foreground/30 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Modal Popup */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-selector-title"
        data-testid="floor-plan-selector-dialog"
        className={cn(
          "relative z-10 flex w-full max-w-4xl max-h-[85vh] flex-col rounded-2xl border border-border bg-card p-0 shadow-2xl text-card-foreground outline-hidden overflow-hidden",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5 shrink-0 bg-card">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Compass className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2
                id="plan-selector-title"
                data-testid="plan-selector-title"
                className="text-sm font-semibold tracking-tight text-foreground truncate"
              >
                {t.catalog.title}
              </h2>
              <p className="text-[11px] text-muted-foreground truncate">
                {t.workflow.planStage.description}
              </p>
            </div>
          </div>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            data-testid="plan-selector-close-btn"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground touch-manipulation"
            aria-label={t.actions.close}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Catalog Body */}
        <CardScrollArea className="min-h-0 flex-1 p-4 sm:p-5">
          <FloorPlanCatalog
            plans={plans}
            activePlanId={activePlanId}
            onSelectPlan={handleSelect}
            locale={locale}
          />
        </CardScrollArea>
      </div>
    </div>
  );
}
