import { cn } from "@/lib/utils";

import { defaultPosterSpecId, posterSpecs, type PosterSpec, type PosterTemplate } from "./templates";

export type PosterPageContent = {
  title: string;
  description: string;
};

export function TemplatePreview({
  className,
  content,
  footerText,
  pageLabel,
  posterSpec = defaultPosterSpec,
  template,
}: {
  className?: string;
  content: PosterPageContent;
  footerText?: string;
  pageLabel?: string;
  posterSpec?: PosterSpec;
  template: PosterTemplate;
}) {
  return (
    <article
      className={cn("pm-template", `pm-template--${template.id}`, className)}
      data-poster-spec={posterSpec.id}
      data-template={template.id}
      data-testid="template-preview"
      style={{ aspectRatio: `${posterSpec.width} / ${posterSpec.height}` }}
    >
      <div className="pm-template__media" aria-hidden="true">
        <span />
      </div>
      {pageLabel ? (
        <p className="pm-template__page-label" aria-label="Page label">
          {pageLabel}
        </p>
      ) : null}
      <div className="pm-template__body">
        <p className="pm-template__eyebrow">Poster page</p>
        <h3 className="pm-template__title">{content.title || "Untitled page"}</h3>
        {content.description ? (
          <p className="pm-template__subtitle whitespace-pre-line">
            {content.description}
          </p>
        ) : null}
      </div>
      <div className="pm-template__footer">
        {footerText ? (
          <p className="pm-template__global-footer">{footerText}</p>
        ) : null}
      </div>
    </article>
  );
}

const defaultPosterSpec =
  posterSpecs.find((spec) => spec.id === defaultPosterSpecId) ?? posterSpecs[0];
