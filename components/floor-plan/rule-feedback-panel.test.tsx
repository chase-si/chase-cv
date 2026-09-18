import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { FloorPlan } from "@/lib/floor-plan";
import { STUDIO_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/standard-plans";
import type { RuleResult } from "@/lib/floor-plan/rules";
import { RuleFeedbackPanel } from "./rule-feedback-panel";

afterEach(() => {
  cleanup();
});

describe("RuleFeedbackPanel Component (US-12, US-14, AC-12, AC-14)", () => {
  const sampleViolations: RuleResult[] = [
    {
      ruleId: "furniture-wall-collision",
      severity: "error",
      relatedEntityIds: ["f1", "w1"],
      relatedObjectIds: ["f1", "w1"],
      measuredValue: 125000,
      recommendedValue: "0 mm²",
      title: "Wall Collision",
      message: 'Furniture "f1" (desk) intersects wall "w1" by 125000 mm². Reposition furniture away from wall.',
    },
    {
      ruleId: "furniture-boundary",
      severity: "error",
      relatedEntityIds: ["f2"],
      relatedObjectIds: ["f2"],
      measuredValue: 450,
      recommendedValue: "Inside room",
      title: "Boundary Violation",
      message: 'Furniture "f2" (sofa) is placed outside room boundaries by 450 mm. Move it inside an enclosed room.',
    },
  ];

  it("renders compliant clean state when 0 violations exist", () => {
    const handleSelect = vi.fn();
    render(
      <RuleFeedbackPanel
        plan={STUDIO_STANDARD_FLOOR_PLAN}
        ruleResults={[]}
        selectedEntity={null}
        onSelect={handleSelect}
      />,
    );

    expect(screen.getByTestId("rule-feedback-panel")).toBeInTheDocument();
    expect(screen.getByTestId("rule-clean-state")).toBeInTheDocument();
    expect(screen.getByText("0 Issues")).toBeInTheDocument();
  });

  it("renders violation items with title, severity, measured value, recommended value (AC-14)", () => {
    const handleSelect = vi.fn();
    render(
      <RuleFeedbackPanel
        plan={STUDIO_STANDARD_FLOOR_PLAN}
        ruleResults={sampleViolations}
        selectedEntity={null}
        onSelect={handleSelect}
      />,
    );

    expect(screen.getByTestId("rule-violations-count-badge")).toHaveTextContent("2 Issues");
    expect(screen.getByTestId("rule-violation-furniture-wall-collision")).toBeInTheDocument();
    expect(screen.getByTestId("rule-violation-furniture-boundary")).toBeInTheDocument();

    // Check titles
    expect(screen.getByText("Wall Collision")).toBeInTheDocument();
    expect(screen.getByText("Boundary Violation")).toBeInTheDocument();

    // Check measured & recommended values (AC-14)
    expect(screen.getByTestId("measured-val-furniture-wall-collision")).toHaveTextContent("125000 mm²");
    expect(screen.getByTestId("recommended-val-furniture-wall-collision")).toHaveTextContent("0 mm²");

    expect(screen.getByTestId("measured-val-furniture-boundary")).toHaveTextContent("450 mm");
    expect(screen.getByTestId("recommended-val-furniture-boundary")).toHaveTextContent("Inside room");
  });

  it("navigates / selects affected entity when clicking rule entity button (AC-12, AC-14)", () => {
    const handleSelect = vi.fn();
    const planWithEntities: FloorPlan = {
      ...STUDIO_STANDARD_FLOOR_PLAN,
      furniture: [
        ...STUDIO_STANDARD_FLOOR_PLAN.furniture,
        {
          id: "f1",
          definitionId: "desk",
          x: 100,
          y: 100,
          width: 800,
          depth: 600,
          rotation: 0,
        },
      ],
      walls: [
        ...STUDIO_STANDARD_FLOOR_PLAN.walls,
        { id: "w1", from: "sv1", to: "sv2", thickness: 200, lockAxis: "horizontal" },
      ],
    };

    render(
      <RuleFeedbackPanel
        plan={planWithEntities}
        ruleResults={sampleViolations}
        selectedEntity={null}
        onSelect={handleSelect}
      />,
    );

    // Click entity button for f1
    const f1Btn = screen.getByTestId("rule-entity-btn-f1");
    fireEvent.click(f1Btn);
    expect(handleSelect).toHaveBeenCalledWith({ type: "furniture", id: "f1" });

    // Click entity button for w1
    const w1Btn = screen.getByTestId("rule-entity-btn-w1");
    fireEvent.click(w1Btn);
    expect(handleSelect).toHaveBeenCalledWith({ type: "wall", id: "w1" });
  });

  it("supports collapsing and expanding the violations list", () => {
    const handleSelect = vi.fn();
    render(
      <RuleFeedbackPanel
        plan={STUDIO_STANDARD_FLOOR_PLAN}
        ruleResults={sampleViolations}
        selectedEntity={null}
        onSelect={handleSelect}
      />,
    );

    const toggleBtn = screen.getByTestId("toggle-rule-panel-btn");
    expect(screen.getByTestId("rule-violations-list")).toBeInTheDocument();

    // Click toggle to collapse
    fireEvent.click(toggleBtn);
    expect(screen.queryByTestId("rule-violations-list")).not.toBeInTheDocument();

    // Click toggle to expand again
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId("rule-violations-list")).toBeInTheDocument();
  });
});
