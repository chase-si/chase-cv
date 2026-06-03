import { cn } from "@/lib/utils";

import type { PosterTemplate } from "./templates";

export type PosterPageContent = {
  title: string;
  description: string;
};

export function TemplatePreview({
  className,
  content,
  footerText,
  pageLabel,
  template,
}: {
  className?: string;
  content: PosterPageContent;
  footerText?: string;
  pageLabel?: string;
  template: PosterTemplate;
}) {
  return (
    <article
      className={cn("pm-template", `pm-template--${template.id}`, className)}
      data-template={template.id}
      data-testid="template-preview"
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
        <div className="pm-template__tags" aria-label="Template tags">
          {[template.category, template.name].map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
