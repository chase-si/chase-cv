"use client";

import { useTranslations } from "next-intl";

import { CardScrollArea } from "@/components/ui/card";
import {
  DUDU_SCANNER_SHORTCUT_KEYS,
  DUDU_SCANNER_SHORTCUT_LABEL,
  type DuduScannerShortcutKey,
} from "@/lib/dudu-scanner/i18n-keys";
import { cn } from "@/lib/utils";

function DuduScannerKeycap({
  shortcutKey,
  emphasized = false,
}: {
  shortcutKey: DuduScannerShortcutKey;
  emphasized?: boolean;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex min-w-8 shrink-0 items-center justify-center rounded-lg border px-2 py-1 font-mono text-[11px] font-bold shadow-2xs",
        emphasized
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground",
      )}
    >
      {DUDU_SCANNER_SHORTCUT_LABEL[shortcutKey]}
    </kbd>
  );
}

export function DuduScannerShortcutDeck({ className }: { className?: string }) {
  const t = useTranslations("duduScanner");

  return (
    <CardScrollArea className={cn("min-w-0", className)}>
      <dl className="flex min-w-max items-center gap-2 pb-1">
        {DUDU_SCANNER_SHORTCUT_KEYS.map((shortcutKey, index) => (
          <div
            key={shortcutKey}
            className={cn(
              "flex items-center gap-2",
              index === 2 && "ml-3 border-l border-border pl-5",
            )}
          >
            <dt>
              <DuduScannerKeycap shortcutKey={shortcutKey} emphasized={index < 2} />
            </dt>
            <dd
              className={cn(
                "text-xs",
                index < 2 ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              {t(`shortcuts.${shortcutKey}`)}
            </dd>
          </div>
        ))}
      </dl>
    </CardScrollArea>
  );
}
