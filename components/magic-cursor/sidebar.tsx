"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
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
import { useRouter } from "next/navigation";

import type { EffectOptions, OptionsByEffect } from "@/components/magic-cursor/types";
import {
  INVERT_RING_BLEND_MODE_OPTIONS,
  MAGIC_CURSOR_EFFECT_ORDER,
} from "@/lib/constants/magic-cursor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ColorPicker } from "@/components/ui/color-picker";

function clampNumber(input: number, min: number, max: number) {
  return Math.min(max, Math.max(min, input));
}

function invertRingBlendModeSelectValue(options: InvertRingOptions): string {
  const raw = options.blendMode ?? "difference";
  return INVERT_RING_BLEND_MODE_OPTIONS.some((o) => o.value === raw) ? raw : "difference";
}

type SliderFieldProps = {
  label: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (next: number) => void;
};

function SliderField({ label, min, max, step, value, onChange }: SliderFieldProps) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs font-normal text-muted-foreground">{label}</Label>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(v) => onChange(typeof v === "number" ? v : v[0] ?? value)}
      />
    </div>
  );
}

type AllProps = {
  activeEffect: null;
};

type DetailProps = {
  activeEffect: EffectName;
  optionsByEffect: OptionsByEffect;
  setOptionsByEffect: Dispatch<SetStateAction<OptionsByEffect>>;
  defaultOptionsByEffect: OptionsByEffect;
};

type Props = AllProps | DetailProps;

