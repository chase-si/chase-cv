"use client";

import Link from "next/link";
import { useState } from "react";

import type { EffectName } from "magic-cursor-effect";

import { MagicCursorDemoTile } from "@/components/magic-cursor/demo-tile";
import { MagicCursorSidebar } from "@/components/magic-cursor/sidebar";
import { MAGIC_CURSOR_EFFECTS, MAGIC_CURSOR_EFFECT_ORDER, defaultOptionsByEffect } from "@/lib/constants/magic-cursor";

export default function Page() {
  const [active, setActive] = useState<EffectName | null>(null);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-4">
            <MagicCursorSidebar activeEffect={null} />
          </section>

          <section className="lg:col-span-8 shadow-lg backdrop-blur-xl rounded-xl overflow-hidden">
            <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
              {[...MAGIC_CURSOR_EFFECT_ORDER, MAGIC_CURSOR_EFFECTS.INVERT_RING.type].map((effect, index) => {
                const enabled = active === effect;
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setActive(effect)}
                    onMouseLeave={() => setActive((prev) => (prev === effect ? null : prev))}
                    onFocus={() => setActive(effect)}
                    onBlur={() => setActive((prev) => (prev === effect ? null : prev))}
                  >
                    <MagicCursorDemoTile
                      key={index}
                      enabled={enabled}
                      effect={effect}
                      options={defaultOptionsByEffect[effect]}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}