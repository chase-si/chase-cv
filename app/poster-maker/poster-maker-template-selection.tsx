"use client";

import { ArrowRight, ImageIcon, LayoutTemplate, Palette } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { TemplateCssLinks } from "./template-css-links";
import { TemplatePreview, type PosterPageContent } from "./template-preview";
import {
  posterTemplateCategories,
  posterTemplates,
  type PosterTemplate,
  type PosterTemplateCategory,
  type PosterTemplateId,
} from "./templates";
import { draftStorageKey } from "./poster-maker-workbench";

type SelectedCategory = "All" | PosterTemplateCategory;

const categoryFilters = posterTemplateCategories as SelectedCategory[];
const defaultTemplateId = posterTemplates[0].id;
const templateIds = new Set(posterTemplates.map((template) => template.id));
const previewContent: PosterPageContent = {
  title: "把复杂能力讲清楚",
  description: "模板预览会在这里同步排版\n选择模板后进入编辑器继续完善内容",
};

export function PosterMakerTemplateSelection() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategory>("All");
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<PosterTemplateId>(defaultTemplateId);

  const selectedTemplate =
    posterTemplates.find((template) => template.id === selectedTemplateId) ??
    posterTemplates[0];
  const visibleTemplates = useMemo(
    () =>
      selectedCategory === "All"
        ? posterTemplates
        : posterTemplates.filter(
            (template) => template.category === selectedCategory,
          ),
    [selectedCategory],
  );

  useEffect(() => {
    const loadStoredTemplate = window.setTimeout(() => {
      const storedTemplateId = readStoredTemplateId();

      if (storedTemplateId) {
        setSelectedTemplateId(storedTemplateId);
      }
    }, 0);

    return () => window.clearTimeout(loadStoredTemplate);
  }, []);

  return (
    <main className="min-h-0 flex-1 bg-background">
      <TemplateCssLinks templates={posterTemplates} />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
        <section className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-muted-foreground">
              模板图片工作台
            </p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Poster Maker
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              选择一个视觉模板，先在右侧确认大图预览，再进入编辑器完善内容与导出。
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push(`/poster-maker/${selectedTemplate.id}`)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-border bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-85"
          >
            Use this template
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>

        <section
          aria-label="Template selection"
          className="grid min-h-[calc(100vh-13rem)] gap-4 lg:grid-cols-[360px_minmax(0,1fr)]"
        >
          <SelectionPanel
            icon={<Palette className="h-4 w-4" />}
            title="风格 / 模板"
          >
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "h-8 rounded-[8px] border border-border px-3 text-xs font-medium transition",
                    selectedCategory === category
                      ? "bg-foreground text-background"
                      : "bg-background hover:bg-muted",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid gap-3">
              {visibleTemplates.map((template) => (
                <TemplateSelectionCard
                  key={template.id}
                  isSelected={template.id === selectedTemplateId}
                  onSelect={() => setSelectedTemplateId(template.id)}
                  template={template}
                />
              ))}
            </div>
          </SelectionPanel>

          <SelectionPanel
            icon={<ImageIcon className="h-4 w-4" />}
            title="模板预览"
            className="min-h-136"
          >
            <div
              aria-label="Selected template preview"
              data-testid="main-template-preview"
              className="flex h-full min-h-120 items-center justify-center rounded-[8px] border border-border bg-muted p-4"
            >
              <TemplatePreview
                className="w-full max-w-sm shadow-lg"
                content={previewContent}
                template={selectedTemplate}
              />
            </div>
          </SelectionPanel>
        </section>
      </div>
    </main>
  );
}

function readStoredTemplateId() {
  const rawDraft = window.localStorage.getItem(draftStorageKey);

  if (!rawDraft) {
    return null;
  }

  try {
    const selectedTemplateId = (JSON.parse(rawDraft) as { selectedTemplateId?: unknown })
      .selectedTemplateId;

    return typeof selectedTemplateId === "string" &&
      templateIds.has(selectedTemplateId as PosterTemplateId)
      ? (selectedTemplateId as PosterTemplateId)
      : null;
  } catch {
    return null;
  }
}

function TemplateSelectionCard({
  isSelected,
  onSelect,
  template,
}: {
  isSelected: boolean;
  onSelect: () => void;
  template: PosterTemplate;
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onSelect}
      className={cn(
        "rounded-[8px] border bg-background p-3 text-left shadow-xs transition hover:-translate-y-0.5 hover:shadow-sm",
        isSelected ? "border-foreground" : "border-border",
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-sm font-semibold">{template.name}</span>
          <span className="mt-1 block text-xs font-medium text-muted-foreground">
            {template.category}
          </span>
        </span>
        <LayoutTemplate className="mt-0.5 h-4 w-4 text-muted-foreground" />
      </span>
      <span className="mt-3 block text-xs leading-5 text-muted-foreground">
        {template.description}
      </span>
    </button>
  );
}

function SelectionPanel({
  children,
  className = "",
  icon,
  title,
}: {
  children: ReactNode;
  className?: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-[8px] border border-border bg-card p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex h-8 items-center gap-2 text-sm font-semibold">
        {icon}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}
