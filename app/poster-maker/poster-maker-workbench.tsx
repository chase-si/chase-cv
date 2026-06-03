"use client";

import {
  CheckCircle2,
  Download,
  FileText,
  ImageIcon,
  LayoutTemplate,
  Palette,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { TemplatePreview, type PosterPageContent } from "./template-preview";
import {
  posterTemplateCategories,
  posterTemplates,
  type PosterTemplate,
} from "./templates";

const firstPageContent: PosterPageContent = {
  eyebrow: "模板图片工作台",
  title: "把复杂能力讲清楚",
  subtitle: "模板预览会在这里同步排版",
  note: "支持后续接入导入、编辑与导出流程",
  tags: ["技术", "简历", "分享"],
};

export function PosterMakerWorkbench() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    posterTemplates[0].id,
  );

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
              先搭好模板选择、内容编辑、实时预览和导出状态区域，后续可以直接接入模板图片预览与生成流程。
            </p>
          </div>

          <div className="flex h-10 items-center gap-2 rounded-[8px] border border-border bg-card px-3 text-sm shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-chart-2" />
            <span>草稿已准备</span>
          </div>
        </section>

        <section
          aria-label="Poster maker workbench"
          className="grid min-h-[calc(100vh-13rem)] gap-4 lg:grid-cols-[300px_minmax(0,1fr)_320px]"
        >
          <aside className="flex flex-col gap-4">
            <WorkbenchPanel
              icon={<Palette className="h-4 w-4" />}
              title="风格 / 模板"
              ariaLabel="Template gallery"
            >
              <div className="flex flex-wrap gap-2">
                {posterTemplateCategories.map((category) => (
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
                  <TemplateCard
                    key={template.id}
                    content={firstPageContent}
                    isSelected={template.id === selectedTemplateId}
                    onSelect={() => setSelectedTemplateId(template.id)}
                    template={template}
                  />
                ))}
              </div>
            </WorkbenchPanel>

            <WorkbenchPanel
              icon={<LayoutTemplate className="h-4 w-4" />}
              title="模板规格"
            >
              <div className="grid grid-cols-3 gap-2">
                {["1:1", "4:5", "16:9"].map((ratio) => (
                  <div
                    key={ratio}
                    className="flex aspect-4/5 items-center justify-center rounded-[8px] border border-dashed border-border bg-muted text-xs font-medium"
                  >
                    {ratio}
                  </div>
                ))}
              </div>
            </WorkbenchPanel>
          </aside>

          <WorkbenchPanel
            icon={<ImageIcon className="h-4 w-4" />}
            title="预览"
            className="min-h-136"
          >
            <div className="flex h-full min-h-120 items-center justify-center rounded-[8px] border border-border bg-muted p-4">
              <TemplatePreview
                className="w-full max-w-sm shadow-lg"
                content={firstPageContent}
                template={selectedTemplate}
              />
              <span data-testid="main-template-preview" className="sr-only">
                {selectedTemplate.name} {firstPageContent.title}
              </span>
            </div>
          </WorkbenchPanel>

          <aside className="flex flex-col gap-4">
            <WorkbenchPanel
              icon={<FileText className="h-4 w-4" />}
              title="内容编辑"
            >
              <div className="grid gap-3">
                {[
                  `主标题：${firstPageContent.title}`,
                  `副标题：${firstPageContent.subtitle}`,
                  `说明：${firstPageContent.note}`,
                ].map((field) => (
                  <div
                    key={field}
                    className="rounded-[8px] border border-border bg-background px-3 py-3 text-sm"
                  >
                    {field}
                  </div>
                ))}
              </div>
            </WorkbenchPanel>

            <WorkbenchPanel icon={<Download className="h-4 w-4" />} title="导出状态">
              <div className="grid gap-3 text-sm">
                <StatusRow label="模板" value={selectedTemplate.name} />
                <StatusRow label="内容" value="示例草稿" />
                <StatusRow label="导出" value="尚未生成" />
              </div>
            </WorkbenchPanel>
          </aside>
        </section>
      </div>
    </main>
  );
}

function TemplateCssLinks({ templates }: { templates: PosterTemplate[] }) {
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

function TemplateCard({
  content,
  isSelected,
  onSelect,
  template,
}: {
  content: PosterPageContent;
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
      <span className="block text-sm font-semibold">{template.name}</span>
      <span className="mt-1 block text-xs font-medium text-muted-foreground">
        {template.category}
      </span>
      <TemplatePreview
        className="mt-3 scale-[0.96]"
        content={content}
        template={template}
      />
      <span className="mt-3 block text-xs leading-5 text-muted-foreground">
        {template.description}
      </span>
    </button>
  );
}

function WorkbenchPanel({
  ariaLabel,
  children,
  className = "",
  icon,
  title,
}: {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <section
      aria-label={ariaLabel}
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

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-10 items-center justify-between gap-3 rounded-[8px] border border-border bg-background px-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
