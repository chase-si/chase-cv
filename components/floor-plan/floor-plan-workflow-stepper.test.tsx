import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getFloorPlanI18n } from "@/lib/floor-plan/i18n";
import {
  FloorPlanWorkflowStepper,
  type WorkflowStage,
} from "./floor-plan-workflow-stepper";

afterEach(() => {
  cleanup();
});

describe("FloorPlanWorkflowStepper", () => {
  const i18nEn = getFloorPlanI18n("en");
  const i18nZh = getFloorPlanI18n("zh");

  it("renders all 4 stages with correct labels and accessibility marks in English", () => {
    const handleSelectStage = vi.fn();
    render(
      <FloorPlanWorkflowStepper
        currentStage="plan"
        completedStages={[]}
        onSelectStage={handleSelectStage}
        t={i18nEn.t}
      />,
    );

    const stepper = screen.getByTestId("floor-plan-stage-stepper");
    expect(stepper).toBeInTheDocument();

    const planStep = screen.getByTestId("stage-step-plan");
    const roomStep = screen.getByTestId("stage-step-room");
    const furnitureStep = screen.getByTestId("stage-step-furniture");
    const decisionStep = screen.getByTestId("stage-step-decision");

    expect(planStep).toHaveAttribute("aria-current", "step");
    expect(roomStep).not.toHaveAttribute("aria-current");
    expect(furnitureStep).not.toHaveAttribute("aria-current");
    expect(decisionStep).not.toHaveAttribute("aria-current");

    expect(planStep).toHaveTextContent("Plan");
    expect(roomStep).toHaveTextContent("Room");
    expect(furnitureStep).toHaveTextContent("Furniture");
    expect(decisionStep).toHaveTextContent("Decision");
  });

  it("renders stages in Chinese when locale is zh", () => {
    const handleSelectStage = vi.fn();
    render(
      <FloorPlanWorkflowStepper
        currentStage="room"
        completedStages={["plan"]}
        onSelectStage={handleSelectStage}
        t={i18nZh.t}
      />,
    );

    expect(screen.getByTestId("stage-step-plan")).toHaveTextContent("户型");
    expect(screen.getByTestId("stage-step-room")).toHaveTextContent("房间");
    expect(screen.getByTestId("stage-step-furniture")).toHaveTextContent("家具");
    expect(screen.getByTestId("stage-step-decision")).toHaveTextContent("结论");

    // Room is active
    expect(screen.getByTestId("stage-step-room")).toHaveAttribute("aria-current", "step");

    // Clicking completed stage "plan" calls onSelectStage("plan")
    fireEvent.click(screen.getByTestId("stage-step-plan"));
    expect(handleSelectStage).toHaveBeenCalledWith("plan");
  });

  it("allows navigating to active and completed stages", () => {
    const handleSelectStage = vi.fn();
    render(
      <FloorPlanWorkflowStepper
        currentStage="furniture"
        completedStages={["plan", "room"]}
        onSelectStage={handleSelectStage}
        t={i18nEn.t}
      />,
    );

    // Clicking room navigates to room
    fireEvent.click(screen.getByTestId("stage-step-room"));
    expect(handleSelectStage).toHaveBeenCalledWith("room");
  });
});
