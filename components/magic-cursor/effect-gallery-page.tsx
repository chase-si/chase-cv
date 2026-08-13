"use client";

import { useState } from "react";

import type { EffectName } from "magic-cursor-effect";

import { MagicCursorDemoTile } from "@/components/magic-cursor/demo-tile";
import { MagicCursorSidebar } from "@/components/magic-cursor/sidebar";
import { Card } from "@/components/ui/card";
import { defaultOptionsByEffect, MAGIC_CURSOR_EFFECT_ORDER } from "@/lib/constants/magic-cursor";

export function MagicCursorEffectGalleryPage({
  heading,
  description,
}: {
  heading: string;
  description: string;
}) {
  const [active, setActive] = useState<EffectName | null>(null);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <main className="mx-auto w-full flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[20rem_minmax(0,1fr)] xl:items-start xl:gap-8">
          <section>
            <MagicCursorSidebar activeEffect={null} />
          </section>

          <Card className="overflow-hidden p-0">
            <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
              {MAGIC_CURSOR_EFFECT_ORDER.map((effect) => {
                // ring 依赖 reach 激活，懒挂载时指针已在格内会永远进不了 activated 状态
                const enabled = effect === "ring" || active === effect;
                return (
                  <div
                    key={effect}
                    onMouseEnter={() => setActive(effect)}
                    onMouseLeave={() =>
                      setActive((prev) => (prev === effect ? null : prev))
                    }
                    onFocus={() => setActive(effect)}
                    onBlur={() =>
                      setActive((prev) => (prev === effect ? null : prev))
                    }
                  >
                    <MagicCursorDemoTile
                      enabled={enabled}
                      effect={effect}
                      options={defaultOptionsByEffect[effect]}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
