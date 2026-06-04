"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Download,
  FileText,
  ImageIcon,
  Palette,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react";
import { toPng } from "html-to-image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { TemplateCssLinks } from "./template-css-links";
import { TemplatePreview, type PosterPageContent } from "./template-preview";
import {
  defaultPosterSpecId,
  posterTemplateCategories,
  posterSpecs,
  posterTemplates,
  type PosterSpec,
  type PosterSpecId,
  type PosterTemplate,
  type PosterTemplateCategory,
  type PosterTemplateId,
} from "./templates";

type PosterPage = PosterPageContent & {
  id: string;
};

type PosterDraftState = {
  footerText: string;
  pages: PosterPage[];
  selectedCategory: "All" | PosterTemplateCategory;
  selectedPageId: string;
  selectedPosterSpecId: PosterSpecId;
  selectedTemplateId: PosterTemplateId;
  showPageLabels: boolean;
};

export const draftStorageKey = "poster-maker:draft:v1";

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

const categoryFilters =
  posterTemplateCategories as PosterDraftState["selectedCategory"][];
const defaultPosterSpec =
  posterSpecs.find((spec) => spec.id === defaultPosterSpecId) ?? posterSpecs[0];
const posterSpecIds = new Set(posterSpecs.map((spec) => spec.id));
const templateIds = new Set(posterTemplates.map((template) => template.id));
const templateCategories = new Set(categoryFilters);

const previewFallbackContent: PosterPageContent = {
  title: "把复杂能力讲清楚",
  description: "模板预览会在这里同步排版",
};

