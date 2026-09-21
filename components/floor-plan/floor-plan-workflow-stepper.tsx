"use client";

import * as React from "react";
import { Check } from "lucide-react";
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
}

const STAGES: StageConfig[] = [
  { id: "plan", stepNumber: 1 },
  { id: "room", stepNumber: 2 },
  { id: "furniture", stepNumber: 3 },
  { id: "decision", stepNumber: 4 },
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
      aria-label={t.workflow.stepperAriaLabel || "Floor plan workflow steps"}
      data-testid="floor-plan-stage-stepper"
      className={cn(
        "flex w-full shrink-0 items-center justify-between overflow-x-auto border-b border-border/70 bg-background/80 px-1 pb-2",
        className,
      )}
    >
      <ol className="flex w-full min-w-[320px] items-center gap-1 sm:gap-3">
        {STAGES.map((stage, idx) => {
          const isActive = currentStage === stage.id;
          const isCompleted = completedStages.includes(stage.id) || idx < currentIndex;
          const isClickable = isCompleted || isActive;
          return (
            <li key={stage.id} className="relative flex-1 min-w-0">
              {idx > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute right-[calc(50%+1.35rem)] left-[calc(-50%+1.35rem)] top-4 h-px",
                    idx <= currentIndex ? "bg-primary/50" : "bg-border",
                  )}
                />
              )}
              <button
                type="button"
                data-testid={`stage-step-${stage.id}`}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${stage.stepNumber}. ${getStageTitle(stage.id)}`}
                disabled={!isClickable}
                onClick={() => {
                  if (isClickable) {
                    onSelectStage(stage.id);
                  }
                }}
                className={cn(
                  "group relative z-10 flex w-full items-center justify-center gap-2 rounded-xl px-2 py-1 min-h-[44px] text-left text-xs transition-colors touch-manipulation",
                  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary",
                  isActive &&
                    "text-foreground font-semibold",
                  !isActive && isCompleted &&
                    "text-muted-foreground hover:text-foreground cursor-pointer",
                  !isActive && !isCompleted &&
                    "text-muted-foreground/45 cursor-not-allowed",
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-mono font-medium transition-colors",
                    isActive && "border-primary bg-primary text-primary-foreground font-bold shadow-xs",
                    !isActive && isCompleted && "border-primary/35 bg-background text-primary font-bold",
                    !isActive && !isCompleted && "border-border bg-background text-muted-foreground/60",
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
                  <p className="hidden xl:block truncate text-[10px] text-muted-foreground leading-tight mt-0.5 font-normal">{getStageDesc(stage.id)}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
