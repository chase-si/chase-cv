import {
  CheckCircle2,
  Download,
  FileText,
  ImageIcon,
  LayoutTemplate,
  Palette,
} from "lucide-react";
import type { ReactNode } from "react";

const templateOptions = [
  {
    title: "科技分享",
    detail: "适合产品更新、技术文章、活动预告。",
  },
  {
    title: "个人履历",
    detail: "适合能力亮点、项目摘要、社媒展示。",
  },
  {
    title: "空白画布",
    detail: "保留比例与安全边距，等待后续模板预览。",
  },
];

const contentFields = [
  "主标题：把复杂能力讲清楚",
  "副标题：模板预览会在这里同步排版",
  "说明：支持后续接入导入、编辑与导出流程",
];

export default function PosterMakerPage() {
  return (
    <main className="min-h-0 flex-1 bg-background">
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
          className="grid min-h-[calc(100vh-13rem)] gap-4 lg:grid-cols-[280px_minmax(0,1fr)_320px]"
        >
          <aside className="flex flex-col gap-4">
            <WorkbenchPanel
              icon={<Palette className="h-4 w-4" />}
              title="风格 / 模板"
            >
              <div className="grid gap-3">
                {templateOptions.map((option) => (
                  <button
                    key={option.title}
                    type="button"
                    className="min-h-24 rounded-[8px] border border-border bg-background p-3 text-left shadow-xs transition hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <span className="block text-sm font-semibold">
                      {option.title}
                    </span>
                    <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                      {option.detail}
                    </span>
                  </button>
                ))}
              </div>
            </WorkbenchPanel>

            <WorkbenchPanel
              icon={<LayoutTemplate className="h-4 w-4" />}
              title="模板预览占位"
            >
              <div className="grid grid-cols-3 gap-2">
                {["1:1", "4:5", "16:9"].map((ratio) => (
                  <div
                    key={ratio}
                    className="flex aspect-[4/5] items-center justify-center rounded-[8px] border border-dashed border-border bg-muted text-xs font-medium"
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
            className="min-h-[34rem]"
          >
            <div className="flex h-full min-h-[30rem] items-center justify-center rounded-[8px] border border-border bg-muted p-4">
              <div className="flex aspect-[4/5] w-full max-w-sm flex-col justify-between rounded-[8px] border-2 border-border bg-card p-6 shadow-lg">
                <div>
                  <div className="mb-6 h-24 rounded-[8px] border border-dashed border-border bg-background" />
                  <p className="text-sm font-medium text-muted-foreground">
                    示例模板
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight">
                    把复杂能力讲清楚
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    这里是后续模板图片预览的初始内容，保留给真实模板、标题、副标题和说明文字。
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium">
                  <span className="rounded-[8px] border border-border bg-background px-2 py-2">
                    技术
                  </span>
                  <span className="rounded-[8px] border border-border bg-background px-2 py-2">
                    简历
                  </span>
                  <span className="rounded-[8px] border border-border bg-background px-2 py-2">
                    分享
                  </span>
                </div>
              </div>
            </div>
          </WorkbenchPanel>

          <aside className="flex flex-col gap-4">
            <WorkbenchPanel
              icon={<FileText className="h-4 w-4" />}
              title="内容编辑"
            >
              <div className="grid gap-3">
                {contentFields.map((field) => (
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
                <StatusRow label="模板" value="等待选择" />
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

function WorkbenchPanel({
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
      className={`flex flex-col gap-4 rounded-[8px] border border-border bg-card p-4 shadow-sm ${className}`}
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
