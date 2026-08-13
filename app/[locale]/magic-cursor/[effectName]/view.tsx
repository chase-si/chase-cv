"use client";

import { useEffect, useState } from "react";

import type { EffectName } from "magic-cursor-effect";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
            <MagicCursorSidebar
              activeEffect={effect}
              optionsByEffect={optionsByEffect}
              setOptionsByEffect={setOptionsByEffect}
              defaultOptionsByEffect={defaultOptionsByEffect}
            />
          </section>

          <Card>
            <CardHeader className="pb-2">
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
            <CardContent>
              <MagicCursorDemoDetail effect={effect} options={options} />
              <MagicCursorEffectCode effect={effect} options={options} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
