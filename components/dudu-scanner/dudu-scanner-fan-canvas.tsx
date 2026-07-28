"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type DuduScannerFanCanvasProps = {
  className?: string;
  active?: boolean;
  showLockFrame?: boolean;
};

export function DuduScannerFanCanvas({
  className,
  active = true,
  showLockFrame = false,
}: DuduScannerFanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let frame = 0;
    let raf = 0;

    const draw = () => {
      const { width, height } = canvas;
      context.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.92;
      const radius = Math.min(width, height) * 0.78;
      const sweep = (Math.PI * 5) / 6;
      const start = -Math.PI / 2 - sweep / 2;

      context.save();
      context.beginPath();
      context.moveTo(cx, cy);
      context.arc(cx, cy, radius, start, start + sweep);
      context.closePath();
      const gradient = context.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
      gradient.addColorStop(0, "rgba(34, 197, 94, 0.35)");
      gradient.addColorStop(0.55, "rgba(34, 197, 94, 0.12)");
      gradient.addColorStop(1, "rgba(34, 197, 94, 0.02)");
      context.fillStyle = gradient;
      context.fill();
      context.strokeStyle = "rgba(34, 197, 94, 0.55)";
      context.lineWidth = 2;
      context.stroke();
      context.restore();

      if (active) {
        const beamAngle = start + sweep * 0.5 + Math.sin(frame * 0.04) * (sweep * 0.35);
        context.save();
        context.translate(cx, cy);
        context.rotate(beamAngle);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, -radius);
        context.strokeStyle = "rgba(74, 222, 128, 0.85)";
        context.lineWidth = 3;
        context.stroke();
        context.restore();
      }

      frame += 1;
      raf = window.requestAnimationFrame(draw);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) {
        return;
      }
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement ?? canvas);
    raf = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [active]);

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-1 items-stretch justify-center overflow-hidden rounded-2xl border border-border bg-card/80",
        className,
      )}
      data-testid="dudu-scanner-fan-stage"
    >
      <canvas ref={canvasRef} className="size-full" aria-hidden />
      {showLockFrame ? (
        <div
          className="pointer-events-none absolute inset-[12%] rounded-2xl border-4 border-primary shadow-[0_0_24px_rgba(34,197,94,0.45)]"
          data-testid="dudu-scanner-lock-frame"
        />
      ) : null}
    </div>
  );
}
