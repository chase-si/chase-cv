"use client";

import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Download,
  FileText,
  ImageIcon,
  LayoutTemplate,
  Palette,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { TemplatePreview, type PosterPageContent } from "./template-preview";
import {
  posterTemplateCategories,
  posterTemplates,
  type PosterTemplate,
  type PosterTemplateCategory,
  type PosterTemplateId,
} from "./templates";

type PosterPage = PosterPageContent & {
  id: string;
};

type PosterDraftState = {
  pages: PosterPage[];
  selectedCategory: "All" | PosterTemplateCategory;
  selectedPageId: string;
  selectedTemplateId: PosterTemplateId;
};

const draftStorageKey = "poster-maker:draft:v1";

const examplePages: PosterPage[] = [
  {
    id: "example-1",
    title: "把复杂能力讲清楚",
    description:
      "模板预览会在这里同步排版\n支持后续接入导入、编辑与导出流程",
  },
];

const emptyPage: PosterPage = {
  id: "blank-1",
  title: "",
  description: "",
};

const defaultDraftState: PosterDraftState = {
  pages: examplePages,
  selectedCategory: "All",
  selectedPageId: examplePages[0].id,
  selectedTemplateId: posterTemplates[0].id,
};

const categoryFilters =
  posterTemplateCategories as PosterDraftState["selectedCategory"][];
const templateIds = new Set(posterTemplates.map((template) => template.id));
const templateCategories = new Set(categoryFilters);

const previewFallbackContent: PosterPageContent = {
  title: "把复杂能力讲清楚",
  description: "模板预览会在这里同步排版",
};

