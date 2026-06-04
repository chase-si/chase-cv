"use client";

import { useEffect } from "react";

import type { PosterTemplate } from "./templates";

export function TemplateCssLinks({ templates }: { templates: PosterTemplate[] }) {
  useEffect(() => {
    const createdLinks: HTMLLinkElement[] = [];

    for (const template of templates) {
      const linkId = `poster-template-css-${template.id}`;
      if (document.getElementById(linkId)) {
        continue;
      }

      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = template.cssPath;
      link.dataset.posterTemplate = template.id;
      document.head.appendChild(link);
      createdLinks.push(link);
    }

    return () => {
      for (const link of createdLinks) {
        link.remove();
      }
    };
  }, [templates]);

  return null;
}
