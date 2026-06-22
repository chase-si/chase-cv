"use client";

import { useState } from "react";

import type { EffectName } from "magic-cursor-effect";

import { MagicCursorDemoTile } from "@/components/magic-cursor/demo-tile";
import { MagicCursorSidebar } from "@/components/magic-cursor/sidebar";
import { Card } from "@/components/ui/card";
import { defaultOptionsByEffect, MAGIC_CURSOR_EFFECT_ORDER } from "@/lib/constants/magic-cursor";

export function MagicCursorEffectGalleryPage() {
  const [active, setActive] = useState<EffectName | null>(null);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-4">
            <MagicCursorSidebar activeEffect={null} />
          </section>

          <Card className="overflow-hidden p-0 shadow-lg backdrop-blur-xl lg:col-span-8">
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
