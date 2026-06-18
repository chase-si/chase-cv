"use client";

import { FlowReadOnlySurface } from "@/components/flow/flow-read-only-surface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_FLOW_ROOT } from "@/lib/flow/demo-flow-data";
import { cn } from "@/lib/utils";

export function FlowToolShell() {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            流程编辑器
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            查看并编辑 SFC 流程结构的可视化草稿；当前展示内置示例流程，后续切片将接入工具栏与属性编辑。
          </p>
        </header>

        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:items-stretch",
          )}
        >
          <aside
            data-testid="flow-editor-toolbar"
            className="shrink-0 lg:w-14"
            aria-label="流程编辑器工具栏"
          >
            <Card className="h-full shadow-sm">
              <CardHeader className="border-b border-border py-3">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  工具
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4 text-center text-xs text-muted-foreground">
                即将推出
              </CardContent>
            </Card>
          </aside>

          <section
            data-testid="flow-editor-canvas"
            className="min-h-[min(480px,60vh)] min-w-0 flex-1"
            aria-label="流程图画布"
          >
            <FlowReadOnlySurface datas={DEMO_FLOW_ROOT} className="min-h-[min(480px,60vh)]" />
          </section>

          <aside
            data-testid="flow-editor-properties"
            className="min-w-0 shrink-0 lg:w-72"
            aria-label="节点属性"
          >
            <Card className="h-full shadow-sm">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-sm">属性</CardTitle>
                <CardDescription>选中节点后在此编辑参数</CardDescription>
              </CardHeader>
              <CardContent className="py-4 text-sm text-muted-foreground">
                尚未选中节点
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
