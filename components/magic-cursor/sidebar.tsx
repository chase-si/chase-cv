"use client";

import type { Dispatch, SetStateAction } from "react";
import type {
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

import type { EffectOptions, OptionsByEffect } from "@/components/magic-cursor/types";

const effectNames: EffectName[] = [
  "ring",
  "invertRing",
  "magnifier",
  "trail",
  "spotlight",
  "magnetic",
  "flame",
  "smoke",
];

function clampNumber(input: number, min: number, max: number) {
  return Math.min(max, Math.max(min, input));
}

function toNumber(value: string, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

type Props = {
  effect: EffectName;
  setEffect: (next: EffectName) => void;
  optionsByEffect: OptionsByEffect;
  setOptionsByEffect: Dispatch<SetStateAction<OptionsByEffect>>;
  defaultOptionsByEffect: OptionsByEffect;
};

export function MagicCursorSidebar({
  effect,
  setEffect,
  optionsByEffect,
  setOptionsByEffect,
  defaultOptionsByEffect,
}: Props) {
  const options = optionsByEffect[effect];

  return (
    <div className="rounded-[28px] border border-zinc-900/10 bg-white/70 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40 dark:shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Magic Cursor</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            切换不同鼠标效果，并实时调参预览。
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <div className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            效果
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {effectNames.map((name) => {
              const active = name === effect;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setEffect(name)}
                  className={[
                    "inline-flex h-10 items-center justify-center rounded-2xl border px-3 text-sm transition",
                    active
                      ? "border-zinc-950/15 bg-zinc-950 text-white shadow-sm dark:border-white/20 dark:bg-white dark:text-black"
                      : "border-zinc-900/10 bg-white/70 text-zinc-900 hover:bg-white dark:border-white/10 dark:bg-black/30 dark:text-zinc-100 dark:hover:bg-black/45",
                  ].join(" ")}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-900/10 bg-white/70 p-4 dark:border-white/10 dark:bg-black/30">
          <div className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            参数
          </div>

          {effect === "spotlight" && (
            <div className="mt-3 grid gap-3">
              <label className="grid gap-1 text-sm">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  radius ({(options as SpotlightOptions).radius ?? 0}px)
                </span>
                <input
                  type="range"
                  min={60}
                  max={260}
                  step={1}
                  value={(options as SpotlightOptions).radius ?? 140}
                  onChange={(e) =>
                    setOptionsByEffect((prev) => ({
                      ...prev,
                      spotlight: {
                        ...(prev.spotlight as SpotlightOptions),
                        radius: toNumber(e.target.value, 140),
                      },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  dimColor (rgba)
                </span>
                <input
                  className="h-10 rounded-xl border border-zinc-900/10 bg-white/80 px-3 text-sm outline-none focus:border-zinc-900/20 dark:border-white/10 dark:bg-black/40 dark:focus:border-white/20"
                  value={(options as SpotlightOptions).dimColor ?? ""}
                  onChange={(e) =>
                    setOptionsByEffect((prev) => ({
                      ...prev,
                      spotlight: {
                        ...(prev.spotlight as SpotlightOptions),
                        dimColor: e.target.value,
                      },
                    }))
                  }
                />
              </label>
            </div>
          )}

          {effect === "trail" && (
            <div className="mt-3 grid gap-3">
              <label className="grid gap-1 text-sm">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  maxDots ({(options as TrailOptions).maxDots ?? 0})
                </span>
                <input
                  type="range"
                  min={6}
                  max={80}
                  step={1}
                  value={(options as TrailOptions).maxDots ?? 24}
                  onChange={(e) =>
                    setOptionsByEffect((prev) => ({
                      ...prev,
                      trail: {
                        ...(prev.trail as TrailOptions),
                        maxDots: toNumber(e.target.value, 24),
                      },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  size ({(options as TrailOptions).size ?? 0}px)
                </span>
                <input
                  type="range"
                  min={2}
                  max={18}
                  step={1}
                  value={(options as TrailOptions).size ?? 6}
                  onChange={(e) =>
                    setOptionsByEffect((prev) => ({
                      ...prev,
                      trail: {
                        ...(prev.trail as TrailOptions),
                        size: toNumber(e.target.value, 6),
                      },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  throttleMs ({(options as TrailOptions).throttleMs ?? 0}ms)
                </span>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={1}
                  value={(options as TrailOptions).throttleMs ?? 16}
                  onChange={(e) =>
                    setOptionsByEffect((prev) => ({
                      ...prev,
                      trail: {
                        ...(prev.trail as TrailOptions),
                        throttleMs: toNumber(e.target.value, 16),
                      },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  color (rgba)
                </span>
                <input
                  className="h-10 rounded-xl border border-zinc-900/10 bg-white/80 px-3 text-sm outline-none focus:border-zinc-900/20 dark:border-white/10 dark:bg-black/40 dark:focus:border-white/20"
                  value={(options as TrailOptions).color ?? ""}
                  onChange={(e) =>
                    setOptionsByEffect((prev) => ({
                      ...prev,
                      trail: {
                        ...(prev.trail as TrailOptions),
                        color: e.target.value,
                      },
                    }))
                  }
                />
              </label>
            </div>
          )}

          {(effect === "ring" || effect === "invertRing" || effect === "magnifier") && (
            <div className="mt-3 grid gap-3">
              <label className="grid gap-1 text-sm">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  size ({(options as RingOptions).size ?? 0}px)
                </span>
                <input
                  type="range"
                  min={18}
                  max={120}
                  step={1}
                  value={(options as RingOptions).size ?? 36}
                  onChange={(e) =>
                    setOptionsByEffect((prev) => ({
                      ...prev,
                      [effect]: {
                        ...(prev[effect] as RingOptions),
                        size: toNumber(e.target.value, 36),
                      },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  borderWidth ({(options as RingOptions).borderWidth ?? 0}px)
                </span>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={(options as RingOptions).borderWidth ?? 2}
                  onChange={(e) =>
                    setOptionsByEffect((prev) => ({
                      ...prev,
                      [effect]: {
                        ...(prev[effect] as RingOptions),
                        borderWidth: toNumber(e.target.value, 2),
                      },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  smoothing ({(options as RingOptions).smoothing ?? 0})
                </span>
                <input
                  type="range"
                  min={0.02}
                  max={0.5}
                  step={0.01}
                  value={(options as RingOptions).smoothing ?? 0.18}
                  onChange={(e) =>
                    setOptionsByEffect((prev) => ({
                      ...prev,
                      [effect]: {
                        ...(prev[effect] as RingOptions),
                        smoothing: clampNumber(toNumber(e.target.value, 0.18), 0.02, 0.5),
                      },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  color (rgba)
                </span>
                <input
                  className="h-10 rounded-xl border border-zinc-900/10 bg-white/80 px-3 text-sm outline-none focus:border-zinc-900/20 dark:border-white/10 dark:bg-black/40 dark:focus:border-white/20"
                  value={(options as RingOptions).color ?? ""}
                  onChange={(e) =>
                    setOptionsByEffect((prev) => ({
                      ...prev,
                      [effect]: {
                        ...(prev[effect] as RingOptions),
                        color: e.target.value,
                      },
                    }))
                  }
                />
              </label>

              {effect === "magnifier" && (
                <label className="grid gap-1 text-sm">
                  <span className="text-xs text-zinc-600 dark:text-zinc-300">
                    zoom ({(options as MagnifierOptions).zoom ?? 1})
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={2.6}
                    step={0.05}
                    value={(options as MagnifierOptions).zoom ?? 1.6}
                    onChange={(e) =>
                      setOptionsByEffect((prev) => ({
                        ...prev,
                        magnifier: {
                          ...(prev.magnifier as MagnifierOptions),
                          zoom: clampNumber(toNumber(e.target.value, 1.6), 1, 2.6),
                        },
                      }))
                    }
                  />
                </label>
              )}

              {effect === "invertRing" && (
                <label className="grid gap-1 text-sm">
                  <span className="text-xs text-zinc-600 dark:text-zinc-300">
                    blendMode
                  </span>
                  <select
                    className="h-10 rounded-xl border border-zinc-900/10 bg-white/80 px-3 text-sm outline-none focus:border-zinc-900/20 dark:border-white/10 dark:bg-black/40 dark:focus:border-white/20"
                    value={(options as InvertRingOptions).blendMode ?? "difference"}
                    onChange={(e) =>
                      setOptionsByEffect((prev) => ({
                        ...prev,
                        invertRing: {
                          ...(prev.invertRing as InvertRingOptions),
                          blendMode: e.target.value,
                        },
                      }))
                    }
                  >
                    <option value="difference">difference（默认）</option>
                    <option value="exclusion">exclusion</option>
                    <option value="screen">screen</option>
                    <option value="multiply">multiply</option>
                  </select>
                </label>
              )}
            </div>
          )}

          {effect === "magnetic" && (
            <div className="mt-3 grid gap-3">
              <label className="grid gap-1 text-sm">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  strength ({(options as MagneticOptions).strength ?? 0})
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={(options as MagneticOptions).strength ?? 0.35}
                  onChange={(e) =>
                    setOptionsByEffect((prev) => ({
                      ...prev,
                      magnetic: {
                        ...(prev.magnetic as MagneticOptions),
                        strength: clampNumber(toNumber(e.target.value, 0.35), 0, 1),
                      },
                    }))
                  }
                />
              </label>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                预览区域里带 <code className="font-mono">data-magnetic</code> 的元素会被吸引。
              </div>
            </div>
          )}

          {(effect === "flame" || effect === "smoke") && (
            <div className="mt-3 grid gap-3">
              <label className="grid gap-1 text-sm">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  emission ({(options as FlameOptions | SmokeOptions).emission ?? 0})
                </span>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={(options as FlameOptions | SmokeOptions).emission ?? 2}
                  onChange={(e) =>
                    setOptionsByEffect((prev) => ({
                      ...prev,
                      [effect]: {
                        ...(prev[effect] as FlameOptions | SmokeOptions),
                        emission: toNumber(e.target.value, 2),
                      },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  size ({(options as FlameOptions | SmokeOptions).size ?? 0}px)
                </span>
                <input
                  type="range"
                  min={4}
                  max={40}
                  step={1}
                  value={(options as FlameOptions | SmokeOptions).size ?? 10}
                  onChange={(e) =>
                    setOptionsByEffect((prev) => ({
                      ...prev,
                      [effect]: {
                        ...(prev[effect] as FlameOptions | SmokeOptions),
                        size: toNumber(e.target.value, 10),
                      },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  lifeMs ({(options as FlameOptions | SmokeOptions).lifeMs ?? 0}ms)
                </span>
                <input
                  type="range"
                  min={200}
                  max={2400}
                  step={20}
                  value={(options as FlameOptions | SmokeOptions).lifeMs ?? 700}
                  onChange={(e) =>
                    setOptionsByEffect((prev) => ({
                      ...prev,
                      [effect]: {
                        ...(prev[effect] as FlameOptions | SmokeOptions),
                        lifeMs: toNumber(e.target.value, 700),
                      },
                    }))
                  }
                />
              </label>

              {effect === "smoke" && (
                <>
                  <label className="grid gap-1 text-sm">
                    <span className="text-xs text-zinc-600 dark:text-zinc-300">
                      rise ({(options as SmokeOptions).rise ?? 0})
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={2.4}
                      step={0.05}
                      value={(options as SmokeOptions).rise ?? 0.8}
                      onChange={(e) =>
                        setOptionsByEffect((prev) => ({
                          ...prev,
                          smoke: {
                            ...(prev.smoke as SmokeOptions),
                            rise: clampNumber(toNumber(e.target.value, 0.8), 0, 2.4),
                          },
                        }))
                      }
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="text-xs text-zinc-600 dark:text-zinc-300">
                      drift ({(options as SmokeOptions).drift ?? 0})
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={2}
                      step={0.05}
                      value={(options as SmokeOptions).drift ?? 0.7}
                      onChange={(e) =>
                        setOptionsByEffect((prev) => ({
                          ...prev,
                          smoke: {
                            ...(prev.smoke as SmokeOptions),
                            drift: clampNumber(toNumber(e.target.value, 0.7), 0, 2),
                          },
                        }))
                      }
                    />
                  </label>
                </>
              )}

              {effect === "smoke" && (
                <label className="grid gap-1 text-sm">
                  <span className="text-xs text-zinc-600 dark:text-zinc-300">
                    color (rgba)
                  </span>
                  <input
                    className="h-10 rounded-xl border border-zinc-900/10 bg-white/80 px-3 text-sm outline-none focus:border-zinc-900/20 dark:border-white/10 dark:bg-black/40 dark:focus:border-white/20"
                    value={(options as SmokeOptions).color ?? ""}
                    onChange={(e) =>
                      setOptionsByEffect((prev) => ({
                        ...prev,
                        smoke: {
                          ...(prev.smoke as SmokeOptions),
                          color: e.target.value,
                        },
                      }))
                    }
                  />
                </label>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-950 px-5 text-sm font-medium text-white shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition hover:-translate-y-px hover:shadow-[0_22px_70px_rgba(0,0,0,0.28)] dark:bg-white dark:text-black dark:shadow-[0_22px_80px_rgba(0,0,0,0.45)]"
          onClick={() =>
            setOptionsByEffect((prev) => ({
              ...prev,
              [effect]: defaultOptionsByEffect[effect] as EffectOptions,
            }))
          }
        >
          重置为默认参数
        </button>
      </div>
    </div>
  );
}