export function PosterMakerWorkbench({
  initialTemplateId = posterTemplates[0].id,
}: {
  initialTemplateId?: PosterTemplateId;
}) {
  const router = useRouter();
  const [draftState, setDraftState] = useState(() =>
    createDefaultDraftState(initialTemplateId),
  );
  const [hasLoadedStoredDraft, setHasLoadedStoredDraft] = useState(false);
  const [markdownImportValue, setMarkdownImportValue] = useState("");
  const [importFeedback, setImportFeedback] = useState(
    "Paste Markdown headings to import poster pages.",
  );
  const [exportFeedback, setExportFeedback] = useState("Ready to review.");
  const [isExporting, setIsExporting] = useState(false);
  const [didAttemptExport, setDidAttemptExport] = useState(false);
  const exportRenderRootRef = useRef<HTMLDivElement | null>(null);
  const {
    footerText,
    pages,
    selectedCategory,
    selectedPageId,
    selectedPosterSpecId,
    selectedTemplateId,
    showPageLabels,
  } = draftState;

  const selectedPosterSpec =
    posterSpecs.find((spec) => spec.id === selectedPosterSpecId) ??
    defaultPosterSpec;
  const selectedTemplate =
    posterTemplates.find((template) => template.id === selectedTemplateId) ??
    posterTemplates[0];
  const selectedPage =
    pages.find((page) => page.id === selectedPageId) ?? pages[0] ?? emptyPage;
  const selectedPageIndex = Math.max(
    pages.findIndex((page) => page.id === selectedPage.id),
    0,
  );
  const invalidTitleCount = pages.filter(
    (page) => page.title.trim().length === 0,
  ).length;
  const hasSelectedPageInvalidTitle = selectedPage.title.trim().length === 0;
  const overflowRiskCount = pages.filter(hasOverflowRisk).length;
  const posterWarnings =
    overflowRiskCount > 0
      ? `${formatPageCount(overflowRiskCount)} may overflow the poster canvas.`
      : "No overflow warnings.";
  const pageLabel = showPageLabels
    ? formatPageLabel(selectedPageIndex + 1, pages.length)
    : undefined;
  const footerTextForPreview = footerText.trim();

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
    const loadStoredDraft = window.setTimeout(() => {
      const storedDraft = readDraftState();

      if (storedDraft) {
        setDraftState({
          ...storedDraft,
          selectedTemplateId: initialTemplateId,
        });
      }

      setHasLoadedStoredDraft(true);
    }, 0);

    return () => window.clearTimeout(loadStoredDraft);
  }, [initialTemplateId]);

  useEffect(() => {
    if (!hasLoadedStoredDraft) {
      return;
    }

    writeDraftState(draftState);
  }, [draftState, hasLoadedStoredDraft]);

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

  function importMarkdown(mode: "replace" | "append") {
    const importedPages = parseMarkdownPages(markdownImportValue);

    if (importedPages.length === 0) {
      setImportFeedback("Add at least one Markdown heading before importing.");
      return;
    }

    const nextImportedPages = importedPages.map((page) => ({
      ...page,
      id: createPageId(),
    }));

    setDraftState((currentDraft) => {
      const nextPages =
        mode === "replace"
          ? nextImportedPages
          : [...currentDraft.pages, ...nextImportedPages];

      return {
        ...currentDraft,
        pages: nextPages,
        selectedPageId: nextImportedPages[0].id,
      };
    });
    setImportFeedback(
      `${mode === "replace" ? "Imported" : "Appended"} ${formatPageCount(
        nextImportedPages.length,
      )}.`,
    );
  }

  function selectTemplate(templateId: PosterTemplateId) {
    const nextDraft = {
      ...draftState,
      selectedTemplateId: templateId,
    };

    setDraftState(nextDraft);
    if (hasLoadedStoredDraft) {
      writeDraftState(nextDraft);
    }
    router.replace(`/poster-maker/${templateId}`);
  }

  async function exportPosterPages() {
    setDidAttemptExport(true);

    if (invalidTitleCount > 0) {
      setExportFeedback(
        `${formatPageCount(invalidTitleCount)} needs a title before export.`,
      );
      return;
    }

    setIsExporting(true);
    setExportFeedback(`Preparing ${formatPageCount(pages.length)} for export.`);

    try {
      const exportedPages = await renderPosterPagePngs({
        onProgress: (completedCount) =>
          setExportFeedback(
            `Rendered ${completedCount} of ${pages.length} PNG files.`,
          ),
        posterSpec: selectedPosterSpec,
        renderRoot: exportRenderRootRef.current,
      });
      const directoryResult = await writePosterPngsToDirectory(exportedPages);

      if (directoryResult === "written") {
        setExportFeedback(
          `Saved ${exportedPages.length} PNG files to selected directory${
            overflowRiskCount > 0 ? " with overflow warnings" : ""
          }.`,
        );
        return;
      }

      downloadPosterPngFallbacks(exportedPages);
      setExportFeedback(
        `Downloaded ${exportedPages.length} PNG files for ${formatPageCount(
          pages.length,
        )}${overflowRiskCount > 0 ? " with overflow warnings" : ""}.`,
      );
    } catch (error) {
      setExportFeedback(
        error instanceof Error
          ? `Export failed: ${error.message}`
          : "Export failed. Please try again.",
      );
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <main className="min-h-0 flex-1 bg-background">
      <TemplateCssLinks templates={posterTemplates} />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
        <section className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <Breadcrumb className="mb-3 text-sm text-muted-foreground">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/poster-maker">Poster Maker</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedTemplate.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
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
                    onSelect={() => selectTemplate(template.id)}
                    template={template}
                  />
                ))}
              </div>
            </WorkbenchPanel>

          </aside>

          <WorkbenchPanel
            icon={<ImageIcon className="h-4 w-4" />}
            title="预览"
            className="min-h-136"
          >
            <fieldset
              aria-label="Poster spec"
              className="grid gap-2 rounded-[8px] border border-border bg-background p-2"
            >
              <legend className="sr-only">Poster spec</legend>
              <div className="grid grid-cols-3 gap-2">
                {posterSpecs.map((spec) => (
                  <label
                    key={spec.id}
                    className={cn(
                      "flex min-h-12 cursor-pointer items-center gap-2 rounded-[8px] border px-3 text-xs transition",
                      selectedPosterSpec.id === spec.id
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card hover:bg-muted",
                    )}
                  >
                    <input
                      type="radio"
                      name="poster-spec"
                      value={spec.id}
                      checked={selectedPosterSpec.id === spec.id}
                      onChange={() =>
                        setDraftState((currentDraft) => ({
                          ...currentDraft,
                          selectedPosterSpecId: spec.id,
                        }))
                      }
                      className="h-3.5 w-3.5 accent-current"
                    />
                    <span>
                      <span className="block font-semibold">{spec.id}</span>
                      <span className="mt-0.5 block opacity-75">
                        {spec.width}x{spec.height}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div
              aria-label="Current poster page preview"
              data-testid="main-template-preview"
              className="flex h-full min-h-120 items-center justify-center rounded-[8px] border border-border bg-muted p-4"
            >
              <TemplatePreview
                className="w-full max-w-xl shadow-lg"
                content={selectedPage}
                footerText={footerTextForPreview}
                pageLabel={pageLabel}
                posterSpec={selectedPosterSpec}
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
                      aria-invalid={
                        didAttemptExport && hasSelectedPageInvalidTitle
                      }
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

                <div className="grid gap-3 rounded-[8px] border border-border bg-background p-3">
                  <label className="flex items-center justify-between gap-3 text-sm font-medium">
                    <span>Show page labels</span>
                    <input
                      type="checkbox"
                      checked={showPageLabels}
                      onChange={(event) =>
                        setDraftState((currentDraft) => ({
                          ...currentDraft,
                          showPageLabels: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-foreground"
                    />
                  </label>

                  <label className="grid gap-1 text-sm font-medium">
                    Global footer
                    <input
                      value={footerText}
                      onChange={(event) =>
                        setDraftState((currentDraft) => ({
                          ...currentDraft,
                          footerText: event.target.value,
                        }))
                      }
                      className="h-10 rounded-[8px] border border-border bg-card px-3 font-normal outline-none transition focus:border-foreground"
                    />
                  </label>
                </div>

                <div className="grid gap-2 rounded-[8px] border border-border bg-background p-3">
                  <label className="grid gap-1 text-sm font-medium">
                    Markdown import
                    <textarea
                      value={markdownImportValue}
                      onChange={(event) =>
                        setMarkdownImportValue(event.target.value)
                      }
                      placeholder={"# Page title\nDescription line 1\nDescription line 2"}
                      className="min-h-32 resize-y rounded-[8px] border border-border bg-card px-3 py-2 font-mono text-xs font-normal leading-5 outline-none transition focus:border-foreground"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => importMarkdown("replace")}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-border bg-foreground px-3 text-sm font-medium text-background transition hover:opacity-85"
                    >
                      <Upload className="h-4 w-4" />
                      Replace pages
                    </button>
                    <button
                      type="button"
                      onClick={() => importMarkdown("append")}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-border bg-background px-3 text-sm font-medium transition hover:bg-muted"
                    >
                      <Plus className="h-4 w-4" />
                      Append pages
                    </button>
                  </div>
                  <p
                    aria-label="Import feedback"
                    role="status"
                    className="min-h-5 text-xs leading-5 text-muted-foreground"
                  >
                    {importFeedback}
                  </p>
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
                <p
                  aria-label="Poster warnings"
                  role="status"
                  className={cn(
                    "rounded-[8px] border px-3 py-2 text-xs leading-5",
                    overflowRiskCount > 0
                      ? "border-chart-2 bg-chart-2/10"
                      : "border-border bg-background text-muted-foreground",
                  )}
                >
                  {posterWarnings}
                </p>
                {didAttemptExport && invalidTitleCount > 0 ? (
                  <p
                    role="alert"
                    className="rounded-[8px] border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs leading-5 text-destructive"
                  >
                    Add a title before exporting every poster page.
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={exportPosterPages}
                  disabled={isExporting}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-border bg-foreground px-3 text-sm font-medium text-background transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? "Exporting poster pages" : "Export poster pages"}
                </button>
                <p
                  aria-label="Export status"
                  role="status"
                  className="min-h-5 text-xs leading-5 text-muted-foreground"
                >
                  {exportFeedback}
                </p>
              </div>
            </WorkbenchPanel>
          </aside>
        </section>
      </div>
      <div
        ref={exportRenderRootRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-[-20000px] grid gap-8"
      >
        {pages.map((page, index) => (
          <div
            key={page.id}
            data-export-page-index={index}
            style={{
              height: selectedPosterSpec.height,
              width: selectedPosterSpec.width,
            }}
          >
            <TemplatePreview
              className="h-full w-full"
              content={page}
              footerText={footerTextForPreview}
              pageLabel={
                showPageLabels
                  ? formatPageLabel(index + 1, pages.length)
                  : undefined
              }
              posterSpec={selectedPosterSpec}
              template={selectedTemplate}
            />
          </div>
        ))}
      </div>
    </main>
  );
}

function createDefaultDraftState(
  selectedTemplateId: PosterTemplateId,
): PosterDraftState {
  return {
    footerText: "",
    pages: examplePages,
    selectedCategory: "All",
    selectedPageId: examplePages[0].id,
    selectedPosterSpecId: defaultPosterSpecId,
    selectedTemplateId,
    showPageLabels: false,
  };
}

function writeDraftState(draftState: PosterDraftState) {
  window.localStorage.setItem(draftStorageKey, JSON.stringify(draftState));
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
    const selectedPosterSpecId = parsedDraft.selectedPosterSpecId;
    const footerText =
      typeof parsedDraft.footerText === "string" ? parsedDraft.footerText : "";
    const showPageLabels =
      typeof parsedDraft.showPageLabels === "boolean"
        ? parsedDraft.showPageLabels
        : false;

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
      footerText,
      pages,
      selectedCategory: selectedCategory as PosterDraftState["selectedCategory"],
      selectedPageId,
      selectedPosterSpecId:
        typeof selectedPosterSpecId === "string" &&
        posterSpecIds.has(selectedPosterSpecId as PosterSpecId)
          ? (selectedPosterSpecId as PosterSpecId)
          : defaultPosterSpecId,
      selectedTemplateId: selectedTemplateId as PosterTemplateId,
      showPageLabels,
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

function parseMarkdownPages(markdown: string): Omit<PosterPage, "id">[] {
  const pages: Omit<PosterPage, "id">[] = [];
  let currentPage: { title: string; descriptionLines: string[] } | null = null;

  for (const line of markdown.replace(/\r\n?/g, "\n").split("\n")) {
    const headingMatch = line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);

    if (headingMatch) {
      if (currentPage) {
        pages.push(toPosterPage(currentPage));
      }

      currentPage = {
        title: headingMatch[1].trim(),
        descriptionLines: [],
      };
      continue;
    }

    if (currentPage) {
      currentPage.descriptionLines.push(line);
    }
  }

  if (currentPage) {
    pages.push(toPosterPage(currentPage));
  }

  return pages.filter((page) => page.title.length > 0);
}

function toPosterPage(page: {
  title: string;
  descriptionLines: string[];
}): Omit<PosterPage, "id"> {
  return {
    title: page.title,
    description: trimBlankLines(page.descriptionLines).join("\n"),
  };
}

function trimBlankLines(lines: string[]) {
  let startIndex = 0;
  let endIndex = lines.length;

  while (startIndex < endIndex && lines[startIndex].trim() === "") {
    startIndex += 1;
  }

  while (endIndex > startIndex && lines[endIndex - 1].trim() === "") {
    endIndex -= 1;
  }

  return lines.slice(startIndex, endIndex);
}

function formatPageCount(count: number) {
  return `${count} ${count === 1 ? "page" : "pages"}`;
}

function formatPageLabel(pageNumber: number, pageCount: number) {
  const labelWidth = Math.max(2, String(pageCount).length);
  return `${String(pageNumber).padStart(labelWidth, "0")} / ${String(
    pageCount,
  ).padStart(labelWidth, "0")}`;
}

function hasOverflowRisk(page: PosterPageContent) {
  const descriptionLines = page.description.split(/\r\n?|\n/);
  return page.title.length > 46 || descriptionLines.length > 12;
}

type ExportedPosterPage = {
  dataUrl: string;
  filename: string;
};

type DirectoryWriteResult = "unavailable" | "written";

type FileSystemDirectoryHandleLike = {
  getFileHandle: (
    name: string,
    options?: { create?: boolean },
  ) => Promise<FileSystemFileHandleLike>;
};

type FileSystemFileHandleLike = {
  createWritable: () => Promise<FileSystemWritableFileStreamLike>;
};

type FileSystemWritableFileStreamLike = {
  close: () => Promise<void>;
  write: (data: Blob) => Promise<void>;
};

type WindowWithDirectoryPicker = Window &
  typeof globalThis & {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandleLike>;
  };

async function renderPosterPagePngs({
  onProgress,
  posterSpec,
  renderRoot,
}: {
  onProgress: (completedCount: number) => void;
  posterSpec: PosterSpec;
  renderRoot: HTMLDivElement | null;
}): Promise<ExportedPosterPage[]> {
  if (!renderRoot) {
    throw new Error("Export renderer is unavailable.");
  }

  const renderNodes = Array.from(
    renderRoot.querySelectorAll<HTMLElement>("[data-export-page-index]"),
  );

  if (renderNodes.length === 0) {
    throw new Error("No poster pages are available to export.");
  }

  const exportedPages: ExportedPosterPage[] = [];

  for (const [index, node] of renderNodes.entries()) {
    const title = node.querySelector(".pm-template__title")?.textContent ?? "";
    const dataUrl = await toPng(node, {
      backgroundColor: getOpaqueBackgroundColor(node),
      cacheBust: true,
      canvasHeight: posterSpec.height,
      canvasWidth: posterSpec.width,
      height: posterSpec.height,
      pixelRatio: 1,
      width: posterSpec.width,
    });

    exportedPages.push({
      dataUrl,
      filename: formatPosterPngFilename(index, title),
    });
    onProgress(exportedPages.length);
  }

  return exportedPages;
}

async function writePosterPngsToDirectory(
  exportedPages: ExportedPosterPage[],
): Promise<DirectoryWriteResult> {
  const directoryPicker = (window as WindowWithDirectoryPicker)
    .showDirectoryPicker;

  if (!directoryPicker) {
    return "unavailable";
  }

  try {
    const directoryHandle = await directoryPicker();

    for (const page of exportedPages) {
      const fileHandle = await directoryHandle.getFileHandle(page.filename, {
        create: true,
      });
      const writable = await fileHandle.createWritable();
      await writable.write(dataUrlToBlob(page.dataUrl));
      await writable.close();
    }

    return "written";
  } catch {
    return "unavailable";
  }
}

function downloadPosterPngFallbacks(exportedPages: ExportedPosterPage[]) {
  exportedPages.forEach((page) => {
    const anchor = document.createElement("a");
    anchor.download = page.filename;
    anchor.href = page.dataUrl;
    anchor.rel = "noopener";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  });
}

function formatPosterPngFilename(index: number, title: string) {
  return `poster-${String(index + 1).padStart(2, "0")}-${slugifyFilename(
    title,
  )}.png`;
}

function slugifyFilename(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled-page";
}

function getOpaqueBackgroundColor(node: HTMLElement) {
  const templateNode = node.querySelector<HTMLElement>(".pm-template");
  return templateNode
    ? window.getComputedStyle(templateNode).backgroundColor
    : window.getComputedStyle(document.body).backgroundColor;
}

function dataUrlToBlob(dataUrl: string) {
  const [metadata, data] = dataUrl.split(",");
  const mimeType = metadata.match(/^data:(.+);base64$/)?.[1] ?? "image/png";
  const binary = window.atob(data);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
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
