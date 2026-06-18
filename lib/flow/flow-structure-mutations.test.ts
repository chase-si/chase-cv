import { describe, expect, it } from "vitest";

import { DEMO_FLOW_ROOT } from "@/lib/flow/demo-flow-data";
import { findFlowNodeById } from "@/lib/flow/find-flow-node";
import {
  addFlowBranch,
  addSequentialFlowStep,
  deleteSupportedFlowNode,
  expandFlowBranch,
  getFlowToolbarCapabilities,
} from "@/lib/flow/flow-structure-mutations";
import type { FlowRoot } from "@/lib/flow/types";

function createIdFactory(prefix = "gen") {
  let counter = 0;
  return () => `${prefix}-${++counter}`;
}

describe("flow structure mutations", () => {
  it("adds a labeled sequential step after a transfer with empty description", () => {
    const createId = createIdFactory();
    const result = addSequentialFlowStep({
      renderData: DEMO_FLOW_ROOT,
      activeId: "transfer001",
      createId,
    });

    const added = result.newAddedSteps[0];
    expect(added.descStr).toBe("");
    expect(added.id).toBe("gen-1");
    expect(result.selectedNodeId).toBe("gen-1");
    expect(findFlowNodeById(result.newFlowData, "gen-1")?.type).toBe("step");

    const labeledStep = findFlowNodeById(result.newFlowData, "gen-1") as {
      text?: string;
    };
    expect(labeledStep.text).toMatch(/^\d{3}$/);
    const newTransfer = findFlowNodeById(result.newFlowData, "gen-2") as {
      text?: string;
    };
    expect(newTransfer?.text).toMatch(/^T\d+$/);
    expect(newTransfer?.expr).toBe("true");
  });

  it("adds a condition branch from a step and selects the new inner step", () => {
    const createId = createIdFactory("branch");
    const result = addFlowBranch({
      renderData: DEMO_FLOW_ROOT,
      activeId: "step001",
      createId,
    });

    expect(result.selectedNodeId).toBe("branch-4");
    const added = findFlowNodeById(result.newFlowData, "branch-4") as {
      type: string;
      descStr?: string;
      text?: string;
    };
    expect(added.type).toBe("step");
    expect(added.descStr).toBe("");
    expect(added.text).toMatch(/^\d{3}$/);
  });

  it("adds a parallel branch from a transfer and selects the first new step", () => {
    const createId = createIdFactory("para");
    const result = addFlowBranch({
      renderData: DEMO_FLOW_ROOT,
      activeId: "transfer002",
      createId,
    });

    expect(result.selectedNodeId).toBe("para-2");
    expect(result.newAddedSteps.map((s) => s.id)).toEqual(["para-2", "para-3"]);
  });

  it("expands condition and parallel branches with empty defaults", () => {
    const createId = createIdFactory("expand");
    const condResult = expandFlowBranch({
      renderData: DEMO_FLOW_ROOT,
      activeId: "cond1",
      createId,
    });
    const newTransfer = findFlowNodeById(condResult.newFlowData, "expand-1") as {
      expr?: string;
      text?: string;
    };
    expect(newTransfer?.expr).toBe("");
    expect(newTransfer?.text).toMatch(/^T\d+$/);

    const paraFlow: FlowRoot = [
      {
        type: "para",
        id: "para-root",
        status: "ready",
        steps: [[{ type: "step", id: "p-step-1", descStr: "a" }]],
      },
    ];
    const paraResult = expandFlowBranch({
      renderData: paraFlow,
      activeId: "para-root",
      createId: createIdFactory("pex"),
    });
    expect(paraResult.selectedNodeId).toBe("pex-1");
    const expandedStep = findFlowNodeById(paraResult.newFlowData, "pex-1") as {
      descStr?: string;
    };
    expect(expandedStep.descStr).toBe("");
  });

  it("deletes a step and clears selection", () => {
    const result = deleteSupportedFlowNode({
      renderData: DEMO_FLOW_ROOT,
      activeId: "step002",
    });

    expect(result.selectedNodeId).toBeNull();
    expect(findFlowNodeById(result.newFlowData, "step002")).toBeUndefined();
  });

  it("rejects deleting a protected transfer", () => {
    expect(() =>
      deleteSupportedFlowNode({
        renderData: DEMO_FLOW_ROOT,
        activeId: "transfer001",
      }),
    ).toThrow(/不可删除/);
  });
});

describe("getFlowToolbarCapabilities", () => {
  it("enables structure actions based on node type", () => {
    expect(getFlowToolbarCapabilities(null)).toEqual({
      canAddSequentialStep: false,
      canAddBranch: false,
      canExpandBranch: false,
      canDelete: false,
    });

    expect(
      getFlowToolbarCapabilities({ type: "step", id: "s" }),
    ).toMatchObject({
      canAddSequentialStep: true,
      canAddBranch: true,
      canDelete: true,
      canExpandBranch: false,
    });

    expect(
      getFlowToolbarCapabilities({ type: "cond", id: "c" }),
    ).toMatchObject({
      canExpandBranch: true,
      canAddSequentialStep: false,
      canAddBranch: false,
    });
  });
});
