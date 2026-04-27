"use client";

import { useMemo } from "react";
import { toast } from "sonner";

import type { EffectName } from "magic-cursor-effect";

function formatCode(effect: EffectName, options: unknown) {
  const optionsJson = JSON.stringify(options ?? {}, null, 2);
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
  const code = useMemo(() => formatCode(effect, options), [effect, options]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("已复制到剪贴板");
    } catch {
      toast.error("复制失败");
    }
  };

  return (
    <div className="mt-6 rounded-3xl border border-border bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium">Code</div>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center rounded-2xl border border-border bg-background px-3 text-xs font-medium shadow-sm transition hover:bg-muted"
          onClick={handleCopy}
        >
          复制
        </button>
      </div>
      <pre className="mt-3 overflow-x-auto rounded-2xl border border-border bg-background/80 p-4 text-xs leading-relaxed text-foreground">
        <code className="block whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

