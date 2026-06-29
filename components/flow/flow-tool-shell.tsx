"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { FlowReadOnlySurface } from "@/components/flow/flow-read-only-surface";
import { FlowNodePropertiesPanel } from "@/components/flow/flow-node-properties-panel";
import { FlowDemoControls } from "@/components/flow/flow-demo-controls";
import { FlowStructureToolbar } from "@/components/flow/flow-structure-toolbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { cloneDemoFlowRoot } from "@/lib/flow/clone-demo-flow-root";
import { getDemoRuntimeHighlightPresentation } from "@/lib/flow/demo-runtime-highlight";
import { findFlowNodeById } from "@/lib/flow/find-flow-node";
import { defaultFlowIdFactory } from "@/lib/flow/flow-id-factory";
import {
  addFlowBranch,
  addSequentialFlowStep,
  deleteSupportedFlowNode,
  expandFlowBranch,
  getFlowToolbarCapabilities,
} from "@/lib/flow/flow-structure-mutations";
import { adjustFlowZoom, FLOW_ZOOM_DEFAULT } from "@/lib/flow/flow-zoom";
import { updateFlowNodeById } from "@/lib/flow/update-flow-node";
import type { FlowLeafNode, FlowRoot } from "@/lib/flow/types";
import { cn } from "@/lib/utils";

