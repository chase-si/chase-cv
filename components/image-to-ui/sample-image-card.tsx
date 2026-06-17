"use client";

import { useState, type KeyboardEvent } from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ImageToUiSampleCardProps = {
  id: string;
  imagePath: string;
  title: string;
  description: string;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
};

export function ImageToUiSampleCard({
  id,
  imagePath,
  title,
  description,
  selected = false,
  onSelect,
  className,
}: ImageToUiSampleCardProps) {
  const [missingAsset, setMissingAsset] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onSelect) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <Card
      size="sm"
      data-sample-id={id}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-pressed={onSelect ? selected : undefined}
      aria-label={onSelect ? title : undefined}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        "gap-0 overflow-hidden py-0",
        onSelect &&
          "cursor-pointer text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {missingAsset ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 px-3 text-center">
            <span className="text-sm font-medium text-muted-foreground">待补充</span>
            <span className="text-xs text-muted-foreground">示例图片尚未放入仓库</span>
          </div>
        ) : (
          <Image
            src={imagePath}
            alt={onSelect ? "" : title}
            aria-hidden={onSelect ? true : undefined}
            fill
            sizes="(max-width: 640px) 100vw, 240px"
            className="object-cover"
            onError={() => setMissingAsset(true)}
          />
        )}
      </div>
      <CardHeader className="gap-1 px-4 py-3">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="sr-only">
        示例图片 {title}，{description}
      </CardContent>
    </Card>
  );
}
