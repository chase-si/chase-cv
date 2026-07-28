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

function ShortcutRow({
  shortcutKey,
  index,
  layout,
  label,
}: {
  shortcutKey: DuduScannerShortcutKey;
  index: number;
  layout: "horizontal" | "vertical";
  label: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        layout === "horizontal" && index === 2 && "ml-3 border-l border-border pl-5",
        layout === "vertical" && index === 2 && "border-t border-border pt-2",
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
        {label}
      </dd>
    </div>
  );
}

export function DuduScannerShortcutDeck({
  className,
  layout = "horizontal",
}: {
  className?: string;
  layout?: "horizontal" | "vertical";
}) {
  const t = useTranslations("duduScanner");

  const rows = DUDU_SCANNER_SHORTCUT_KEYS.map((shortcutKey, index) => (
    <ShortcutRow
      key={shortcutKey}
      shortcutKey={shortcutKey}
      index={index}
      layout={layout}
      label={t(`shortcuts.${shortcutKey}`)}
    />
  ));

  if (layout === "vertical") {
    return <dl className={cn("flex min-w-0 flex-col gap-2", className)}>{rows}</dl>;
  }

  return (
    <CardScrollArea className={cn("min-w-0", className)}>
      <dl className="flex min-w-max items-center gap-2 pb-1">{rows}</dl>
    </CardScrollArea>
  );
}
