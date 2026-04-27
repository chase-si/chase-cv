"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
import { defaultOptionsByEffect } from "@/lib/constants/magic-cursor";
import { trackEvent } from "@/lib/analytics";

type Props = {
  effect: EffectName;
};

export function MagicCursorEffectPage({ effect }: Props) {
  const [optionsByEffect, setOptionsByEffect] = useState<OptionsByEffect>(defaultOptionsByEffect);
  const options = optionsByEffect[effect];

  useEffect(() => {
    trackEvent("effect_view", { effect });
  }, [effect]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-4">
            <MagicCursorSidebar
              activeEffect={effect}
              optionsByEffect={optionsByEffect}
              setOptionsByEffect={setOptionsByEffect}
              defaultOptionsByEffect={defaultOptionsByEffect}
            />
          </section>

          <Card className="lg:col-span-8">
            <CardHeader className="pb-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/magic-cursor">Magic Cursor</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>/</BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="first-letter:uppercase">
                      {effect}
                    </BreadcrumbPage>
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