export function FlowToolShell() {
  const [flowData, setFlowData] = useState<FlowRoot>(() => cloneDemoFlowRoot());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(FLOW_ZOOM_DEFAULT);
  const [runningHighlight, setRunningHighlight] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [confirmation, setConfirmation] = useState<"delete" | "reset" | null>(null);

  const runtimeHighlight = useMemo(
    () => getDemoRuntimeHighlightPresentation(runningHighlight),
    [runningHighlight],
  );

  const selectedNode = useMemo(
    () => (selectedId ? findFlowNodeById(flowData, selectedId) ?? null : null),
    [flowData, selectedId],
  );

  const toolbarCapabilities = useMemo(
    () => getFlowToolbarCapabilities(selectedNode),
    [selectedNode],
  );

  const handleSelectNode = useCallback((id: string | undefined) => {
    setSelectedId(id ?? null);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  const handlePatchNode = useCallback((id: string, patch: Partial<FlowLeafNode>) => {
    setIsDirty(true);
    setFlowData((prev) =>
      updateFlowNodeById(prev, id, (node) => ({ ...node, ...patch }) as FlowLeafNode),
    );
  }, []);

  const requireSelection = useCallback(() => {
    if (!selectedId) {
      toast.info("请先在流程图中选中一个节点");
      return false;
    }
    return true;
  }, [selectedId]);

  const applyZoom = useCallback((direction: "in" | "out" | "reset") => {
    setZoom((current) => {
      const { zoom: nextZoom, clamped } = adjustFlowZoom(current, direction);
      if (clamped) {
        toast.info(
          direction === "in"
            ? "已达到最大缩放 200%"
            : "已达到最小缩放 50%",
        );
      }
      return nextZoom;
    });
  }, []);

  const handleAddSequentialStep = useCallback(() => {
    if (!requireSelection() || !selectedId) {
      return;
    }
    try {
      const result = addSequentialFlowStep({
        renderData: flowData,
        activeId: selectedId,
        createId: defaultFlowIdFactory,
      });
      setFlowData(result.newFlowData);
      setSelectedId(result.selectedNodeId);
      setIsDirty(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "增加顺序步失败");
    }
  }, [flowData, requireSelection, selectedId]);

  const handleAddBranch = useCallback(() => {
    if (!requireSelection() || !selectedId) {
      return;
    }
    try {
      const result = addFlowBranch({
        renderData: flowData,
        activeId: selectedId,
        createId: defaultFlowIdFactory,
      });
      setFlowData(result.newFlowData);
      setSelectedId(result.selectedNodeId);
      setIsDirty(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "增加分支失败");
    }
  }, [flowData, requireSelection, selectedId]);

  const handleExpandBranch = useCallback(() => {
    if (!requireSelection() || !selectedId) {
      return;
    }
    try {
      const result = expandFlowBranch({
        renderData: flowData,
        activeId: selectedId,
        createId: defaultFlowIdFactory,
      });
      setFlowData(result.newFlowData);
      setSelectedId(result.selectedNodeId);
      setIsDirty(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "扩展分支失败");
    }
  }, [flowData, requireSelection, selectedId]);

  const executeDelete = useCallback(() => {
    if (!requireSelection() || !selectedId) {
      return;
    }
    try {
      const result = deleteSupportedFlowNode({
        renderData: flowData,
        activeId: selectedId,
      });
      setFlowData(result.newFlowData);
      setSelectedId(result.selectedNodeId);
      setIsDirty(true);
    } catch (error) {
      toast.info(error instanceof Error ? error.message : "当前节点不可删除");
    }
  }, [flowData, requireSelection, selectedId]);

  const handleResetDemo = useCallback(() => {
    setFlowData(cloneDemoFlowRoot());
    setSelectedId(null);
    setIsDirty(false);
  }, []);

  const requestResetDemo = useCallback(() => {
    if (isDirty) {
      setConfirmation("reset");
      return;
    }
    handleResetDemo();
  }, [handleResetDemo, isDirty]);

  const requestDelete = useCallback(() => {
    if (!selectedNode || !toolbarCapabilities.canDelete) {
      return;
    }
    setConfirmation("delete");
  }, [selectedNode, toolbarCapabilities.canDelete]);

  const handleConfirm = useCallback(() => {
    if (confirmation === "delete") {
      executeDelete();
    } else if (confirmation === "reset") {
      handleResetDemo();
    }
    setConfirmation(null);
  }, [confirmation, executeDelete, handleResetDemo]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              流程编辑器
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              查看并编辑 SFC 流程结构的可视化草稿；使用左侧工具栏缩放画布并增删分支与顺序步。
            </p>
          </div>
          <FlowDemoControls
            runningHighlight={runningHighlight}
            onRunningHighlightChange={setRunningHighlight}
            onReset={requestResetDemo}
            dirty={isDirty}
            className="shrink-0"
          />
        </header>

        <div
          className={cn(
            "grid min-h-0 flex-1 grid-cols-[9rem_minmax(0,1fr)] items-stretch gap-3 sm:grid-cols-[10.5rem_minmax(0,1fr)] sm:gap-4 lg:grid-cols-[11rem_minmax(0,1fr)_18rem]",
          )}
        >
          <aside
            data-testid="flow-editor-toolbar"
            className="min-w-0"
            aria-label="流程编辑器工具栏"
          >
            <FlowStructureToolbar
              zoom={zoom}
              capabilities={toolbarCapabilities}
              onZoomIn={() => applyZoom("in")}
              onZoomOut={() => applyZoom("out")}
              onZoomReset={() => applyZoom("reset")}
              onAddSequentialStep={handleAddSequentialStep}
              onAddBranch={handleAddBranch}
              onExpandBranch={handleExpandBranch}
              onDelete={requestDelete}
              selectedNodeId={selectedId}
            />
          </aside>

          <section
            data-testid="flow-editor-canvas"
            className="h-[min(48rem,70vh)] min-h-[30rem] min-w-0"
            aria-label="流程图画布"
          >
            <FlowReadOnlySurface
              datas={flowData}
              className="h-full min-h-0"
              activeId={selectedId}
              shrinksFactor={zoom}
              svgDomOnClick={handleSelectNode}
              idColorMap={runtimeHighlight?.idColorMap}
              greenArrowIds={runtimeHighlight?.greenArrowIds}
            />
          </section>

          <aside
            data-testid="flow-editor-properties"
            className="col-span-2 min-w-0 lg:col-span-1"
            aria-label="节点属性"
          >
            <Card className="h-full shadow-sm">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-sm">属性</CardTitle>
                <CardDescription>选中节点后在此编辑参数</CardDescription>
              </CardHeader>
              <CardContent className="py-4">
                <FlowNodePropertiesPanel
                  selectedNode={selectedNode}
                  onPatchNode={handlePatchNode}
                  onClearSelection={handleClearSelection}
                />
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <ConfirmationDialog
        open={confirmation !== null}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmation(null);
          }
        }}
        title={confirmation === "delete" ? "删除所选节点？" : "重置示例？"}
        description={
          confirmation === "delete"
            ? `节点 ${selectedNode?.id ?? ""} 将从流程中移除，此操作无法撤销。`
            : "当前流程包含尚未保留的修改。重置后将恢复示例内容，此操作无法撤销。"
        }
        confirmLabel={confirmation === "delete" ? "确认删除" : "确认重置"}
        destructive
        onConfirm={handleConfirm}
      />
    </div>
  );
}
