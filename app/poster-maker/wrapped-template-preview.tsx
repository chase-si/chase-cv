import { cn } from "@/lib/utils";

import { ScaledPosterCanvas } from "./scaled-poster-canvas";
import { TemplatePreview, type PosterPageContent } from "./template-preview";
import type { PosterTemplate } from "./templates";

export function WrappedTemplatePreview({
  className,
  content,
  footerText,
  pageLabel,
  slotClassName,
  template,
}: {
  className?: string;
  content: PosterPageContent;
  footerText?: string;
  pageLabel?: string;
  slotClassName?: string;
  template: PosterTemplate;
}) {
  return (
    <ScaledPosterCanvas className={slotClassName}>
      <TemplatePreview
        className={cn("h-full w-full shadow-lg", className)}
        content={content}
        footerText={footerText}
        pageLabel={pageLabel}
        template={template}
      />
    </ScaledPosterCanvas>
  );
}
