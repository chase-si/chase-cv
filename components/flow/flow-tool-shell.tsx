"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { FlowReadOnlySurface } from "@/components/flow/flow-read-only-surface";
import { FlowNodePropertiesPanel } from "@/components/flow/flow-node-properties-panel";
import { FlowStructureToolbar } from "@/components/flow/flow-structure-toolbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_FLOW_ROOT } from "@/lib/flow/demo-flow-data";
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
  const [flowData, setFlowData] = useState<FlowRoot>(DEMO_FLOW_ROOT);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(FLOW_ZOOM_DEFAULT);

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
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "扩展分支失败");
    }
  }, [flowData, requireSelection, selectedId]);

  const handleDelete = useCallback(() => {
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
    } catch (error) {
      toast.info(error instanceof Error ? error.message : "当前节点不可删除");
    }
  }, [flowData, requireSelection, selectedId]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            流程编辑器
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            查看并编辑 SFC 流程结构的可视化草稿；使用左侧工具栏缩放画布并增删分支与顺序步。
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
            <FlowStructureToolbar
              zoom={zoom}
              capabilities={toolbarCapabilities}
              onZoomIn={() => applyZoom("in")}
              onZoomOut={() => applyZoom("out")}
              onZoomReset={() => applyZoom("reset")}
              onAddSequentialStep={handleAddSequentialStep}
              onAddBranch={handleAddBranch}
              onExpandBranch={handleExpandBranch}
              onDelete={handleDelete}
            />
          </aside>

          <section
            data-testid="flow-editor-canvas"
            className="min-h-[min(480px,60vh)] min-w-0 flex-1"
            aria-label="流程图画布"
          >
            <FlowReadOnlySurface
              datas={flowData}
              className="min-h-[min(480px,60vh)]"
              activeId={selectedId}
              shrinksFactor={zoom}
              svgDomOnClick={handleSelectNode}
            />
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
    </div>
  );
}
