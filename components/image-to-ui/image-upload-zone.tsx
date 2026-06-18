"use client";

import { useId, useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageUploadZoneProps = {
  onFileSelected: (file: File) => void;
  className?: string;
  labels?: {
    uploadAria: string;
    uploadButton: string;
    uploadHelp: string;
  };
};

export function ImageUploadZone({
  onFileSelected,
  className,
  labels = {
    uploadAria: "从本地上传图片",
    uploadButton: "选择本地图片",
    uploadHelp: "仅在浏览器内预览，不会上传或保存到服务器。",
  },
}: ImageUploadZoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label={labels.uploadAria}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onFileSelected(file);
          }
          event.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => inputRef.current?.click()}
      >
        {labels.uploadButton}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        {labels.uploadHelp}
      </p>
    </div>
  );
}
