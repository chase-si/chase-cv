"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  destructive?: boolean;
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  destructive = false,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 bg-foreground/30 backdrop-blur-xs transition-opacity data-closed:opacity-0 data-open:opacity-100" />
        <AlertDialog.Viewport className="fixed inset-0 flex items-center justify-center p-4">
          <AlertDialog.Popup
            className={cn(
              "flex w-full max-w-md flex-col gap-5 border border-border bg-card p-6 text-card-foreground shadow-xl outline-none transition-all",
              "data-closed:scale-95 data-closed:opacity-0 data-open:scale-100 data-open:opacity-100",
            )}
          >
            <div className="flex flex-col gap-2">
              <AlertDialog.Title className="text-lg font-semibold tracking-tight">
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm leading-6 text-muted-foreground">
                {description}
              </AlertDialog.Description>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <AlertDialog.Close render={<Button type="button" variant="outline" />}>
                取消
              </AlertDialog.Close>
              <AlertDialog.Close
                render={
                  <Button
                    type="button"
                    variant={destructive ? "destructive" : "default"}
                    onClick={onConfirm}
                  />
                }
              >
                {confirmLabel}
              </AlertDialog.Close>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
