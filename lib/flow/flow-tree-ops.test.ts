import { describe, expect, it } from "vitest";

import {
  appendFlowBranchStep,
  collapseSingleBranchNodes,
  createBlankFlowStep,
  deleteFlowItemById,
  findFlowNodeParentItems,
  insertFlowItemAfterId,
} from "@/lib/flow/flow-tree-ops";
import type { FlowRoot } from "@/lib/flow/types";

const miniTree: FlowRoot = [
  { type: "start", id: "start" },
  { type: "step", id: "step-a", descStr: "A" },
  { type: "transfer", id: "transfer-a", expr: "true" },
  { type: "end", id: "end" },
];

describe("flow tree ops", () => {
  it("inserts a node immediately after the matching id at root level", () => {
    const inserted = { type: "step" as const, id: "step-new", descStr: "new" };
    const result = insertFlowItemAfterId(miniTree, inserted, "step-a");

    expect(result.map((n) => (!Array.isArray(n) ? n.id : null))).toEqual([
      "start",
      "step-a",
      "step-new",
      "transfer-a",
      "end",
    ]);
  });

  it("deletes a node by id without mutating the input tree", () => {
    const result = deleteFlowItemById(miniTree, "transfer-a");

    expect(result.map((n) => (!Array.isArray(n) ? n.id : null))).toEqual([
      "start",
      "step-a",
      "end",
    ]);
    expect(miniTree).toHaveLength(4);
  });

  it("finds parent items array for nested branch steps", () => {
    const nested: FlowRoot = [
      { type: "start", id: "start" },
      {
        type: "cond",
        id: "cond-1",
        steps: [
          [{ type: "step", id: "inner-step", descStr: "in branch" }],
          [{ type: "step", id: "inner-step-2", descStr: "other" }],
        ],
      },
      { type: "end", id: "end" },
    ];

    const parents = findFlowNodeParentItems(nested, "inner-step");
    expect(parents?.map((n) => (!Array.isArray(n) ? n.id : "seq"))).toEqual([
      "inner-step",
    ]);
  });

  it("appends a branch entry on cond/para nodes", () => {
    const tree: FlowRoot = [
      {
        type: "para",
        id: "para-1",
        steps: [[{ type: "step", id: "p-step-1" }]],
      },
    ];
    const newBranch = [{ type: "step" as const, id: "p-step-2" }];

    const result = appendFlowBranchStep(tree, "para-1", newBranch);
    const para = result[0];
    expect(para && !Array.isArray(para) && para.type === "para" && para.steps).toHaveLength(2);
  });

  it("creates blank step defaults", () => {
    expect(createBlankFlowStep("id-1")).toEqual({
      type: "step",
      id: "id-1",
      text: "",
      descStr: "",
      instance_name: "",
      instance_id: "",
      status: "ready",
    });
  });

  it("collapses a cond node with a single branch into inline steps", () => {
    const tree: FlowRoot = [
      { type: "start", id: "start" },
      {
        type: "cond",
        id: "cond-only",
        steps: [
          [
            { type: "step", id: "only-step", descStr: "solo" },
            { type: "transfer", id: "only-transfer", expr: "true" },
          ],
        ],
      },
      { type: "end", id: "end" },
    ];

    const collapsed = collapseSingleBranchNodes(tree);
    const ids = collapsed
      .filter((n) => !Array.isArray(n))
      .map((n) => n.id);

    expect(ids).toEqual(["start", "only-step", "only-transfer", "end"]);
    expect(ids).not.toContain("cond-only");
  });
});
