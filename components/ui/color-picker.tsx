import { useId, useMemo } from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type Rgba = { r: number; g: number; b: number; a: number };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round(n: number) {
  return Math.round(n);
}

function toHexByte(n: number) {
  return clamp(round(n), 0, 255).toString(16).padStart(2, "0");
}

function rgbToHex({ r, g, b }: Pick<Rgba, "r" | "g" | "b">) {
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}

function parseHex(input: string): Pick<Rgba, "r" | "g" | "b"> | null {
  const s = input.trim().toLowerCase();
  if (!s.startsWith("#")) return null;
  const hex = s.slice(1);
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    if ([r, g, b].some((v) => Number.isNaN(v))) return null;
    return { r, g, b };
  }
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if ([r, g, b].some((v) => Number.isNaN(v))) return null;
    return { r, g, b };
  }
  return null;
}

function parseRgba(input: string): Rgba | null {
  const s = input.trim().toLowerCase();
  const m = s.match(
    /^rgba?\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*(?:,\s*([+-]?\d+(?:\.\d+)?))?\s*\)$/,
  );
  if (!m) return null;
  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);
  const aRaw = m[4] === undefined ? 1 : Number(m[4]);
  if ([r, g, b, aRaw].some((v) => Number.isNaN(v))) return null;
  return {
    r: clamp(r, 0, 255),
    g: clamp(g, 0, 255),
    b: clamp(b, 0, 255),
    a: clamp(aRaw, 0, 1),
  };
}

function formatRgba({ r, g, b, a }: Rgba) {
  return `rgba(${round(r)}, ${round(g)}, ${round(b)}, ${Math.round(clamp(a, 0, 1) * 100) / 100})`;
}

function deriveFromValue(value: string | undefined | null): Rgba {
  const v = (value ?? "").trim();
  const rgba = parseRgba(v);
  if (rgba) return rgba;
  const rgb = parseHex(v);
  if (rgb) return { ...rgb, a: 1 };
  return { r: 99, g: 102, b: 241, a: 1 };
}

export type ColorPickerProps = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
  /** 若传 true，会允许清空值（输出空字符串） */
  allowEmpty?: boolean;
};

export function ColorPicker({
  value,
  onChange,
  placeholder = "例如 rgba(99, 102, 241, 0.95)",
  className,
  allowEmpty,
}: ColorPickerProps) {
  const id = useId();
  const derived = useMemo(() => deriveFromValue(value), [value]);
  const hex = rgbToHex(derived);

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center gap-2">
        <div             
          className="shrink-0 h-9 w-9 cursor-pointer rounded-full overflow-hidden p-0 relative"
          style= {{ backgroundColor: hex }}
        >
          <input
            className="opacity-0"
            type="color"
            value={hex}
            onChange={(e) => {
              const rgb = parseHex(e.target.value);
              if (!rgb) return;
              onChange(formatRgba({ ...rgb, a: derived.a }));
            }}
          />
        </div>

        <Input
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            const next = e.target.value;
            if (allowEmpty && next.trim() === "") {
              onChange("");
              return;
            }
            onChange(next);
          }}
        />
      </div>

      <div className="grid gap-1">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>alpha</span>
          <span className="font-mono">{Math.round(derived.a * 100)}%</span>
        </div>
        <Slider
          id={id}
          aria-label="Alpha"
          min={0}
          max={100}
          step={1}
          value={[Math.round(derived.a * 100)]}
          onValueChange={(v) => {
            const next = typeof v === "number" ? v : v[0] ?? 100;
            const a = clamp(next / 100, 0, 1);
            onChange(formatRgba({ ...derived, a }));
          }}
        />
      </div>
    </div>
  );
}

