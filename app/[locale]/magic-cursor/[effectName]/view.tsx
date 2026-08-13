"use client";

import { useEffect, useState } from "react";

import type { EffectName } from "magic-cursor-effect";

import { Card, CardContent, CardScrollArea } from "@/components/ui/card";
import { MagicCursorSidebar } from "@/components/magic-cursor/sidebar";
import { MagicCursorDemoDetail } from "@/components/magic-cursor/demo-detail";
import { MagicCursorEffectCode } from "@/components/magic-cursor/effect-code";
import { ToolPageChrome } from "@/components/tool-page-chrome";
import type { OptionsByEffect } from "@/components/magic-cursor/types";
import { defaultOptionsByEffect } from "@/lib/constants/magic-cursor";
import { trackEvent } from "@/lib/analytics";

type Props = {
  effect: EffectName;
  description: string;
  hubLabel: string;
  breadcrumbLabel: string;
};

export function MagicCursorEffectPage({
  effect,
  description,
  hubLabel,
  breadcrumbLabel,
}: Props) {
  const [optionsByEffect, setOptionsByEffect] = useState<OptionsByEffect>(defaultOptionsByEffect);
  const options = optionsByEffect[effect];

  useEffect(() => {
    trackEvent("effect_view", { effect });
  }, [effect]);

  return (
    <ToolPageChrome title={`${hubLabel} / ${breadcrumbLabel}`} description={description}>
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-stretch">
        <aside className="min-h-0 min-w-0 lg:max-h-full">
          <MagicCursorSidebar
            activeEffect={effect}
            optionsByEffect={optionsByEffect}
            setOptionsByEffect={setOptionsByEffect}
            defaultOptionsByEffect={defaultOptionsByEffect}
          />
        </aside>

        <Card className="flex min-h-0 flex-col overflow-hidden lg:max-h-full">
          <CardScrollArea className="min-h-0 flex-1">
            <CardContent className="flex flex-col gap-4">
              <MagicCursorDemoDetail effect={effect} options={options} />
              <MagicCursorEffectCode effect={effect} options={options} />
            </CardContent>
          </CardScrollArea>
        </Card>
      </div>
    </ToolPageChrome>
  );
}
