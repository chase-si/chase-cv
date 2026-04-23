"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type {
  Destroyable,
  EffectName,
  FlameOptions,
  InvertRingOptions,
  MagneticOptions,
  MagnifierOptions,
  RingOptions,
  SmokeOptions,
  SpotlightOptions,
  TrailOptions,
} from "magic-cursor-effect";
import { createEffect } from "magic-cursor-effect";

import { MagicCursorSidebar } from "@/components/magic-cursor/sidebar";
import type { OptionsByEffect } from "@/components/magic-cursor/types";
import { SiteNav } from "@/components/site-nav";

const defaultOptionsByEffect: OptionsByEffect = {
  ring: { size: 38, color: "rgba(99, 102, 241, 0.95)", borderWidth: 2, smoothing: 0.18 },
  invertRing: {
    size: 42,
    color: "rgba(99, 102, 241, 0.95)",
    borderWidth: 2,
    smoothing: 0.18,
    blendMode: "difference",
  },
  magnifier: {
    size: 52,
    color: "rgba(99, 102, 241, 0.95)",
    borderWidth: 2,
    smoothing: 0.18,
    zoom: 1.6,
    lensBlurPx: 6,
    lensBrightness: 1.15,
    lensSaturate: 1.25,
    lensFillOpacity: 0.06,
  },
  trail: { maxDots: 26, color: "rgba(99, 102, 241, 0.65)", size: 6, throttleMs: 16 },
  spotlight: { radius: 150, dimColor: "rgba(0, 0, 0, 0.82)" },
  magnetic: { strength: 0.35, selector: "[data-magnetic]" },
  flame: { emission: 2, size: 10, lifeMs: 700, rise: 1.6, jitter: 0.9, maxDpr: 2 },
  smoke: {
    emission: 2,
    size: 18,
    lifeMs: 1400,
    rise: 0.8,
    drift: 0.7,
    color: "rgba(226,232,240,0.18)",
  },
};

