"use client";

import * as React from "react";
import { Check, Compass, LayoutGrid, Armchair, Sparkles } from "lucide-react";
import type { FloorPlanDictionary } from "@/lib/floor-plan/i18n";
import { cn } from "@/lib/utils";

export type WorkflowStage = "plan" | "room" | "furniture" | "decision";

export interface FloorPlanWorkflowStepperProps {
  currentStage: WorkflowStage;
  completedStages: WorkflowStage[];
  onSelectStage: (stage: WorkflowStage) => void;
  t: FloorPlanDictionary;
  className?: string;
}

interface StageConfig {
  id: WorkflowStage;
  stepNumber: number;
  icon: React.ComponentType<{ className?: string }>;
}

const STAGES: StageConfig[] = [
  { id: "plan", stepNumber: 1, icon: Compass },
  { id: "room", stepNumber: 2, icon: LayoutGrid },
  { id: "furniture", stepNumber: 3, icon: Armchair },
  { id: "decision", stepNumber: 4, icon: Sparkles },
];

export function FloorPlanWorkflowStepper({
  currentStage,
  completedStages,
  onSelectStage,
  t,
  className,
}: FloorPlanWorkflowStepperProps) {
  const stageOrder: WorkflowStage[] = ["plan", "room", "furniture", "decision"];
  const currentIndex = stageOrder.indexOf(currentStage);

  const getStageTitle = (id: WorkflowStage) => {
    return t.workflow.steps[id];
  };

  const getStageDesc = (id: WorkflowStage) => {
    return t.workflow.stepDescriptions[id];
  };

  return (
    <nav
      aria-label="Floor plan workflow steps"
      data-testid="floor-plan-stage-stepper"
      className={cn(
        "flex w-full shrink-0 items-center justify-between rounded-2xl border border-border bg-card p-1.5 shadow-xs overflow-x-auto",
        className,
      )}
    >
      <ol className="flex w-full min-w-[320px] items-center gap-1 sm:gap-2">
        {STAGES.map((stage, idx) => {
          const isActive = currentStage === stage.id;
          const isCompleted = completedStages.includes(stage.id) || idx < currentIndex;
          const isClickable = isCompleted || isActive;
          const Icon = stage.icon;

          return (
            <li key={stage.id} className="flex-1 min-w-0">
              <button
                type="button"
                data-testid={`stage-step-${stage.id}`}
                aria-current={isActive ? "step" : undefined}
                disabled={!isClickable}
                onClick={() => {
                  if (isClickable) {
                    onSelectStage(stage.id);
                  }
                }}
                className={cn(
                  "group relative flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-xs transition-all touch-manipulation",
                  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                  isActive &&
                    "bg-primary/10 border border-primary/30 text-foreground font-semibold shadow-xs",
                  !isActive && isCompleted &&
                    "hover:bg-muted/60 text-muted-foreground hover:text-foreground cursor-pointer border border-transparent",
                  !isActive && !isCompleted &&
                    "text-muted-foreground/50 cursor-not-allowed border border-transparent opacity-75",
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-mono font-medium transition-colors",
                    isActive && "bg-primary text-primary-foreground font-bold shadow-xs",
                    !isActive && isCompleted && "bg-primary/20 text-primary font-bold",
                    !isActive && !isCompleted && "bg-muted text-muted-foreground/60",
                  )}
                >
                  {isCompleted && !isActive ? (
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  ) : (
                    stage.stepNumber
                  )}
                </div>

                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-xs leading-none">
                      {getStageTitle(stage.id)}
                    </span>
                  </div>
                  <p className="hidden md:block truncate text-[10px] text-muted-foreground leading-tight mt-0.5 font-normal">
                    {getStageDesc(stage.id)}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
