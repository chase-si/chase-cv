"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DUDU_SCANNER_OPERATOR_TOUCH_CONTROLS,
  touchControlIdToDomainCommand,
  type DuduScannerDomainCommand,
  type DuduScannerOperatorTouchControlId,
} from "@/lib/dudu-scanner/scanner-commands";
import { cn } from "@/lib/utils";

const TOUCH_CONTROL_MESSAGE_KEY = {
  "pause-resume": "pauseResume",
  reveal: "reveal",
  lock: "lock",
  reset: "reset",
} as const satisfies Record<DuduScannerOperatorTouchControlId, string>;

type DuduScannerOperatorControlBarProps = {
  paused: boolean;
  targetRevealed: boolean;
  onDomainCommand: (command: DuduScannerDomainCommand) => void;
  className?: string;
};

export function DuduScannerOperatorControlBar({
  paused,
  targetRevealed,
  onDomainCommand,
  className,
}: DuduScannerOperatorControlBarProps) {
  const t = useTranslations("duduScanner.operatorBar");

  return (
    <div
      className={cn("shrink-0", className)}
      data-testid="dudu-scanner-operator-bar"
      aria-label={t("label")}
    >
      <div
        id="dudu-scanner-operator-controls"
        className="grid grid-cols-2 gap-2"
        role="group"
        aria-label={t("label")}
      >
        {DUDU_SCANNER_OPERATOR_TOUCH_CONTROLS.map((controlId) => (
          <Button
            key={controlId}
            type="button"
            variant={controlId === "lock" ? "default" : "secondary"}
            size="sm"
            className="h-auto min-h-9 whitespace-normal py-2 text-xs sm:text-sm"
            data-testid={`dudu-scanner-operator-${controlId}`}
            onClick={() =>
              onDomainCommand(touchControlIdToDomainCommand(controlId, { targetRevealed }))
            }
          >
            {controlId === "pause-resume" && paused
              ? t("resume")
              : controlId === "reveal" && targetRevealed
                ? t("hide")
                : t(TOUCH_CONTROL_MESSAGE_KEY[controlId])}
          </Button>
        ))}
      </div>
    </div>
  );
}
