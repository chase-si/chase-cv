"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardScrollArea } from "@/components/ui/card";
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
}: MobileBottomSheetProps) {
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <>
      {/* Backdrop scrim */}
      <div
        data-testid="mobile-bottom-sheet-backdrop"
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-xs transition-opacity lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-up Bottom Properties Surface */}
      <div
        role="dialog"
        aria-modal="true"
        data-testid={testId}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[82vh] flex-col rounded-t-2xl border-t border-x border-border bg-card/98 shadow-2xl backdrop-blur-md transition-transform duration-200 ease-out lg:hidden",
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
              <span className="truncate text-sm font-semibold text-foreground">
                {title}
              </span>
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
            aria-label="Close bottom sheet"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sheet Scrollable Body */}
        <CardScrollArea className="min-h-0 flex-1 px-4 py-3">
          {children}
        </CardScrollArea>
      </div>
    </>
  );
}
