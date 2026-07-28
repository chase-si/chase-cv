"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

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
  hide: "hide",
  reset: "reset",
} as const satisfies Record<DuduScannerOperatorTouchControlId, string>;

type DuduScannerOperatorControlBarProps = {
  paused: boolean;
  onDomainCommand: (command: DuduScannerDomainCommand) => void;
  className?: string;
};

export function DuduScannerOperatorControlBar({
  paused,
  onDomainCommand,
  className,
}: DuduScannerOperatorControlBarProps) {
  const t = useTranslations("duduScanner.operatorBar");
  const [expanded, setExpanded] = useState(false);

  const handleControl = (controlId: DuduScannerOperatorTouchControlId) => {
    onDomainCommand(touchControlIdToDomainCommand(controlId));
  };

  return (
    <div
      className={cn("shrink-0", className)}
      data-testid="dudu-scanner-operator-bar"
      aria-label={t("label")}
    >
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-card/95 p-2 shadow-xs">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-w-0 flex-1 justify-between gap-2"
          aria-expanded={expanded}
          aria-controls="dudu-scanner-operator-controls"
          data-testid="dudu-scanner-operator-bar-toggle"
          onClick={() => setExpanded((value) => !value)}
        >
          <span className="truncate text-left text-sm">{t("label")}</span>
          {expanded ? (
            <ChevronUp className="size-4 shrink-0" aria-hidden />
          ) : (
            <ChevronDown className="size-4 shrink-0" aria-hidden />
          )}
        </Button>
      </div>
      {expanded ? (
        <div
          id="dudu-scanner-operator-controls"
          className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3"
          role="group"
          aria-label={t("label")}
        >
          {DUDU_SCANNER_OPERATOR_TOUCH_CONTROLS.map((controlId) => (
            <Button
              key={controlId}
              type="button"
              variant="secondary"
              size="sm"
              className="h-auto min-h-9 whitespace-normal py-2 text-xs sm:text-sm"
              data-testid={`dudu-scanner-operator-${controlId}`}
              onClick={() => handleControl(controlId)}
            >
              {controlId === "pause-resume" && paused
                ? t("resume")
                : t(TOUCH_CONTROL_MESSAGE_KEY[controlId])}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
