import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type ImageToUiStepIndicatorProps = {
  activeStep: 1 | 2;
  labels?: {
    stepsAria: string;
    select: string;
    render: string;
  };
};

export function ImageToUiStepIndicator({
  activeStep,
  labels = {
    stepsAria: "工具步骤",
    select: "选择名画与颜色",
    render: "生成界面预览",
  },
}: ImageToUiStepIndicatorProps) {
  const steps = [
    { number: 1 as const, label: labels.select },
    { number: 2 as const, label: labels.render },
  ] as const;

  return (
    <ol className="flex items-center gap-0 text-sm" aria-label={labels.stepsAria}>
      {steps.map((step, index) => {
        const isActive = activeStep === step.number;
        const isComplete = activeStep > step.number;
        const isLast = index === steps.length - 1;

        return (
          <li key={step.number} className="flex min-w-0 items-center">
            <div className="flex min-w-0 flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center shadow-xs rounded-full border-2 text-xs font-semibold transition-colors",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isComplete && "border-primary bg-primary/15 text-primary",
                  !isActive && !isComplete && "border-border bg-muted text-muted-foreground",
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {isComplete ? <Check className="size-4" aria-hidden /> : step.number}
              </span>
              <span
                className={cn(
                  "max-w-28 text-center text-xs font-medium sm:max-w-none sm:text-left sm:text-sm",
                  isActive && "text-foreground",
                  !isActive && "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast ? (
              <span
                className={cn(
                  "mx-2 hidden h-0.5 w-8 shrink-0 rounded-full sm:mx-3 sm:block sm:w-12",
                  isComplete ? "bg-primary" : "bg-border",
                )}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
