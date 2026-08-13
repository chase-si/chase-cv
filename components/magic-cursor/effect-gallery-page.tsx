"use client";

import { useState } from "react";

import type { EffectName } from "magic-cursor-effect";

import { MagicCursorDemoTile } from "@/components/magic-cursor/demo-tile";
import { MagicCursorSidebar } from "@/components/magic-cursor/sidebar";
import { ToolPageChrome } from "@/components/tool-page-chrome";
import { Card, CardScrollArea } from "@/components/ui/card";
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
    <ToolPageChrome title={heading} description={description}>
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
        <section className="min-h-0 min-w-0 lg:max-h-full">
          <CardScrollArea className="lg:max-h-full">
            <MagicCursorSidebar activeEffect={null} />
          </CardScrollArea>
        </section>

        <Card className="min-h-0 overflow-hidden p-0 lg:max-h-full">
          <CardScrollArea className="lg:max-h-full">
            <div className="grid content-start items-start gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
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
          </CardScrollArea>
        </Card>
      </div>
    </ToolPageChrome>
  );
}
