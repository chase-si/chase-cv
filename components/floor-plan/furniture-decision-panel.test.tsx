import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { FloorPlan } from "@/lib/floor-plan";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures";
import type { RuleResult } from "@/lib/floor-plan/rules";
import { FurnitureDecisionControls } from "./furniture-decision-controls";
import { FurnitureDecisionPanel } from "./furniture-decision-panel";

afterEach(() => {
  cleanup();
});

describe("FurnitureDecisionPanel Component (AC-14, AC-15, AC-16, AC-17)", () => {
  const getPlan = (): FloorPlan => JSON.parse(JSON.stringify(VALID_STANDARD_FLOOR_PLAN));

  describe("AC-14: Four Mutually Exclusive Statuses", () => {
    it("renders 'suitable' status badge when no issues affect target furniture", () => {
      const plan = getPlan();
      render(
        <FurnitureDecisionPanel
          plan={plan}
          targetRoomId="r2"
          targetFurnitureId="f2"
          ruleResults={[]}
          locale="zh"
        />,
      );

      expect(screen.getByTestId("furniture-decision-panel")).toBeInTheDocument();
      const badge = screen.getByTestId("decision-status-badge");
      expect(badge).toHaveTextContent("适合");
      expect(screen.getByTestId("decision-status-suitable")).toBeInTheDocument();
    });

    it("renders 'not-recommended' status badge when target furniture has collision or boundary error", () => {
      const plan = getPlan();
      const violations: RuleResult[] = [
        {
          ruleId: "furniture-boundary",
          severity: "error",
          relatedEntityIds: ["f2"],
          relatedObjectIds: ["f2"],
          measuredValue: 120,
          recommendedValue: "Inside room",
          title: "Boundary Violation",
          message: 'Furniture "f2" is placed outside room boundaries.',
        },
      ];

      render(
        <FurnitureDecisionPanel
          plan={plan}
          targetRoomId="r2"
          targetFurnitureId="f2"
          ruleResults={violations}
          locale="zh"
        />,
      );

      const badge = screen.getByTestId("decision-status-badge");
      expect(badge).toHaveTextContent("不建议");
      expect(screen.getByTestId("decision-status-not-recommended")).toBeInTheDocument();
    });

    it("renders 'caution' status badge when target furniture has warning but no errors", () => {
      const plan = getPlan();
      const violations: RuleResult[] = [
        {
          ruleId: "furniture-clearance",
          severity: "warning",
          relatedEntityIds: ["f2", "w2"],
          relatedObjectIds: ["f2", "w2"],
          measuredValue: 400,
          recommendedValue: 600,
          title: "Furniture Clearance",
          message: "Clearance is tight.",
        },
      ];

      render(
        <FurnitureDecisionPanel
          plan={plan}
          targetRoomId="r2"
          targetFurnitureId="f2"
          ruleResults={violations}
          locale="zh"
        />,
      );

      const badge = screen.getByTestId("decision-status-badge");
      expect(badge).toHaveTextContent("需要权衡");
      expect(screen.getByTestId("decision-status-caution")).toBeInTheDocument();
    });

    it("renders 'unavailable' status badge for uncalibrated plan", () => {
      const plan = getPlan();
      plan.meta.unscaled = true;

      render(
        <FurnitureDecisionPanel
          plan={plan}
          targetRoomId="r2"
          targetFurnitureId="f2"
          ruleResults={[]}
          locale="zh"
        />,
      );

      const badge = screen.getByTestId("decision-status-badge");
      expect(badge).toHaveTextContent("暂无法判断");
      expect(screen.getByTestId("decision-status-unavailable")).toBeInTheDocument();
    });

    it("renders 'must-adjust' status badge when SpaceAssessment indicates must-adjust (AC-7)", () => {
      const plan = getPlan();
      const assessment = {
        status: "must-adjust" as const,
        findings: [
          {
            kind: "wall-overlap" as const,
            placementId: "f2",
            wallId: "w2",
            measuredMm: 80,
          },
        ],
      };

      render(
        <FurnitureDecisionPanel
          plan={plan}
          targetRoomId="r2"
          targetFurnitureId="f2"
          assessment={assessment}
          locale="zh"
        />,
      );

      const badge = screen.getByTestId("decision-status-badge");
      expect(badge).toHaveTextContent("必须调整");
      expect(screen.getByTestId("decision-status-must-adjust")).toBeInTheDocument();
      expect(screen.getByTestId("decision-summary")).toHaveTextContent("必须调整");
      expect(screen.getByTestId("decision-summary")).not.toHaveTextContent("未发现问题");
      expect(screen.getByTestId("decision-issues-list")).toBeInTheDocument();
    });

    it("renders 'unavailable' status badge and withholds clearance pass conclusion when SpaceAssessment indicates unavailable (AC-14)", () => {
      const plan = getPlan();
      const assessment = {
        status: "unavailable" as const,
        findings: [],
      };

      render(
        <FurnitureDecisionPanel
          plan={plan}
          targetRoomId="r2"
          targetFurnitureId="f2"
          assessment={assessment}
          locale="zh"
        />,
      );

      const badge = screen.getByTestId("decision-status-badge");
      expect(badge).toHaveTextContent("暂无法判断");
      expect(screen.getByTestId("decision-status-unavailable")).toBeInTheDocument();
      expect(screen.getByTestId("decision-summary")).toHaveTextContent("需要可靠真实尺寸");
      expect(screen.getByTestId("decision-summary")).not.toHaveTextContent("未发现问题");
      expect(screen.queryByTestId("decision-clean-notice")).not.toBeInTheDocument();
    });
  });

  describe("AC-15: Room & Furniture Details, Dimensions & Qualified Copy", () => {
    it("displays room name, furniture name, width and depth dimensions in title and summary", () => {
      const plan = getPlan();
      render(
        <FurnitureDecisionPanel
          plan={plan}
          targetRoomId="r2"
          targetFurnitureId="f2"
          ruleResults={[]}
          locale="zh"
        />,
      );

      expect(screen.getByTestId("decision-title")).toBeInTheDocument();
      expect(screen.getByTestId("decision-summary")).toHaveTextContent("当前规则未发现问题");
      expect(screen.getByTestId("decision-dimensions")).toHaveTextContent("1800 × 2000 mm");
      expect(screen.getByTestId("decision-disclaimer")).toBeInTheDocument();
      expect(screen.getByTestId("decision-disclaimer")).toHaveTextContent("不构成施工");
    });

    it("renders English locale strings accurately", () => {
      const plan = getPlan();
      render(
        <FurnitureDecisionPanel
          plan={plan}
          targetRoomId="r2"
          targetFurnitureId="f2"
          ruleResults={[]}
          locale="en"
        />,
      );

      const badge = screen.getByTestId("decision-status-badge");
      expect(badge).toHaveTextContent("Suitable");
      expect(screen.getByTestId("decision-summary")).toHaveTextContent("No issues found under current rules");
    });
  });

  describe("AC-16: Prioritized Issues with Measured & Recommended Values", () => {
    it("displays relevant issues with reason, measured and recommended values", () => {
      const plan = getPlan();
      const violations: RuleResult[] = [
        {
          ruleId: "furniture-wall-collision",
          severity: "error",
          relatedEntityIds: ["f2", "w3"],
          relatedObjectIds: ["f2", "w3"],
          measuredValue: 3500,
          recommendedValue: "0 mm²",
          title: "Wall Collision",
          message: 'Furniture "f2" collides with wall "w3".',
        },
        // Unrelated violation
        {
          ruleId: "furniture-boundary",
          severity: "error",
          relatedEntityIds: ["f1"],
          relatedObjectIds: ["f1"],
          measuredValue: 100,
          recommendedValue: "Inside room",
          title: "Boundary Violation",
          message: 'Furniture "f1" is outside room.',
        },
      ];

      render(
        <FurnitureDecisionPanel
          plan={plan}
          targetRoomId="r2"
          targetFurnitureId="f2"
          ruleResults={violations}
          locale="zh"
        />,
      );

      // Only relevant issue should be shown in priority list
      expect(screen.getByTestId("decision-issues-list")).toBeInTheDocument();
      expect(screen.getByTestId("decision-issue-furniture-wall-collision")).toBeInTheDocument();
      expect(screen.queryByTestId("decision-issue-furniture-boundary")).not.toBeInTheDocument();

      // Check measured & recommended values
      expect(screen.getByTestId("decision-measured-furniture-wall-collision")).toHaveTextContent("3500 mm²");
      expect(screen.getByTestId("decision-recommended-furniture-wall-collision")).toHaveTextContent("0 mm²");
    });
  });

  describe("AC-17: Navigating and Selecting Affected Entities", () => {
    it("allows clicking affected entity buttons to select furniture, wall, opening, or room", () => {
      const plan = getPlan();
      const handleSelect = vi.fn();

      const violations: RuleResult[] = [
        {
          ruleId: "furniture-wall-collision",
          severity: "error",
          relatedEntityIds: ["f2", "w3"],
          relatedObjectIds: ["f2", "w3"],
          measuredValue: 2000,
          recommendedValue: "0 mm²",
          title: "Wall Collision",
          message: "Collision with wall.",
        },
        {
          ruleId: "opening-keep-clear",
          severity: "warning",
          relatedEntityIds: ["f2", "door2"],
          relatedObjectIds: ["f2", "door2"],
          measuredValue: 300,
          recommendedValue: "800 mm",
          title: "Door Swing Clearance",
          message: "Door swing blocked.",
        },
      ];

      render(
        <FurnitureDecisionPanel
          plan={plan}
          targetRoomId="r2"
          targetFurnitureId="f2"
          ruleResults={violations}
          onSelectEntity={handleSelect}
          locale="zh"
        />,
      );

      // Click wall entity button
      const wallBtn = screen.getByTestId("decision-entity-btn-w3");
      expect(wallBtn).toBeInTheDocument();
      fireEvent.click(wallBtn);
      expect(handleSelect).toHaveBeenCalledWith({ type: "wall", id: "w3" });

      // Click opening entity button
      const doorBtn = screen.getByTestId("decision-entity-btn-door2");
      expect(doorBtn).toBeInTheDocument();
      fireEvent.click(doorBtn);
      expect(handleSelect).toHaveBeenCalledWith({ type: "opening", id: "door2" });

      // Click furniture entity button
      const f2Btn = screen.getAllByTestId("decision-entity-btn-f2")[0];
      expect(f2Btn).toBeInTheDocument();
      fireEvent.click(f2Btn);
      expect(handleSelect).toHaveBeenCalledWith({ type: "furniture", id: "f2" });
    });

    it("renders below-minimum-clearance and below-recommended-clearance findings with side, measuredMm, minimumMm, and recommendedMm (AC-12)", () => {
      const plan = getPlan();
      const assessment = {
        status: "must-adjust" as const,
        findings: [
          {
            kind: "below-minimum-clearance" as const,
            placementId: "f2",
            wallId: "w3",
            side: "front" as const,
            measuredMm: 450,
            minimumMm: 600,
            recommendedMm: 900,
          },
          {
            kind: "below-recommended-clearance" as const,
            placementId: "f2",
            relatedPlacementId: "f1",
            side: "left" as const,
            measuredMm: 650,
            minimumMm: 600,
            recommendedMm: 750,
          },
        ],
      };

      render(
        <FurnitureDecisionPanel
          plan={plan}
          targetRoomId="r2"
          targetFurnitureId="f2"
          assessment={assessment}
          locale="zh"
        />,
      );

      const minIssue = screen.getByTestId("decision-issue-below-minimum-clearance");
      expect(minIssue).toBeInTheDocument();
      expect(minIssue).toHaveTextContent("前方 (front)");
      expect(minIssue).toHaveTextContent("450 mm");
      expect(minIssue).toHaveTextContent("最低 600 mm / 推荐 900 mm");

      const recIssue = screen.getByTestId("decision-issue-below-recommended-clearance");
      expect(recIssue).toBeInTheDocument();
      expect(recIssue).toHaveTextContent("左侧 (left)");
      expect(recIssue).toHaveTextContent("650 mm");
      expect(recIssue).toHaveTextContent("最低 600 mm / 推荐 750 mm");
    });
  });

  describe("AC-4 & AC-5: Predefined Specification Controls in FurnitureDecisionControls & FurnitureDecisionPanel", () => {
    it("renders predefined specifications in FurnitureDecisionControls without arbitrary size controls, and switches specification while keeping center and rotation unchanged", () => {
      const plan = getPlan();
      // f2 is bed-double at (4300, 1200)
      plan.furniture = plan.furniture.map((f) =>
        f.id === "f2"
          ? { ...f, specificationId: "bed-double-1800", x: 4300, y: 1200, rotation: 90 }
          : f,
      );
      const handleUpdatePlan = vi.fn();

      render(
        <FurnitureDecisionControls
          plan={plan}
          targetRoomId="r2"
          targetFurnitureId="f2"
          ruleResults={[]}
          locale="zh"
          onUpdatePlan={handleUpdatePlan}
        />,
      );

      expect(screen.getByTestId("decision-controls-specifications")).toBeInTheDocument();
      const spec1800 = screen.getByTestId("decision-spec-option-bed-double-1800");
      const spec1500 = screen.getByTestId("decision-spec-option-bed-double-1500");
      expect(spec1800).toHaveTextContent("1800 × 2000 mm");
      expect(spec1500).toHaveTextContent("1500 × 2000 mm");

      // No arbitrary width/depth inputs or arbitrary width steppers like 1.6m
      expect(screen.queryByTestId("furniture-width-input")).not.toBeInTheDocument();
      expect(screen.queryByTestId("furniture-depth-input")).not.toBeInTheDocument();
      expect(screen.queryByText("1.6m")).not.toBeInTheDocument();

      // Switch to bed-double-1500
      fireEvent.click(spec1500);
      expect(handleUpdatePlan).toHaveBeenCalledTimes(1);
      const updatedPlan = handleUpdatePlan.mock.calls[0][0];
      const updatedBed = updatedPlan.furniture.find((f: any) => f.id === "f2");
      expect(updatedBed.specificationId).toBe("bed-double-1500");
      expect(updatedBed.width).toBe(1500);
      expect(updatedBed.depth).toBe(2000);
      expect(updatedBed.x).toBe(4300);
      expect(updatedBed.y).toBe(1200);
      expect(updatedBed.rotation).toBe(90);
    });
  });
});
