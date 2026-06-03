import { cn } from "@/lib/utils";

import type { PosterTemplate } from "./templates";

export type PosterPageContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  note: string;
  tags: string[];
};

export function TemplatePreview({
  className,
  content,
  template,
}: {
  className?: string;
  content: PosterPageContent;
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
      <div className="pm-template__body">
        <p className="pm-template__eyebrow">{content.eyebrow}</p>
        <h3 className="pm-template__title">{content.title}</h3>
        <p className="pm-template__subtitle">{content.subtitle}</p>
      </div>
      <div className="pm-template__footer">
        <p>{content.note}</p>
        <div className="pm-template__tags" aria-label="Template tags">
          {content.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
