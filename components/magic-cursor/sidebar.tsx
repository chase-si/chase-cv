"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import type {
  EffectName,
  ElectricArcOptions,
  FlameOptions,
  InvertRingOptions,
  MagneticOptions,
  MagnifierOptions,
  RingOptions,
  SmokeOptions,
  SpotlightOptions,
  TrailOptions,
} from "magic-cursor-effect";
import { useTranslations } from "next-intl";

import type { EffectOptions, MagneticEffectOptions, OptionsByEffect } from "@/components/magic-cursor/types";
import { useRouter } from "@/i18n/navigation";
import {
  clampMagicCursorNumber,
  INVERT_RING_BLEND_MODE_OPTIONS,
  MAGIC_CURSOR_EFFECT_ORDER,
  MAGIC_CURSOR_MAGNETIC_SIDEBAR,
  MAGIC_CURSOR_SIDEBAR_BOUNDS,
  resolveInvertRingBlendModeSelectValue,
  ringSmoothingFallbackForEffect,
  ringBorderWidthMinForEffect,
} from "@/lib/magic-cursor/config";
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

function isDetailProps(props: Props): props is DetailProps {
  return props.activeEffect !== null;
}

export function MagicCursorSidebar(props: Props) {
  const router = useRouter();
  const t = useTranslations("magicCursor");
  const effect = props.activeEffect;
  const detail = isDetailProps(props) ? props : null;
  const options = detail ? detail.optionsByEffect[detail.activeEffect] : null;

  return (
    <Card className="border-border/80 bg-card/80 shadow-lg backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle>Magic Cursor</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 pt-0">
        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground">{t("effectLabel")}</Label>
          <Button
            variant={effect === null ? "default" : "outline"}
            size="lg"
            className={effect === null ? "shadow-sm border-none" : "shadow-sm"}
            onClick={() => router.push("/magic-cursor")}
          >
            {t("all")}
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

        {detail && (
          <div className="border border-border bg-muted/30 p-4">
            <Label className="text-xs text-muted-foreground">{t("paramsLabel")}</Label>

            {effect === "spotlight" && (
              <div className="mt-3 grid gap-3">
                <SliderField
                  label={`radius (${(options as SpotlightOptions).radius ?? 0}px)`}
                  min={MAGIC_CURSOR_SIDEBAR_BOUNDS.spotlight.radius.min}
                  max={MAGIC_CURSOR_SIDEBAR_BOUNDS.spotlight.radius.max}
                  step={MAGIC_CURSOR_SIDEBAR_BOUNDS.spotlight.radius.step}
                  value={
                    (options as SpotlightOptions).radius ??
                    MAGIC_CURSOR_SIDEBAR_BOUNDS.spotlight.radius.fallback
                  }
                  onChange={(radius) =>
                    detail.setOptionsByEffect((prev) => ({
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
                      detail.setOptionsByEffect((prev) => ({
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
                  min={MAGIC_CURSOR_SIDEBAR_BOUNDS.trail.maxDots.min}
                  max={MAGIC_CURSOR_SIDEBAR_BOUNDS.trail.maxDots.max}
                  step={MAGIC_CURSOR_SIDEBAR_BOUNDS.trail.maxDots.step}
                  value={
                    (options as TrailOptions).maxDots ??
                    MAGIC_CURSOR_SIDEBAR_BOUNDS.trail.maxDots.fallback
                  }
                  onChange={(maxDots) =>
                    detail.setOptionsByEffect((prev) => ({
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
                  min={MAGIC_CURSOR_SIDEBAR_BOUNDS.trail.size.min}
                  max={MAGIC_CURSOR_SIDEBAR_BOUNDS.trail.size.max}
                  step={MAGIC_CURSOR_SIDEBAR_BOUNDS.trail.size.step}
                  value={
                    (options as TrailOptions).size ?? MAGIC_CURSOR_SIDEBAR_BOUNDS.trail.size.fallback
                  }
                  onChange={(size) =>
                    detail.setOptionsByEffect((prev) => ({
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
                  min={MAGIC_CURSOR_SIDEBAR_BOUNDS.trail.throttleMs.min}
                  max={MAGIC_CURSOR_SIDEBAR_BOUNDS.trail.throttleMs.max}
                  step={MAGIC_CURSOR_SIDEBAR_BOUNDS.trail.throttleMs.step}
                  value={
                    (options as TrailOptions).throttleMs ??
                    MAGIC_CURSOR_SIDEBAR_BOUNDS.trail.throttleMs.fallback
                  }
                  onChange={(throttleMs) =>
                    detail.setOptionsByEffect((prev) => ({
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
                      detail.setOptionsByEffect((prev) => ({
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
                  min={MAGIC_CURSOR_SIDEBAR_BOUNDS.ring.size.min}
                  max={MAGIC_CURSOR_SIDEBAR_BOUNDS.ring.size.max}
                  step={MAGIC_CURSOR_SIDEBAR_BOUNDS.ring.size.step}
                  value={
                    (options as RingOptions).size ?? MAGIC_CURSOR_SIDEBAR_BOUNDS.ring.size.fallback
                  }
                  onChange={(size) =>
                    detail.setOptionsByEffect((prev) => ({
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
                  min={ringBorderWidthMinForEffect(effect)}
                  max={MAGIC_CURSOR_SIDEBAR_BOUNDS.ring.borderWidth.max}
                  step={MAGIC_CURSOR_SIDEBAR_BOUNDS.ring.borderWidth.step}
                  value={
                    (options as RingOptions).borderWidth ??
                    MAGIC_CURSOR_SIDEBAR_BOUNDS.ring.borderWidth.fallback
                  }
                  onChange={(borderWidth) =>
                    detail.setOptionsByEffect((prev) => ({
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
                  min={MAGIC_CURSOR_SIDEBAR_BOUNDS.ring.smoothing.min}
                  max={MAGIC_CURSOR_SIDEBAR_BOUNDS.ring.smoothing.max}
                  step={MAGIC_CURSOR_SIDEBAR_BOUNDS.ring.smoothing.step}
                  value={
                    (options as RingOptions).smoothing ??
                    ringSmoothingFallbackForEffect(effect)
                  }
                  onChange={(smoothing) =>
                    detail.setOptionsByEffect((prev) => ({
                      ...prev,
                      [effect]: {
                        ...(prev[effect] as RingOptions),
                        smoothing: clampMagicCursorNumber(
                          smoothing,
                          MAGIC_CURSOR_SIDEBAR_BOUNDS.ring.smoothing.min,
                          MAGIC_CURSOR_SIDEBAR_BOUNDS.ring.smoothing.max,
                        ),
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
                      detail.setOptionsByEffect((prev) => ({
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
                      min={MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.zoom.min}
                      max={MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.zoom.max}
                      step={MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.zoom.step}
                      value={
                        (options as MagnifierOptions).zoom ??
                        MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.zoom.fallback
                      }
                      onChange={(zoom) =>
                        detail.setOptionsByEffect((prev) => ({
                          ...prev,
                          magnifier: {
                            ...(prev.magnifier as MagnifierOptions),
                            zoom: clampMagicCursorNumber(
                              zoom,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.zoom.min,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.zoom.max,
                            ),
                          },
                        }))
                      }
                    />
                    <SliderField
                      label={`lensBlurPx (${(options as MagnifierOptions).lensBlurPx ?? 0})`}
                      min={MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensBlurPx.min}
                      max={MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensBlurPx.max}
                      step={MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensBlurPx.step}
                      value={
                        (options as MagnifierOptions).lensBlurPx ??
                        MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensBlurPx.fallback
                      }
                      onChange={(lensBlurPx) =>
                        detail.setOptionsByEffect((prev) => ({
                          ...prev,
                          magnifier: {
                            ...(prev.magnifier as MagnifierOptions),
                            lensBlurPx: clampMagicCursorNumber(
                              lensBlurPx,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensBlurPx.min,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensBlurPx.max,
                            ),
                          },
                        }))
                      }
                    />
                    <SliderField
                      label={`lensBrightness (${(options as MagnifierOptions).lensBrightness ?? 1})`}
                      min={MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensBrightness.min}
                      max={MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensBrightness.max}
                      step={MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensBrightness.step}
                      value={
                        (options as MagnifierOptions).lensBrightness ??
                        MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensBrightness.fallback
                      }
                      onChange={(lensBrightness) =>
                        detail.setOptionsByEffect((prev) => ({
                          ...prev,
                          magnifier: {
                            ...(prev.magnifier as MagnifierOptions),
                            lensBrightness: clampMagicCursorNumber(
                              lensBrightness,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensBrightness.min,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensBrightness.max,
                            ),
                          },
                        }))
                      }
                    />
                    <SliderField
                      label={`lensSaturate (${(options as MagnifierOptions).lensSaturate ?? 1})`}
                      min={MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensSaturate.min}
                      max={MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensSaturate.max}
                      step={MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensSaturate.step}
                      value={
                        (options as MagnifierOptions).lensSaturate ??
                        MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensSaturate.fallback
                      }
                      onChange={(lensSaturate) =>
                        detail.setOptionsByEffect((prev) => ({
                          ...prev,
                          magnifier: {
                            ...(prev.magnifier as MagnifierOptions),
                            lensSaturate: clampMagicCursorNumber(
                              lensSaturate,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensSaturate.min,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensSaturate.max,
                            ),
                          },
                        }))
                      }
                    />
                    <SliderField
                      label={`lensFillOpacity (${(options as MagnifierOptions).lensFillOpacity ?? 0})`}
                      min={MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensFillOpacity.min}
                      max={MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensFillOpacity.max}
                      step={MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensFillOpacity.step}
                      value={
                        (options as MagnifierOptions).lensFillOpacity ??
                        MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensFillOpacity.fallback
                      }
                      onChange={(lensFillOpacity) =>
                        detail.setOptionsByEffect((prev) => ({
                          ...prev,
                          magnifier: {
                            ...(prev.magnifier as MagnifierOptions),
                            lensFillOpacity: clampMagicCursorNumber(
                              lensFillOpacity,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensFillOpacity.min,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.magnifier.lensFillOpacity.max,
                            ),
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
                        value={resolveInvertRingBlendModeSelectValue(options as InvertRingOptions)}
                        onValueChange={(blendMode) =>
                          detail.setOptionsByEffect((prev) => ({
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
                        {t("blendBackgroundHelp")}
                      </Label>
                      <ColorPicker
                        value={(options as InvertRingOptions).blendBackground ?? ""}
                        allowEmpty
                        placeholder={t("blendBackgroundPlaceholder")}
                        onChange={(blendBackground) =>
                          detail.setOptionsByEffect((prev) => ({
                            ...prev,
                            invertRing: {
                              ...(prev.invertRing as InvertRingOptions),
                              blendBackground:
                                blendBackground.trim() === "" ? undefined : blendBackground,
                            },
                          }))
                        }
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
                  min={MAGIC_CURSOR_MAGNETIC_SIDEBAR.strength.min}
                  max={MAGIC_CURSOR_MAGNETIC_SIDEBAR.strength.max}
                  step={MAGIC_CURSOR_MAGNETIC_SIDEBAR.strength.step}
                  value={
                    (options as MagneticOptions).strength ??
                    MAGIC_CURSOR_MAGNETIC_SIDEBAR.strength.fallback
                  }
                  onChange={(strength) =>
                    detail.setOptionsByEffect((prev) => ({
                      ...prev,
                      magnetic: {
                        ...(prev.magnetic as MagneticOptions),
                        strength: clampMagicCursorNumber(
                          strength,
                          MAGIC_CURSOR_MAGNETIC_SIDEBAR.strength.min,
                          MAGIC_CURSOR_MAGNETIC_SIDEBAR.strength.max,
                        ),
                      },
                    }))
                  }
                />
                <div className="grid gap-2">
                  <Label className="text-xs font-normal text-muted-foreground">
                    {t("selectorLabel")}
                  </Label>
                  <Input
                    value={
                      (options as MagneticOptions).selector ??
                      MAGIC_CURSOR_MAGNETIC_SIDEBAR.defaultSelector
                    }
                    onChange={(e) =>
                      detail.setOptionsByEffect((prev) => ({
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
                  {t("magneticHelp")}{" "}
                  <code className="font-mono text-foreground">
                    {MAGIC_CURSOR_MAGNETIC_SIDEBAR.defaultSelector}
                  </code>
                  。
                </p>
                <div className="grid gap-2">
                  <Label className="text-xs font-normal text-muted-foreground">
                    {t("itemColorLabel")}
                  </Label>
                  <ColorPicker
                    value={(options as MagneticEffectOptions).itemColor ?? ""}
                    allowEmpty
                    placeholder={t("itemColorPlaceholder")}
                    onChange={(itemColor) =>
                      detail.setOptionsByEffect((prev) => ({
                        ...prev,
                        magnetic: {
                          ...(prev.magnetic as MagneticEffectOptions),
                          itemColor,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {(effect === "flame" || effect === "smoke") && (
              <div className="mt-3 grid gap-3">
                <SliderField
                  label={`emission (${(options as FlameOptions | SmokeOptions).emission ?? 0})`}
                  min={MAGIC_CURSOR_SIDEBAR_BOUNDS.flameSmoke.emission.min}
                  max={MAGIC_CURSOR_SIDEBAR_BOUNDS.flameSmoke.emission.max}
                  step={MAGIC_CURSOR_SIDEBAR_BOUNDS.flameSmoke.emission.step}
                  value={
                    (options as FlameOptions | SmokeOptions).emission ??
                    MAGIC_CURSOR_SIDEBAR_BOUNDS.flameSmoke.emission.fallback
                  }
                  onChange={(emission) =>
                    detail.setOptionsByEffect((prev) => ({
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
                  min={MAGIC_CURSOR_SIDEBAR_BOUNDS.flameSmoke.size.min}
                  max={MAGIC_CURSOR_SIDEBAR_BOUNDS.flameSmoke.size.max}
                  step={MAGIC_CURSOR_SIDEBAR_BOUNDS.flameSmoke.size.step}
                  value={
                    (options as FlameOptions | SmokeOptions).size ??
                    MAGIC_CURSOR_SIDEBAR_BOUNDS.flameSmoke.size.fallback
                  }
                  onChange={(size) =>
                    detail.setOptionsByEffect((prev) => ({
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
                  min={MAGIC_CURSOR_SIDEBAR_BOUNDS.flameSmoke.lifeMs.min}
                  max={MAGIC_CURSOR_SIDEBAR_BOUNDS.flameSmoke.lifeMs.max}
                  step={MAGIC_CURSOR_SIDEBAR_BOUNDS.flameSmoke.lifeMs.step}
                  value={
                    (options as FlameOptions | SmokeOptions).lifeMs ??
                    MAGIC_CURSOR_SIDEBAR_BOUNDS.flameSmoke.lifeMs.fallback
                  }
                  onChange={(lifeMs) =>
                    detail.setOptionsByEffect((prev) => ({
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
                      min={MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.rise.min}
                      max={MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.rise.max}
                      step={MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.rise.step}
                      value={
                        (options as FlameOptions).rise ??
                        MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.rise.fallback
                      }
                      onChange={(rise) =>
                        detail.setOptionsByEffect((prev) => ({
                          ...prev,
                          flame: {
                            ...(prev.flame as FlameOptions),
                            rise: clampMagicCursorNumber(
                              rise,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.rise.min,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.rise.max,
                            ),
                          },
                        }))
                      }
                    />
                    <SliderField
                      label={`jitter (${(options as FlameOptions).jitter ?? 0})`}
                      min={MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.jitter.min}
                      max={MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.jitter.max}
                      step={MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.jitter.step}
                      value={
                        (options as FlameOptions).jitter ??
                        MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.jitter.fallback
                      }
                      onChange={(jitter) =>
                        detail.setOptionsByEffect((prev) => ({
                          ...prev,
                          flame: {
                            ...(prev.flame as FlameOptions),
                            jitter: clampMagicCursorNumber(
                              jitter,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.jitter.min,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.jitter.max,
                            ),
                          },
                        }))
                      }
                    />
                    <SliderField
                      label={`maxDpr (${(options as FlameOptions).maxDpr ?? 2})`}
                      min={MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.maxDpr.min}
                      max={MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.maxDpr.max}
                      step={MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.maxDpr.step}
                      value={
                        (options as FlameOptions).maxDpr ??
                        MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.maxDpr.fallback
                      }
                      onChange={(maxDpr) =>
                        detail.setOptionsByEffect((prev) => ({
                          ...prev,
                          flame: {
                            ...(prev.flame as FlameOptions),
                            maxDpr: clampMagicCursorNumber(
                              maxDpr,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.maxDpr.min,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.flame.maxDpr.max,
                            ),
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
                      min={MAGIC_CURSOR_SIDEBAR_BOUNDS.smoke.rise.min}
                      max={MAGIC_CURSOR_SIDEBAR_BOUNDS.smoke.rise.max}
                      step={MAGIC_CURSOR_SIDEBAR_BOUNDS.smoke.rise.step}
                      value={
                        (options as SmokeOptions).rise ??
                        MAGIC_CURSOR_SIDEBAR_BOUNDS.smoke.rise.fallback
                      }
                      onChange={(rise) =>
                        detail.setOptionsByEffect((prev) => ({
                          ...prev,
                          smoke: {
                            ...(prev.smoke as SmokeOptions),
                            rise: clampMagicCursorNumber(
                              rise,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.smoke.rise.min,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.smoke.rise.max,
                            ),
                          },
                        }))
                      }
                    />
                    <SliderField
                      label={`drift (${(options as SmokeOptions).drift ?? 0})`}
                      min={MAGIC_CURSOR_SIDEBAR_BOUNDS.smoke.drift.min}
                      max={MAGIC_CURSOR_SIDEBAR_BOUNDS.smoke.drift.max}
                      step={MAGIC_CURSOR_SIDEBAR_BOUNDS.smoke.drift.step}
                      value={
                        (options as SmokeOptions).drift ??
                        MAGIC_CURSOR_SIDEBAR_BOUNDS.smoke.drift.fallback
                      }
                      onChange={(drift) =>
                        detail.setOptionsByEffect((prev) => ({
                          ...prev,
                          smoke: {
                            ...(prev.smoke as SmokeOptions),
                            drift: clampMagicCursorNumber(
                              drift,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.smoke.drift.min,
                              MAGIC_CURSOR_SIDEBAR_BOUNDS.smoke.drift.max,
                            ),
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
                        detail.setOptionsByEffect((prev) => ({
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

            {effect === "electricArc" && (
              <div className="mt-3 grid gap-3">
                <SliderField
                  label={`emission (${(options as ElectricArcOptions).emission ?? 0})`}
                  min={MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.emission.min}
                  max={MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.emission.max}
                  step={MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.emission.step}
                  value={
                    (options as ElectricArcOptions).emission ??
                    MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.emission.fallback
                  }
                  onChange={(emission) =>
                    detail.setOptionsByEffect((prev) => ({
                      ...prev,
                      electricArc: {
                        ...(prev.electricArc as ElectricArcOptions),
                        emission,
                      },
                    }))
                  }
                />
                <SliderField
                  label={`length (${(options as ElectricArcOptions).length ?? 0}px)`}
                  min={MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.length.min}
                  max={MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.length.max}
                  step={MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.length.step}
                  value={
                    (options as ElectricArcOptions).length ??
                    MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.length.fallback
                  }
                  onChange={(length) =>
                    detail.setOptionsByEffect((prev) => ({
                      ...prev,
                      electricArc: {
                        ...(prev.electricArc as ElectricArcOptions),
                        length,
                      },
                    }))
                  }
                />
                <SliderField
                  label={`radius (${(options as ElectricArcOptions).radius ?? 0}px)`}
                  min={MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.radius.min}
                  max={MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.radius.max}
                  step={MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.radius.step}
                  value={
                    (options as ElectricArcOptions).radius ??
                    MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.radius.fallback
                  }
                  onChange={(radius) =>
                    detail.setOptionsByEffect((prev) => ({
                      ...prev,
                      electricArc: {
                        ...(prev.electricArc as ElectricArcOptions),
                        radius,
                      },
                    }))
                  }
                />
                <SliderField
                  label={`lifeMs (${(options as ElectricArcOptions).lifeMs ?? 0}ms)`}
                  min={MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.lifeMs.min}
                  max={MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.lifeMs.max}
                  step={MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.lifeMs.step}
                  value={
                    (options as ElectricArcOptions).lifeMs ??
                    MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.lifeMs.fallback
                  }
                  onChange={(lifeMs) =>
                    detail.setOptionsByEffect((prev) => ({
                      ...prev,
                      electricArc: {
                        ...(prev.electricArc as ElectricArcOptions),
                        lifeMs,
                      },
                    }))
                  }
                />
                <SliderField
                  label={`clickBurst (${(options as ElectricArcOptions).clickBurst ?? 0})`}
                  min={MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.clickBurst.min}
                  max={MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.clickBurst.max}
                  step={MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.clickBurst.step}
                  value={
                    (options as ElectricArcOptions).clickBurst ??
                    MAGIC_CURSOR_SIDEBAR_BOUNDS.electricArc.clickBurst.fallback
                  }
                  onChange={(clickBurst) =>
                    detail.setOptionsByEffect((prev) => ({
                      ...prev,
                      electricArc: {
                        ...(prev.electricArc as ElectricArcOptions),
                        clickBurst,
                      },
                    }))
                  }
                />
                <div className="grid gap-2">
                  <Label className="text-xs font-normal text-muted-foreground">
                    color (rgba)
                  </Label>
                  <ColorPicker
                    value={(options as ElectricArcOptions).color ?? ""}
                    allowEmpty
                    onChange={(color) =>
                      detail.setOptionsByEffect((prev) => ({
                        ...prev,
                        electricArc: {
                          ...(prev.electricArc as ElectricArcOptions),
                          color,
                        },
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-normal text-muted-foreground">
                    glowColor (rgba)
                  </Label>
                  <ColorPicker
                    value={(options as ElectricArcOptions).glowColor ?? ""}
                    allowEmpty
                    onChange={(glowColor) =>
                      detail.setOptionsByEffect((prev) => ({
                        ...prev,
                        electricArc: {
                          ...(prev.electricArc as ElectricArcOptions),
                          glowColor,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {detail && (
          <Button
            type="button"
            size="lg"
            className="h-11 rounded-none"
            onClick={() =>
              detail.setOptionsByEffect((prev) => ({
                ...prev,
                [detail.activeEffect]: detail.defaultOptionsByEffect[
                  detail.activeEffect
                ] as EffectOptions,
              }))
            }
          >
            {t("reset")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