export default function Page() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<Destroyable | null>(null);

  const [effect, setEffect] = useState<EffectName>("ring");
  const [optionsByEffect, setOptionsByEffect] = useState<OptionsByEffect>(defaultOptionsByEffect);
  const options = optionsByEffect[effect];

  const optionsKey = useMemo(() => JSON.stringify(options), [options]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    instanceRef.current?.destroy();
    switch (effect) {
      case "spotlight":
        instanceRef.current = createEffect("spotlight", root, options as SpotlightOptions);
        break;
      case "trail":
        instanceRef.current = createEffect("trail", root, options as TrailOptions);
        break;
      case "magnetic":
        instanceRef.current = createEffect("magnetic", root, options as MagneticOptions);
        break;
      case "ring":
        instanceRef.current = createEffect("ring", root, options as RingOptions);
        break;
      case "magnifier":
        instanceRef.current = createEffect("magnifier", root, options as MagnifierOptions);
        break;
      case "invertRing":
        instanceRef.current = createEffect("invertRing", root, options as InvertRingOptions);
        break;
      case "flame":
        instanceRef.current = createEffect("flame", root, options as FlameOptions);
        break;
      case "smoke":
        instanceRef.current = createEffect("smoke", root, options as SmokeOptions);
        break;
      default: {
        const _never: never = effect;
        throw new Error(`Unknown effect: ${_never}`);
      }
    }

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect, optionsKey]);

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      {/* background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_15%_10%,rgba(99,102,241,0.20),transparent_45%),radial-gradient(900px_circle_at_80%_20%,rgba(236,72,153,0.18),transparent_48%),radial-gradient(900px_circle_at_40%_90%,rgba(14,165,233,0.14),transparent_55%)] dark:bg-[radial-gradient(1200px_circle_at_15%_10%,rgba(99,102,241,0.25),transparent_45%),radial-gradient(900px_circle_at_80%_20%,rgba(236,72,153,0.22),transparent_48%),radial-gradient(900px_circle_at_40%_90%,rgba(14,165,233,0.18),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.55] bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-size-[48px_48px] dark:opacity-[0.35] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)]" />
        <div className="absolute inset-0 bg-linear-to-b from-white/50 via-white/20 to-white/70 dark:from-black/30 dark:via-black/10 dark:to-black/40" />
      </div>

      <SiteNav />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-4">
            <MagicCursorSidebar
              effect={effect}
              setEffect={setEffect}
              optionsByEffect={optionsByEffect}
              setOptionsByEffect={setOptionsByEffect}
              defaultOptionsByEffect={defaultOptionsByEffect}
            />
          </section>

          <section className="lg:col-span-8">
            <div
              ref={rootRef}
              className="relative overflow-hidden rounded-[32px] border border-zinc-900/10 bg-white/70 shadow-[0_20px_80px_rgba(0,0,0,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40 dark:shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
              style={{ minHeight: 560 }}
            >
              <div className="pointer-events-none absolute inset-0 opacity-[0.7] [background:radial-gradient(800px_circle_at_40%_30%,rgba(99,102,241,0.22),transparent_55%),radial-gradient(700px_circle_at_75%_60%,rgba(236,72,153,0.16),transparent_55%)]" />

              <div className="relative p-6 sm:p-10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold tracking-tight">
                      预览区域（把鼠标移进来）
                    </div>
                    <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                      当前：<span className="font-mono">{effect}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      data-magnetic
                      className="inline-flex h-10 items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-medium text-white shadow-[0_12px_44px_rgba(0,0,0,0.18)] transition hover:-translate-y-px dark:bg-white dark:text-black dark:shadow-[0_18px_70px_rgba(0,0,0,0.45)]"
                    >
                      data-magnetic 按钮
                    </button>
                    <button
                      type="button"
                      data-magnetic
                      className="inline-flex h-10 items-center justify-center rounded-2xl border border-zinc-900/10 bg-white/80 px-4 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-black/35 dark:text-zinc-100 dark:hover:bg-black/50"
                    >
                      另一个磁吸
                    </button>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-zinc-900/10 bg-white/80 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-black/35 dark:shadow-[0_22px_70px_rgba(0,0,0,0.50)]">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      交互提示
                    </div>
                    <div className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
                      - <span className="font-mono">ring / invertRing / magnifier</span> 会隐藏原生 cursor
                      <br />- <span className="font-mono">magnetic</span> 只对带{" "}
                      <span className="font-mono">data-magnetic</span> 的元素生效
                      <br />- <span className="font-mono">spotlight</span> 会给区域加一层遮罩
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-zinc-900/10 bg-white/80 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-black/35 dark:shadow-[0_22px_70px_rgba(0,0,0,0.50)]">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      试试拖动这张卡片上的滑块
                    </div>
                    <div className="mt-3 grid gap-2">
                      <label className="grid gap-1 text-xs text-zinc-600 dark:text-zinc-300">
                        只是为了制造更多 hover/移动目标
                        <input type="range" min={0} max={100} defaultValue={42} />
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href="https://github.com/chase-si/magic-cursor"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-900/10 bg-white/80 px-3 text-xs font-medium text-zinc-900 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-black/35 dark:text-zinc-100 dark:hover:bg-black/50"
                        >
                          打开仓库
                        </a>
                        <span
                          data-magnetic
                          className="inline-flex h-9 items-center justify-center rounded-xl bg-linear-to-r from-indigo-600 to-fuchsia-600 px-3 text-xs font-medium text-white shadow-[0_14px_50px_rgba(99,102,241,0.25)]"
                        >
                          磁吸标签
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 rounded-[24px] border border-zinc-900/10 bg-white/65 p-5 text-xs text-zinc-600 dark:border-white/10 dark:bg-black/25 dark:text-zinc-300">
                  <div className="font-medium text-zinc-800 dark:text-zinc-100">
                    说明
                  </div>
                  <div className="mt-2 leading-6">
                    这个演示页会在 effect/参数变化时自动调用{" "}
                    <span className="font-mono">destroy()</span>，避免叠加多层 canvas 或事件监听。
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}