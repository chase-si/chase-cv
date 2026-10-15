import * as React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRectangularRoomPlan } from "@/lib/floor-plan/rectangular-room";
import { RoomSettingsPanel } from "./room-settings-panel";

afterEach(() => {
  cleanup();
});

describe("RoomSettingsPanel (AC-6, AC-7, AC-8, AC-9)", () => {
  const { plan: basePlan } = createRectangularRoomPlan({
    widthMm: 3000,
    depthMm: 4000,
    name: "主卧",
  });

  it("renders openings tab by default with add door and add window buttons", () => {
    render(
      <RoomSettingsPanel
        plan={basePlan}
        onApplyPlan={vi.fn()}
        onCancel={vi.fn()}
        locale="zh"
      />,
    );

    expect(screen.getByTestId("room-settings-tab-openings")).toBeInTheDocument();
    expect(screen.getByTestId("room-settings-tab-dimensions")).toBeInTheDocument();
    expect(screen.getByTestId("add-door-draft-btn")).toBeInTheDocument();
    expect(screen.getByTestId("add-window-draft-btn")).toBeInTheDocument();
  });

  it("AC-7: adds new door draft with default 900mm width and 0mm offset, and triggers draft preview", () => {
    const onDraftPreviewChange = vi.fn();
    render(
      <RoomSettingsPanel
        plan={basePlan}
        onApplyPlan={vi.fn()}
        onCancel={vi.fn()}
        onDraftPreviewChange={onDraftPreviewChange}
        locale="zh"
      />,
    );

    fireEvent.click(screen.getByTestId("add-door-draft-btn"));

    const widthInput = screen.getByTestId(/draft-width-input/);
    const offsetInput = screen.getByTestId(/draft-offset-input/);
    expect(widthInput).toHaveValue(900);
    expect(offsetInput).toHaveValue(0);

    expect(onDraftPreviewChange).toHaveBeenCalled();
    const lastCall = onDraftPreviewChange.mock.calls.at(-1)!;
    expect(lastCall[0]?.openings).toHaveLength(1);
    expect(lastCall[0]?.openings[0].width).toBe(900);
  });

  it("AC-8: validates exceeding wall length and disables apply button with error message", () => {
    render(
      <RoomSettingsPanel
        plan={basePlan}
        onApplyPlan={vi.fn()}
        onCancel={vi.fn()}
        locale="zh"
      />,
    );

    fireEvent.click(screen.getByTestId("add-door-draft-btn"));
    const offsetInput = screen.getByTestId(/draft-offset-input/);

    // Wall clear length is 3000. offset 2500 + width 900 = 3400 > 3000
    fireEvent.change(offsetInput, { target: { value: "2500" } });

    expect(screen.getByTestId(/draft-error/)).toBeInTheDocument();
    const applyBtn = screen.getByTestId("apply-openings-btn");
    expect(applyBtn).toBeDisabled();
  });

  it("AC-6: applies valid opening drafts to formal plan", () => {
    const onApplyPlan = vi.fn();
    render(
      <RoomSettingsPanel
        plan={basePlan}
        onApplyPlan={onApplyPlan}
        onCancel={vi.fn()}
        locale="zh"
      />,
    );

    fireEvent.click(screen.getByTestId("add-door-draft-btn"));
    fireEvent.click(screen.getByTestId("apply-openings-btn"));

    expect(onApplyPlan).toHaveBeenCalledTimes(1);
    const appliedPlan = onApplyPlan.mock.calls[0][0];
    expect(appliedPlan.openings).toHaveLength(1);
    expect(appliedPlan.openings[0].type).toBe("door");
    expect(appliedPlan.openings[0].width).toBe(900);
  });

  it("AC-6: cancel button calls onCancel and does not apply drafts", () => {
    const onApplyPlan = vi.fn();
    const onCancel = vi.fn();
    render(
      <RoomSettingsPanel
        plan={basePlan}
        onApplyPlan={onApplyPlan}
        onCancel={onCancel}
        locale="zh"
      />,
    );

    fireEvent.click(screen.getByTestId("add-door-draft-btn"));
    fireEvent.click(screen.getByTestId("cancel-openings-btn"));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onApplyPlan).not.toHaveBeenCalled();
  });

  it("AC-9: modifying dimensions triggers clear confirmation dialog, confirming clears all furniture and openings", () => {
    const planWithItems = {
      ...basePlan,
      openings: [
        { id: "op1", type: "door" as const, wallId: "w-top", position: 0.5, width: 900 },
      ],
      furniture: [
        { id: "f1", definitionId: "bed-double", x: 1000, y: 1000, width: 1500, depth: 2000, rotation: 0 },
      ],
    };

    const onApplyPlan = vi.fn();
    render(
      <RoomSettingsPanel
        plan={planWithItems}
        onApplyPlan={onApplyPlan}
        onCancel={vi.fn()}
        locale="zh"
      />,
    );

    // Switch to dimensions tab
    fireEvent.click(screen.getByTestId("room-settings-tab-dimensions"));

    const widthInput = screen.getByTestId("dimension-width-input");
    fireEvent.change(widthInput, { target: { value: "3600" } });

    // Click apply
    fireEvent.click(screen.getByTestId("apply-dimensions-btn"));

    // Confirmation dialog appears
    expect(screen.getByTestId("confirm-rebuild-dimensions-dialog")).toBeInTheDocument();
    expect(screen.getByText(/清空本房间全部门窗和家具/)).toBeInTheDocument();

    // Confirm rebuild
    fireEvent.click(screen.getByTestId("confirm-rebuild-btn"));

    expect(onApplyPlan).toHaveBeenCalledTimes(1);
    const appliedPlan = onApplyPlan.mock.calls[0][0];
    expect(appliedPlan.meta.customRoom?.widthMm).toBe(3600);
    expect(appliedPlan.openings).toHaveLength(0);
    expect(appliedPlan.furniture).toHaveLength(0);
  });

  it("AC-9: renaming without dimension change applies immediately without confirmation", () => {
    const onApplyPlan = vi.fn();
    render(
      <RoomSettingsPanel
        plan={basePlan}
        onApplyPlan={onApplyPlan}
        onCancel={vi.fn()}
        locale="zh"
      />,
    );

    fireEvent.click(screen.getByTestId("room-settings-tab-dimensions"));
    const nameInput = screen.getByTestId("dimension-name-input");
    fireEvent.change(nameInput, { target: { value: "次卧" } });

    fireEvent.click(screen.getByTestId("apply-dimensions-btn"));

    expect(screen.queryByTestId("confirm-rebuild-dimensions-dialog")).not.toBeInTheDocument();
    expect(onApplyPlan).toHaveBeenCalledTimes(1);
    expect(onApplyPlan.mock.calls[0][0].meta.name).toBe("次卧");
  });
});
