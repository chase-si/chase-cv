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

import type { EffectOptions, OptionsByEffect } from "@/components/magic-cursor/types";
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
    <Card className="border-border/80 bg-card/80 shadow-lg backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle>Magic Cursor</CardTitle>
        <CardDescription>切换不同鼠标效果，并实时调参预览。</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 pt-0">
        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground">效果</Label>
          <div className="grid grid-cols-2 gap-2">
            {effectNames.map((name) => {
              const active = name === effect;
              return (
                <Button
                  key={name}
                  type="button"
                  variant={active ? "default" : "outline"}
                  size="lg"
                  className="h-10 rounded-2xl font-normal"
                  onClick={() => setEffect(name)}
                >
                  {name}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-muted/30 p-4">
          <Label className="text-xs text-muted-foreground">参数</Label>

          {effect === "spotlight" && (
            <div className="mt-3 grid gap-3">
              <SliderField
                label={`radius (${(options as SpotlightOptions).radius ?? 0}px)`}
                min={60}
                max={260}
                step={1}
                value={(options as SpotlightOptions).radius ?? 140}
                onChange={(radius) =>
                  setOptionsByEffect((prev) => ({
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
                <Input
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
              </div>
            </div>
          )}

          {effect === "trail" && (
            <div className="mt-3 grid gap-3">
              <SliderField
                label={`maxDots (${(options as TrailOptions).maxDots ?? 0})`}
                min={6}
                max={80}
                step={1}
                value={(options as TrailOptions).maxDots ?? 24}
                onChange={(maxDots) =>
                  setOptionsByEffect((prev) => ({
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
                max={18}
                step={1}
                value={(options as TrailOptions).size ?? 6}
                onChange={(size) =>
                  setOptionsByEffect((prev) => ({
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
                  setOptionsByEffect((prev) => ({
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
                <Input
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
                  setOptionsByEffect((prev) => ({
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
                min={1}
                max={8}
                step={1}
                value={(options as RingOptions).borderWidth ?? 2}
                onChange={(borderWidth) =>
                  setOptionsByEffect((prev) => ({
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
                  setOptionsByEffect((prev) => ({
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
                <Input
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
              </div>

              {effect === "magnifier" && (
                <SliderField
                  label={`zoom (${(options as MagnifierOptions).zoom ?? 1})`}
                  min={1}
                  max={2.6}
                  step={0.05}
                  value={(options as MagnifierOptions).zoom ?? 1.6}
                  onChange={(zoom) =>
                    setOptionsByEffect((prev) => ({
                      ...prev,
                      magnifier: {
                        ...(prev.magnifier as MagnifierOptions),
                        zoom: clampNumber(zoom, 1, 2.6),
                      },
                    }))
                  }
                />
              )}

              {effect === "invertRing" && (
                <div className="grid gap-2">
                  <Label className="text-xs font-normal text-muted-foreground">
                    blendMode
                  </Label>
                  <Select
                    value={(options as InvertRingOptions).blendMode ?? "difference"}
                    onValueChange={(blendMode) =>
                      setOptionsByEffect((prev) => ({
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
                      <SelectItem value="difference">difference（默认）</SelectItem>
                      <SelectItem value="exclusion">exclusion</SelectItem>
                      <SelectItem value="screen">screen</SelectItem>
                      <SelectItem value="multiply">multiply</SelectItem>
                    </SelectContent>
                  </Select>
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
                  setOptionsByEffect((prev) => ({
                    ...prev,
                    magnetic: {
                      ...(prev.magnetic as MagneticOptions),
                      strength: clampNumber(strength, 0, 1),
                    },
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                预览区域里带 <code className="font-mono text-foreground">data-magnetic</code>{" "}
                的元素会被吸引。
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
                  setOptionsByEffect((prev) => ({
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
                  setOptionsByEffect((prev) => ({
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
                  setOptionsByEffect((prev) => ({
                    ...prev,
                    [effect]: {
                      ...(prev[effect] as FlameOptions | SmokeOptions),
                      lifeMs,
                    },
                  }))
                }
              />

              {effect === "smoke" && (
                <>
                  <SliderField
                    label={`rise (${(options as SmokeOptions).rise ?? 0})`}
                    min={0}
                    max={2.4}
                    step={0.05}
                    value={(options as SmokeOptions).rise ?? 0.8}
                    onChange={(rise) =>
                      setOptionsByEffect((prev) => ({
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
                      setOptionsByEffect((prev) => ({
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
                  <Input
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
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          type="button"
          size="lg"
          className="h-11 rounded-2xl"
          onClick={() =>
            setOptionsByEffect((prev) => ({
              ...prev,
              [effect]: defaultOptionsByEffect[effect] as EffectOptions,
            }))
          }
        >
          重置为默认参数
        </Button>
      </CardContent>
    </Card>
  );
}