export function PosterMakerWorkbench() {
  const [draftState, setDraftState] = useState(readInitialDraftState);
  const { pages, selectedCategory, selectedPageId, selectedTemplateId } =
    draftState;

  const selectedTemplate =
    posterTemplates.find((template) => template.id === selectedTemplateId) ??
    posterTemplates[0];
  const selectedPage =
    pages.find((page) => page.id === selectedPageId) ?? pages[0] ?? emptyPage;

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
    window.localStorage.setItem(draftStorageKey, JSON.stringify(draftState));
  }, [draftState]);

  function addPage() {
    const nextPage: PosterPage = {
      id: createPageId(),
      title: `Page ${pages.length + 1}`,
      description: "",
    };

    setDraftState((currentDraft) => ({
      ...currentDraft,
      pages: [...currentDraft.pages, nextPage],
      selectedPageId: nextPage.id,
    }));
  }

  function updateSelectedPage(patch: Partial<PosterPageContent>) {
    setDraftState((currentDraft) => ({
      ...currentDraft,
      pages: currentDraft.pages.map((page) =>
        page.id === currentDraft.selectedPageId ? { ...page, ...patch } : page,
      ),
    }));
  }

  function deleteSelectedPage() {
    if (pages.length <= 1) {
      const nextPage = { ...emptyPage, id: createPageId() };
      setDraftState((currentDraft) => ({
        ...currentDraft,
        pages: [nextPage],
        selectedPageId: nextPage.id,
      }));
      return;
    }

    const selectedIndex = pages.findIndex((page) => page.id === selectedPage.id);
    const nextPages = pages.filter((page) => page.id !== selectedPage.id);
    const nextSelectedPage =
      nextPages[Math.min(Math.max(selectedIndex, 0), nextPages.length - 1)];

    setDraftState((currentDraft) => ({
      ...currentDraft,
      pages: nextPages,
      selectedPageId: nextSelectedPage.id,
    }));
  }

  function moveSelectedPage(direction: "up" | "down") {
    const selectedIndex = pages.findIndex((page) => page.id === selectedPage.id);
    const targetIndex = direction === "up" ? selectedIndex - 1 : selectedIndex + 1;

    if (
      selectedIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >= pages.length
    ) {
      return;
    }

    const nextPages = [...pages];
    const selected = nextPages[selectedIndex];
    nextPages[selectedIndex] = nextPages[targetIndex];
    nextPages[targetIndex] = selected;
    setDraftState((currentDraft) => ({
      ...currentDraft,
      pages: nextPages,
    }));
  }

  function clearAllContent() {
    if (!window.confirm("Clear all poster content? This cannot be undone.")) {
      return;
    }

    const nextPage = { ...emptyPage, id: createPageId() };
    setDraftState((currentDraft) => ({
      ...currentDraft,
      pages: [nextPage],
      selectedPageId: nextPage.id,
    }));
  }

  function resetToExamples() {
    const nextPages = examplePages.map((page) => ({ ...page }));
    setDraftState((currentDraft) => ({
      ...currentDraft,
      pages: nextPages,
      selectedPageId: nextPages[0].id,
    }));
  }

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
                {categoryFilters.map((category) => (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={selectedCategory === category}
                    onClick={() =>
                      setDraftState((currentDraft) => ({
                        ...currentDraft,
                        selectedCategory: category,
                      }))
                    }
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
                    content={selectedPage.title ? selectedPage : previewFallbackContent}
                    isSelected={template.id === selectedTemplateId}
                    onSelect={() =>
                      setDraftState((currentDraft) => ({
                        ...currentDraft,
                        selectedTemplateId: template.id,
                      }))
                    }
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
            <div
              aria-label="Current poster page preview"
              data-testid="main-template-preview"
              className="flex h-full min-h-120 items-center justify-center rounded-[8px] border border-border bg-muted p-4"
            >
              <TemplatePreview
                className="w-full max-w-sm shadow-lg"
                content={selectedPage}
                template={selectedTemplate}
              />
            </div>
          </WorkbenchPanel>

          <aside className="flex flex-col gap-4">
            <WorkbenchPanel
              icon={<FileText className="h-4 w-4" />}
              title="内容编辑"
            >
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={addPage}
                    className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-border bg-background px-3 text-sm font-medium transition hover:bg-muted"
                  >
                    <Plus className="h-4 w-4" />
                    Add page
                  </button>
                  <button
                    type="button"
                    onClick={resetToExamples}
                    className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-border bg-background px-3 text-sm font-medium transition hover:bg-muted"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset to example content
                  </button>
                </div>

                <ul aria-label="Poster pages" className="grid gap-2">
                  {pages.map((page, index) => (
                    <li key={page.id}>
                      <button
                        type="button"
                        aria-pressed={page.id === selectedPage.id}
                        onClick={() =>
                          setDraftState((currentDraft) => ({
                            ...currentDraft,
                            selectedPageId: page.id,
                          }))
                        }
                        className={cn(
                          "w-full rounded-[8px] border px-3 py-2 text-left text-sm transition",
                          page.id === selectedPage.id
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background hover:bg-muted",
                        )}
                      >
                        <span className="block text-xs opacity-75">
                          Page {index + 1}
                        </span>
                        <span className="block truncate font-medium">
                          {page.title || "Untitled page"}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="grid gap-2">
                  <label className="grid gap-1 text-sm font-medium">
                    Page title
                    <input
                      required
                      value={selectedPage.title}
                      onChange={(event) =>
                        updateSelectedPage({ title: event.target.value })
                      }
                      className="h-10 rounded-[8px] border border-border bg-background px-3 font-normal outline-none transition focus:border-foreground"
                    />
                  </label>

                  <label className="grid gap-1 text-sm font-medium">
                    Page description
                    <textarea
                      value={selectedPage.description}
                      onChange={(event) =>
                        updateSelectedPage({ description: event.target.value })
                      }
                      className="min-h-28 resize-y rounded-[8px] border border-border bg-background px-3 py-2 font-normal leading-6 outline-none transition focus:border-foreground"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => moveSelectedPage("up")}
                    disabled={pages.findIndex((page) => page.id === selectedPage.id) <= 0}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-border bg-background px-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <ArrowUp className="h-4 w-4" />
                    Move page up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSelectedPage("down")}
                    disabled={
                      pages.findIndex((page) => page.id === selectedPage.id) >=
                      pages.length - 1
                    }
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-border bg-background px-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <ArrowDown className="h-4 w-4" />
                    Move page down
                  </button>
                  <button
                    type="button"
                    onClick={deleteSelectedPage}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-border bg-background px-3 text-sm font-medium transition hover:bg-muted"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete page
                  </button>
                  <button
                    type="button"
                    onClick={clearAllContent}
                    className="inline-flex h-9 items-center justify-center rounded-[8px] border border-destructive/40 bg-background px-3 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                  >
                    Clear all content
                  </button>
                </div>
              </div>
            </WorkbenchPanel>

            <WorkbenchPanel icon={<Download className="h-4 w-4" />} title="导出状态">
              <div className="grid gap-3 text-sm">
                <StatusRow label="模板" value={selectedTemplate.name} />
                <StatusRow label="内容" value={`${pages.length} page draft`} />
                <StatusRow label="导出" value="尚未生成" />
              </div>
            </WorkbenchPanel>
          </aside>
        </section>
      </div>
    </main>
  );
}

function readInitialDraftState() {
  if (typeof window === "undefined") {
    return defaultDraftState;
  }

  return readDraftState() ?? defaultDraftState;
}

function readDraftState(): PosterDraftState | null {
  const rawDraft = window.localStorage.getItem(draftStorageKey);

  if (!rawDraft) {
    return null;
  }

  try {
    const parsedDraft = JSON.parse(rawDraft) as Partial<PosterDraftState>;
    const pages = Array.isArray(parsedDraft.pages)
      ? parsedDraft.pages.filter(isPosterPage)
      : [];
    const selectedTemplateId = parsedDraft.selectedTemplateId;
    const selectedCategory = parsedDraft.selectedCategory;
    const selectedPageId = parsedDraft.selectedPageId;

    if (
      pages.length === 0 ||
      typeof selectedPageId !== "string" ||
      !pages.some((page) => page.id === selectedPageId) ||
      typeof selectedTemplateId !== "string" ||
      !templateIds.has(selectedTemplateId as PosterTemplateId) ||
      typeof selectedCategory !== "string" ||
      !templateCategories.has(selectedCategory)
    ) {
      return null;
    }

    return {
      pages,
      selectedCategory: selectedCategory as PosterDraftState["selectedCategory"],
      selectedPageId,
      selectedTemplateId: selectedTemplateId as PosterTemplateId,
    };
  } catch {
    return null;
  }
}

function isPosterPage(value: unknown): value is PosterPage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const page = value as Partial<PosterPage>;
  return (
    typeof page.id === "string" &&
    typeof page.title === "string" &&
    typeof page.description === "string"
  );
}

function createPageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `page-${Date.now()}`;
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
