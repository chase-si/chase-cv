"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { FlowReadOnlySurface } from "@/components/flow/flow-read-only-surface";
import { FlowNodePropertiesPanel } from "@/components/flow/flow-node-properties-panel";
import { FlowDemoControls } from "@/components/flow/flow-demo-controls";
import { FlowStructureToolbar } from "@/components/flow/flow-structure-toolbar";
import {
  defaultFlowUiCopy,
  interpolateFlowCopy,
  type FlowUiCopy,
} from "@/components/flow/flow-ui-copy";
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

export function FlowToolShell({ copy = defaultFlowUiCopy }: { copy?: FlowUiCopy }) {
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
      toast.info(copy.feedback.selectNode);
      return false;
    }
    return true;
  }, [copy.feedback.selectNode, selectedId]);

  const applyZoom = useCallback((direction: "in" | "out" | "reset") => {
    setZoom((current) => {
      const { zoom: nextZoom, clamped } = adjustFlowZoom(current, direction);
      if (clamped) {
        toast.info(
          direction === "in"
            ? copy.feedback.zoomMax
            : copy.feedback.zoomMin,
        );
      }
      return nextZoom;
    });
  }, [copy.feedback.zoomMax, copy.feedback.zoomMin]);

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
    } catch {
      toast.error(copy.feedback.addStepError);
    }
  }, [copy.feedback.addStepError, flowData, requireSelection, selectedId]);

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
    } catch {
      toast.error(copy.feedback.addBranchError);
    }
  }, [copy.feedback.addBranchError, flowData, requireSelection, selectedId]);

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
    } catch {
      toast.error(copy.feedback.expandBranchError);
    }
  }, [copy.feedback.expandBranchError, flowData, requireSelection, selectedId]);

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
    } catch {
      toast.info(copy.feedback.deleteError);
    }
  }, [copy.feedback.deleteError, flowData, requireSelection, selectedId]);

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
              {copy.title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              {copy.description}
            </p>
          </div>
          <FlowDemoControls
            runningHighlight={runningHighlight}
            onRunningHighlightChange={setRunningHighlight}
            onReset={requestResetDemo}
            dirty={isDirty}
            copy={copy.demo}
            className="shrink-0"
          />
        </header>

        <div
          className={cn(
            "grid min-h-0 flex-1 grid-cols-[9rem_minmax(0,1fr)] items-stretch gap-3 sm:grid-cols-[10.5rem_minmax(0,1fr)] sm:gap-4 lg:h-[clamp(30rem,70vh,48rem)] lg:flex-none lg:grid-cols-[12rem_minmax(0,1fr)_18rem] lg:grid-rows-1",
          )}
        >
          <aside
            data-testid="flow-editor-toolbar"
            className="min-h-0 min-w-0"
            aria-label={copy.toolbarAria}
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
              copy={copy.toolbar}
            />
          </aside>

          <section
            data-testid="flow-editor-canvas"
            className="h-[clamp(30rem,70vh,48rem)] min-w-0 lg:h-full lg:min-h-0"
            aria-label={copy.canvasAria}
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
            className="col-span-2 min-h-0 min-w-0 lg:col-span-1"
            aria-label={copy.propertiesAria}
          >
            <Card className="h-full shadow-sm">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-sm">{copy.properties.title}</CardTitle>
                <CardDescription>{copy.properties.description}</CardDescription>
              </CardHeader>
              <CardContent className="py-4">
                <FlowNodePropertiesPanel
                  selectedNode={selectedNode}
                  onPatchNode={handlePatchNode}
                  onClearSelection={handleClearSelection}
                  copy={copy.properties}
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
        title={
          confirmation === "delete" ? copy.dialog.deleteTitle : copy.dialog.resetTitle
        }
        description={
          confirmation === "delete"
            ? interpolateFlowCopy(copy.dialog.deleteDescription, {
                id: selectedNode?.id ?? "",
              })
            : copy.dialog.resetDescription
        }
        confirmLabel={
          confirmation === "delete" ? copy.dialog.confirmDelete : copy.dialog.confirmReset
        }
        destructive
        onConfirm={handleConfirm}
      />
    </div>
  );
}
