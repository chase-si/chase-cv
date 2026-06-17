import { cn } from "@/lib/utils";

type ImageToUiStepIndicatorProps = {
  activeStep: 1 | 2;
};

export function ImageToUiStepIndicator({ activeStep }: ImageToUiStepIndicatorProps) {
  const steps = [
    { number: 1, label: "选择图片与颜色" },
    { number: 2, label: "渲染界面" },
  ] as const;

  return (
    <ol className="flex flex-wrap items-center gap-3 text-sm" aria-label="工具步骤">
      {steps.map((step, index) => {
        const isActive = activeStep === step.number;
        const isComplete = activeStep > step.number;

        return (
          <li key={step.number} className="flex items-center gap-3">
            {index > 0 ? (
              <span className="hidden h-px w-6 bg-border sm:block" aria-hidden />
            ) : null}
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5",
                isActive && "border-primary bg-primary/10 text-foreground",
                isComplete && "border-border text-muted-foreground",
                !isActive && !isComplete && "border-border text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                  isActive && "bg-primary text-primary-foreground",
                  !isActive && "bg-muted text-muted-foreground",
                )}
              >
                {step.number}
              </span>
              <span className="font-medium">{step.label}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