export function MagicCursorSidebar(props: Props) {
  const router = useRouter();
  const effect = props.activeEffect;
  const options = effect ? props.optionsByEffect[effect] : null;

  return (
    <Card className="border-border/80 bg-card/80 shadow-lg backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle>Magic Cursor</CardTitle>
        <CardDescription>切换不同鼠标效果，并实时调参预览。</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 pt-0">
        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground">效果</Label>
          <Button
            variant={effect === null ? "default" : "outline"}
            size="lg"
            className={effect === null ? "shadow-sm border-none" : "shadow-sm"}
            onClick={() => router.push("/magic-cursor")}
          >
            All
          </Button>
          <div className="grid grid-cols-2 gap-2">
            {MAGIC_CURSOR_EFFECT_ORDER.map((name) => {
              const active = name === effect;
              return (
                <Button
                  key={name}
                  type="button"
                  variant={active ? "default" : "outline"}
                  size="lg"
                  className={active ? "shadow-sm border-none" : "shadow-sm"}
                  onClick={() => router.push(`/magic-cursor/${name}`)}
                >
                  {name}
                </Button>
              );
            })}
          </div>
        </div>

        {effect !== null && (
          <div className="rounded-3xl border border-border bg-muted/30 p-4">
            <Label className="text-xs text-muted-foreground">参数</Label>

            {effect === "spotlight" && (
              <div className="mt-3 grid gap-3">
                <SliderField
                  label={`radius (${(options as SpotlightOptions).radius ?? 0}px)`}
                  min={10}
                  max={260}
                  step={1}
                  value={(options as SpotlightOptions).radius ?? 140}
                  onChange={(radius) =>
                    props.setOptionsByEffect((prev) => ({
                      ...prev,
                      spotlight: {
                        ...(prev.spotlight as SpotlightOptions),
                        radius,
                      },
                    }))
                  }
                />
                <div className="grid gap-2">
                  <Label className="text-xs font-normal text-muted-foreground">
                    dimColor (rgba)
                  </Label>
                  <ColorPicker
                    value={(options as SpotlightOptions).dimColor ?? ""}
                    allowEmpty
                    onChange={(e) =>
                      props.setOptionsByEffect((prev) => ({
                        ...prev,
                        spotlight: {
                          ...(prev.spotlight as SpotlightOptions),
                          dimColor: e,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {effect === "trail" && (
              <div className="mt-3 grid gap-3">
                <SliderField
                  label={`maxDots (${(options as TrailOptions).maxDots ?? 0})`}
                  min={6}
                  max={2000}
                  step={1}
                  value={(options as TrailOptions).maxDots ?? 24}
                  onChange={(maxDots) =>
                    props.setOptionsByEffect((prev) => ({
                      ...prev,
                      trail: {
                        ...(prev.trail as TrailOptions),
                        maxDots,
                      },
                    }))
                  }
                />
                <SliderField
                  label={`size (${(options as TrailOptions).size ?? 0}px)`}
                  min={2}
                  max={180}
                  step={1}
                  value={(options as TrailOptions).size ?? 6}
                  onChange={(size) =>
                    props.setOptionsByEffect((prev) => ({
                      ...prev,
                      trail: {
                        ...(prev.trail as TrailOptions),
                        size,
                      },
                    }))
                  }
                />
                <SliderField
                  label={`throttleMs (${(options as TrailOptions).throttleMs ?? 0}ms)`}
                  min={0}
                  max={40}
                  step={1}
                  value={(options as TrailOptions).throttleMs ?? 16}
                  onChange={(throttleMs) =>
                    props.setOptionsByEffect((prev) => ({
                      ...prev,
                      trail: {
                        ...(prev.trail as TrailOptions),
                        throttleMs,
                      },
                    }))
                  }
                />
                <div className="grid gap-2">
                  <Label className="text-xs font-normal text-muted-foreground">
                    color (rgba)
                  </Label>
                  <ColorPicker
                    value={(options as TrailOptions).color ?? ""}
                    allowEmpty
                    onChange={(e) =>
                      props.setOptionsByEffect((prev) => ({
                        ...prev,
                        trail: {
                          ...(prev.trail as TrailOptions),
                          color: e,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {(effect === "ring" || effect === "invertRing" || effect === "magnifier") && (
              <div className="mt-3 grid gap-3">
                <SliderField
                  label={`size (${(options as RingOptions).size ?? 0}px)`}
                  min={18}
                  max={120}
                  step={1}
                  value={(options as RingOptions).size ?? 36}
                  onChange={(size) =>
                    props.setOptionsByEffect((prev) => ({
                      ...prev,
                      [effect]: {
                        ...(prev[effect] as RingOptions),
                        size,
                      },
                    }))
                  }
                />
                <SliderField
                  label={`borderWidth (${(options as RingOptions).borderWidth ?? 0}px)`}
                  min={effect === "invertRing" ? 0 : 1}
                  max={8}
                  step={1}
                  value={(options as RingOptions).borderWidth ?? 2}
                  onChange={(borderWidth) =>
                    props.setOptionsByEffect((prev) => ({
                      ...prev,
                      [effect]: {
                        ...(prev[effect] as RingOptions),
                        borderWidth,
                      },
                    }))
                  }
                />
                <SliderField
                  label={`smoothing (${(options as RingOptions).smoothing ?? 0})`}
                  min={0.02}
                  max={0.5}
                  step={0.01}
                  value={(options as RingOptions).smoothing ?? 0.18}
                  onChange={(smoothing) =>
                    props.setOptionsByEffect((prev) => ({
                      ...prev,
                      [effect]: {
                        ...(prev[effect] as RingOptions),
                        smoothing: clampNumber(smoothing, 0.02, 0.5),
                      },
                    }))
                  }
                />
                <div className="grid gap-2">
                  <Label className="text-xs font-normal text-muted-foreground">
                    color (rgba)
                  </Label>
                  <ColorPicker
                    value={(options as RingOptions).color ?? ""}
                    allowEmpty
                    onChange={(e) =>
                      props.setOptionsByEffect((prev) => ({
                        ...prev,
                        [effect]: {
                          ...(prev[effect] as RingOptions),
                          color: e,
                        },
                      }))
                    }
                  />
                </div>

                {effect === "magnifier" && (
                  <>
                    <SliderField
                      label={`zoom (${(options as MagnifierOptions).zoom ?? 1})`}
                      min={1}
                      max={2.6}
                      step={0.05}
                      value={(options as MagnifierOptions).zoom ?? 1.6}
                      onChange={(zoom) =>
                        props.setOptionsByEffect((prev) => ({
                          ...prev,
                          magnifier: {
                            ...(prev.magnifier as MagnifierOptions),
                            zoom: clampNumber(zoom, 1, 2.6),
                          },
                        }))
                      }
                    />
                    <SliderField
                      label={`lensBlurPx (${(options as MagnifierOptions).lensBlurPx ?? 0})`}
                      min={0}
                      max={24}
                      step={1}
                      value={(options as MagnifierOptions).lensBlurPx ?? 6}
                      onChange={(lensBlurPx) =>
                        props.setOptionsByEffect((prev) => ({
                          ...prev,
                          magnifier: {
                            ...(prev.magnifier as MagnifierOptions),
                            lensBlurPx: clampNumber(lensBlurPx, 0, 24),
                          },
                        }))
                      }
                    />
                    <SliderField
                      label={`lensBrightness (${(options as MagnifierOptions).lensBrightness ?? 1})`}
                      min={0.5}
                      max={2}
                      step={0.05}
                      value={(options as MagnifierOptions).lensBrightness ?? 1.15}
                      onChange={(lensBrightness) =>
                        props.setOptionsByEffect((prev) => ({
                          ...prev,
                          magnifier: {
                            ...(prev.magnifier as MagnifierOptions),
                            lensBrightness: clampNumber(lensBrightness, 0.5, 2),
                          },
                        }))
                      }
                    />
                    <SliderField
                      label={`lensSaturate (${(options as MagnifierOptions).lensSaturate ?? 1})`}
                      min={0}
                      max={2.5}
                      step={0.05}
                      value={(options as MagnifierOptions).lensSaturate ?? 1.25}
                      onChange={(lensSaturate) =>
                        props.setOptionsByEffect((prev) => ({
                          ...prev,
                          magnifier: {
                            ...(prev.magnifier as MagnifierOptions),
                            lensSaturate: clampNumber(lensSaturate, 0, 2.5),
                          },
                        }))
                      }
                    />
                    <SliderField
                      label={`lensFillOpacity (${(options as MagnifierOptions).lensFillOpacity ?? 0})`}
                      min={0}
                      max={0.35}
                      step={0.01}
                      value={(options as MagnifierOptions).lensFillOpacity ?? 0.06}
                      onChange={(lensFillOpacity) =>
                        props.setOptionsByEffect((prev) => ({
                          ...prev,
                          magnifier: {
                            ...(prev.magnifier as MagnifierOptions),
                            lensFillOpacity: clampNumber(lensFillOpacity, 0, 0.35),
                          },
                        }))
                      }
                    />
                  </>
                )}

                {effect === "invertRing" && (
                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <Label className="text-xs font-normal text-muted-foreground">
                        blendMode（mix-blend-mode）
                      </Label>
                      <Select
                        value={invertRingBlendModeSelectValue(options as InvertRingOptions)}
                        onValueChange={(blendMode) =>
                          props.setOptionsByEffect((prev) => ({
                            ...prev,
                            invertRing: {
                              ...(prev.invertRing as InvertRingOptions),
                              blendMode,
                            },
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INVERT_RING_BLEND_MODE_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs font-normal text-muted-foreground">
                        blendBackground（可选，rgba / 留空用库默认）
                      </Label>
                      <Input
                        value={(options as InvertRingOptions).blendBackground ?? ""}
                        placeholder="例如 rgba(255,255,255,0.9)"
                        onChange={(e) => {
                          const v = e.target.value.trim();
                          props.setOptionsByEffect((prev) => ({
                            ...prev,
                            invertRing: {
                              ...(prev.invertRing as InvertRingOptions),
                              blendBackground: v === "" ? undefined : e.target.value,
                            },
                          }));
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {effect === "magnetic" && (
              <div className="mt-3 grid gap-3">
                <SliderField
                  label={`strength (${(options as MagneticOptions).strength ?? 0})`}
                  min={0}
                  max={1}
                  step={0.01}
                  value={(options as MagneticOptions).strength ?? 0.35}
                  onChange={(strength) =>
                    props.setOptionsByEffect((prev) => ({
                      ...prev,
                      magnetic: {
                        ...(prev.magnetic as MagneticOptions),
                        strength: clampNumber(strength, 0, 1),
                      },
                    }))
                  }
                />
                <div className="grid gap-2">
                  <Label className="text-xs font-normal text-muted-foreground">
                    selector（CSS 选择器）
                  </Label>
                  <Input
                    value={(options as MagneticOptions).selector ?? "[data-magnetic]"}
                    onChange={(e) =>
                      props.setOptionsByEffect((prev) => ({
                        ...prev,
                        magnetic: {
                          ...(prev.magnetic as MagneticOptions),
                          selector: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  预览区域里匹配该选择器的元素会被吸引；默认{" "}
                  <code className="font-mono text-foreground">[data-magnetic]</code>。
                </p>
              </div>
            )}

            {(effect === "flame" || effect === "smoke") && (
              <div className="mt-3 grid gap-3">
                <SliderField
                  label={`emission (${(options as FlameOptions | SmokeOptions).emission ?? 0})`}
                  min={1}
                  max={8}
                  step={1}
                  value={(options as FlameOptions | SmokeOptions).emission ?? 2}
                  onChange={(emission) =>
                    props.setOptionsByEffect((prev) => ({
                      ...prev,
                      [effect]: {
                        ...(prev[effect] as FlameOptions | SmokeOptions),
                        emission,
                      },
                    }))
                  }
                />
                <SliderField
                  label={`size (${(options as FlameOptions | SmokeOptions).size ?? 0}px)`}
                  min={4}
                  max={40}
                  step={1}
                  value={(options as FlameOptions | SmokeOptions).size ?? 10}
                  onChange={(size) =>
                    props.setOptionsByEffect((prev) => ({
                      ...prev,
                      [effect]: {
                        ...(prev[effect] as FlameOptions | SmokeOptions),
                        size,
                      },
                    }))
                  }
                />
                <SliderField
                  label={`lifeMs (${(options as FlameOptions | SmokeOptions).lifeMs ?? 0}ms)`}
                  min={200}
                  max={2400}
                  step={20}
                  value={(options as FlameOptions | SmokeOptions).lifeMs ?? 700}
                  onChange={(lifeMs) =>
                    props.setOptionsByEffect((prev) => ({
                      ...prev,
                      [effect]: {
                        ...(prev[effect] as FlameOptions | SmokeOptions),
                        lifeMs,
                      },
                    }))
                  }
                />

                {effect === "flame" && (
                  <>
                    <SliderField
                      label={`rise (${(options as FlameOptions).rise ?? 0})`}
                      min={0}
                      max={4}
                      step={0.05}
                      value={(options as FlameOptions).rise ?? 1.6}
                      onChange={(rise) =>
                        props.setOptionsByEffect((prev) => ({
                          ...prev,
                          flame: {
                            ...(prev.flame as FlameOptions),
                            rise: clampNumber(rise, 0, 4),
                          },
                        }))
                      }
                    />
                    <SliderField
                      label={`jitter (${(options as FlameOptions).jitter ?? 0})`}
                      min={0}
                      max={3}
                      step={0.05}
                      value={(options as FlameOptions).jitter ?? 0.9}
                      onChange={(jitter) =>
                        props.setOptionsByEffect((prev) => ({
                          ...prev,
                          flame: {
                            ...(prev.flame as FlameOptions),
                            jitter: clampNumber(jitter, 0, 3),
                          },
                        }))
                      }
                    />
                    <SliderField
                      label={`maxDpr (${(options as FlameOptions).maxDpr ?? 2})`}
                      min={1}
                      max={4}
                      step={0.5}
                      value={(options as FlameOptions).maxDpr ?? 2}
                      onChange={(maxDpr) =>
                        props.setOptionsByEffect((prev) => ({
                          ...prev,
                          flame: {
                            ...(prev.flame as FlameOptions),
                            maxDpr: clampNumber(maxDpr, 1, 4),
                          },
                        }))
                      }
                    />
                  </>
                )}

                {effect === "smoke" && (
                  <>
                    <SliderField
                      label={`rise (${(options as SmokeOptions).rise ?? 0})`}
                      min={0}
                      max={2.4}
                      step={0.05}
                      value={(options as SmokeOptions).rise ?? 0.8}
                      onChange={(rise) =>
                        props.setOptionsByEffect((prev) => ({
                          ...prev,
                          smoke: {
                            ...(prev.smoke as SmokeOptions),
                            rise: clampNumber(rise, 0, 2.4),
                          },
                        }))
                      }
                    />
                    <SliderField
                      label={`drift (${(options as SmokeOptions).drift ?? 0})`}
                      min={0}
                      max={2}
                      step={0.05}
                      value={(options as SmokeOptions).drift ?? 0.7}
                      onChange={(drift) =>
                        props.setOptionsByEffect((prev) => ({
                          ...prev,
                          smoke: {
                            ...(prev.smoke as SmokeOptions),
                            drift: clampNumber(drift, 0, 2),
                          },
                        }))
                      }
                    />
                  </>
                )}

                {effect === "smoke" && (
                  <div className="grid gap-2">
                    <Label className="text-xs font-normal text-muted-foreground">
                      color (rgba)
                    </Label>
                    <ColorPicker
                      value={(options as SmokeOptions).color ?? ""}
                      allowEmpty
                      onChange={(e) =>
                        props.setOptionsByEffect((prev) => ({
                          ...prev,
                          smoke: {
                            ...(prev.smoke as SmokeOptions),
                            color: e,
                          },
                        }))
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {effect !== null && (
          <Button
            type="button"
            size="lg"
            className="h-11 rounded-2xl"
            onClick={() =>
              props.setOptionsByEffect((prev) => ({
                ...prev,
                [effect]: props.defaultOptionsByEffect[effect] as EffectOptions,
              }))
            }
          >
            重置为默认参数
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
