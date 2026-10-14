"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardScrollArea } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MobileBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  testId?: string;
  closeLabel?: string;
  desktop?: boolean;
}

export function MobileBottomSheet({
  open,
  onClose,
  title,
  subtitle,
  badge,
  children,
  className,
  testId = "mobile-bottom-sheet",
  closeLabel = "Close bottom sheet",
  desktop = false,
}: MobileBottomSheetProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const viewport = window.visualViewport;
    const resize = () => {
      const panel = panelRef.current;
      if (panel) {
        panel.style.setProperty("--floor-plan-panel-height", `${viewport?.height ?? window.innerHeight}px`);
        if (!desktop) panel.style.bottom = `${Math.max(0, window.innerHeight - (viewport?.height ?? window.innerHeight) - (viewport?.offsetTop ?? 0))}px`;
      }
    };
    resize(); viewport?.addEventListener("resize", resize);
    return () => viewport?.removeEventListener("resize", resize);
  }, [open, desktop]);
  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <Dialog.Portal>
      {/* Backdrop scrim */}
      <Dialog.Backdrop
        data-testid="mobile-bottom-sheet-backdrop"
        className={cn("fixed inset-0 z-40 bg-foreground/25 backdrop-blur-xs", !desktop && "lg:hidden")}
      />

      {/* Slide-up Bottom Properties Surface */}
      <Dialog.Popup
        ref={panelRef}
        render={<Card />}
        data-testid={testId}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[min(78dvh,var(--floor-plan-panel-height,78dvh))] w-full max-w-2xl flex-col gap-0 rounded-b-none border-border bg-card p-0 outline-none",
          desktop ? "lg:inset-y-auto lg:bottom-1/2 lg:translate-y-1/2 lg:rounded-b-2xl" : "lg:hidden",
          className,
        )}
      >
        {/* Drag handle */}
        <div className="flex w-full items-center justify-center pt-2.5 pb-1">
          <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Sheet Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-2">
          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center gap-2">
              <Dialog.Title className="truncate text-base font-semibold text-foreground">
                {title}
              </Dialog.Title>
              {badge}
            </div>
            {subtitle && (
              <p className="truncate text-xs text-muted-foreground mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            data-testid="mobile-bottom-sheet-close"
            onClick={onClose}
            className="h-11 w-11 min-h-[44px] min-w-[44px] rounded-full p-0 text-muted-foreground hover:text-foreground touch-manipulation"
            aria-label={closeLabel}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sheet Scrollable Body */}
        <CardScrollArea className="min-h-0 flex-1 px-4 py-3 pb-[max(1rem,var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))]">
          {children}
        </CardScrollArea>
      </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
