"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { EffectName } from "magic-cursor-effect";

import { stripMagneticDemoOptions } from "@/lib/magic-cursor/magnetic-options";

function formatCode(effect: EffectName, options: unknown) {
  let payload = options ?? {};
  if (effect === "magnetic" && payload && typeof payload === "object") {
    payload = stripMagneticDemoOptions(payload as Record<string, unknown>);
  }
  const optionsJson = JSON.stringify(payload, null, 2);
  return `import { createEffect } from "magic-cursor-effect";

const root = document.querySelector("#your-root") as HTMLElement;

const instance = createEffect("${effect}", root, ${optionsJson});

// later
// instance.destroy();
`;
}

export function MagicCursorEffectCode({
  effect,
  options,
}: {
  effect: EffectName;
  options: unknown;
}) {
  const t = useTranslations("magicCursor");
  const code = useMemo(() => formatCode(effect, options), [effect, options]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(t("copySuccess"));
    } catch {
      toast.error(t("copyError"));
    }
  };

  return (
    <div className="mt-6 border border-border bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium">{t("code")}</div>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center border border-border bg-background px-3 text-xs font-medium shadow-sm transition hover:bg-muted"
          onClick={handleCopy}
        >
          {t("copy")}
        </button>
      </div>
      <pre className="mt-3 overflow-x-auto border border-border bg-background/80 p-4 text-xs leading-relaxed text-foreground">
        <code className="block whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
