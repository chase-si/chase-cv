"use client";

import { useEffect, useState } from "react";

import type { EffectName } from "magic-cursor-effect";

import { Card, CardHeader, CardContent, CardScrollArea } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MagicCursorSidebar } from "@/components/magic-cursor/sidebar";
import { MagicCursorDemoDetail } from "@/components/magic-cursor/demo-detail";
import { MagicCursorEffectCode } from "@/components/magic-cursor/effect-code";
import { ToolPageChrome } from "@/components/tool-page-chrome";
import type { OptionsByEffect } from "@/components/magic-cursor/types";
import { Link } from "@/i18n/navigation";
import { defaultOptionsByEffect } from "@/lib/constants/magic-cursor";
import { trackEvent } from "@/lib/analytics";

type Props = {
  effect: EffectName;
  heading: string;
  description: string;
  hubLabel: string;
  breadcrumbLabel: string;
};

export function MagicCursorEffectPage({
  effect,
  heading,
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
    <ToolPageChrome title={heading} description={description}>
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
        <section className="min-h-0 min-w-0 lg:max-h-full">
          <CardScrollArea className="lg:max-h-full">
            <MagicCursorSidebar
              activeEffect={effect}
              optionsByEffect={optionsByEffect}
              setOptionsByEffect={setOptionsByEffect}
              defaultOptionsByEffect={defaultOptionsByEffect}
            />
          </CardScrollArea>
        </section>

        <Card className="flex min-h-0 flex-col overflow-hidden lg:max-h-full lg:gap-0 lg:py-0">
          <CardHeader className="shrink-0 pb-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/magic-cursor">{hubLabel}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col">
            <CardScrollArea className="min-h-0 flex-1">
              <MagicCursorDemoDetail effect={effect} options={options} />
              <MagicCursorEffectCode effect={effect} options={options} />
            </CardScrollArea>
          </CardContent>
        </Card>
      </div>
    </ToolPageChrome>
  );
}
