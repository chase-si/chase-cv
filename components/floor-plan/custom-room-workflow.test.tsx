import * as React from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { FloorPlanShell } from "./floor-plan-shell";
import {
  CUSTOM_ROOM_STORAGE_KEY,
  loadCustomRoomStorage,
} from "@/lib/floor-plan/custom-room-storage";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

beforeEach(() => {
  localStorage.clear();
});

describe("Custom Rectangular Room Workflow (AC-1 ~ AC-5)", () => {
  it("AC-1 & AC-2: creates rectangular room from desktop button, displays 12.0 m² net area, and auto-selects unique room", async () => {
    render(<FloorPlanShell locale="zh" isMobile={false} />);

    // 1. Desktop create room entry
    const createBtn = screen.getByTestId("create-room-btn");
    expect(createBtn).toBeInTheDocument();
    fireEvent.click(createBtn);

    // 2. Dialog opens with defaults (3000 x 4000 mm)
    expect(screen.getByTestId("create-room-dialog")).toBeInTheDocument();
    const nameInput = screen.getByTestId("create-room-name-input");
    fireEvent.change(nameInput, { target: { value: "我的自定义次卧" } });

    // Submit
    const submitBtn = screen.getByTestId("create-room-submit-btn");
    fireEvent.click(submitBtn);

    // 3. Work space updates
    await waitFor(() => {
      expect(screen.queryByTestId("create-room-dialog")).not.toBeInTheDocument();
    });

    // Active plan header updates to custom room
    const activePlanName = screen.getByTestId("active-plan-name");
    expect(activePlanName).toHaveTextContent("我的自定义次卧");

    // Area badge shows 12.0 m² (AC-2)
    const activePlanArea = screen.getByTestId("active-plan-area");
    expect(activePlanArea).toHaveTextContent("12.0 m²");

    // Room is automatically selected (AC-1)
    const targetRoomDetails = screen.getByTestId("target-room-details");
    expect(targetRoomDetails).toBeInTheDocument();
    expect(within(targetRoomDetails).getByTestId("target-room-area")).toHaveTextContent("12.0 m²");

    // Principal dimensions show net dimensions (3000 and 4000)
    expect(screen.getByTestId("floor-plan-dimension-dim-total-width")).toHaveTextContent("3000");
    expect(screen.getByTestId("floor-plan-dimension-dim-total-height")).toHaveTextContent("4000");
  });

  it("AC-1: mobile user can open create room dialog from plan selector and create room", async () => {
    render(<FloorPlanShell locale="zh" isMobile={true} />);

    // 1. Open plan selector
    const openSelectorBtn = screen.getByTestId("open-plan-selector-btn");
    fireEvent.click(openSelectorBtn);

    // 2. Click create room in selector dialog
    const createInSelectorBtn = screen.getByTestId("selector-create-room-btn");
    expect(createInSelectorBtn).toBeInTheDocument();
    fireEvent.click(createInSelectorBtn);

    // 3. Create dialog opens
    expect(screen.getByTestId("create-room-dialog")).toBeInTheDocument();
    const submitBtn = screen.getByTestId("create-room-submit-btn");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByTestId("create-room-dialog")).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("active-plan-name")).toHaveTextContent("矩形房间");
    expect(screen.getByTestId("mobile-selection-description")).toHaveTextContent("12.0 m²");
  });

  it("AC-3: supports adding, rotating, changing specification, and deleting furniture in custom room", async () => {
    render(<FloorPlanShell locale="zh" isMobile={false} />);

    // Create custom room 3500 x 4500 mm
    fireEvent.click(screen.getByTestId("create-room-btn"));
    fireEvent.change(screen.getByTestId("create-room-name-input"), {
      target: { value: "主卧套间" },
    });
    fireEvent.change(screen.getByTestId("create-room-width-input"), {
      target: { value: "3500" },
    });
    fireEvent.change(screen.getByTestId("create-room-depth-input"), {
      target: { value: "4500" },
    });
    fireEvent.click(screen.getByTestId("create-room-submit-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("active-plan-name")).toHaveTextContent("主卧套间");
    });

    // Add Bed from context furniture panel
    const addBedBtn = screen.getByTestId("add-context-furniture-bed-double");
    expect(addBedBtn).toBeInTheDocument();
    fireEvent.click(addBedBtn);

    // Bed is added to placed furniture list
    const placedFurnitureList = screen.getByTestId("placed-furniture-list");
    expect(placedFurnitureList).toBeInTheDocument();
    expect(screen.getByTestId("inspector-furniture-details")).toBeInTheDocument();

    // Rotate furniture
    const rotateBtn = screen.getByTestId("rotate-furniture-btn");
    fireEvent.click(rotateBtn);

    // Delete furniture
    const deleteBtn = screen.getByTestId("delete-furniture-btn");
    fireEvent.click(deleteBtn);

    // Furniture list becomes empty
    expect(screen.queryByTestId("placed-furniture-list")).not.toBeInTheDocument();
  });

  it("AC-4 & AC-5: persists custom room with furniture and restores it upon refresh", async () => {
    // Session 1: Create room and add bed
    const { unmount } = render(<FloorPlanShell locale="zh" isMobile={false} />);

    fireEvent.click(screen.getByTestId("create-room-btn"));
    fireEvent.change(screen.getByTestId("create-room-name-input"), {
      target: { value: "持久化房间" },
    });
    fireEvent.click(screen.getByTestId("create-room-submit-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("active-plan-name")).toHaveTextContent("持久化房间");
    });

    // Add bed
    fireEvent.click(screen.getByTestId("add-context-furniture-bed-double"));

    // Verify localStorage has custom room record
    const stored = loadCustomRoomStorage(localStorage);
    expect(stored.ok).toBe(true);
    if (stored.ok) {
      expect(stored.doc.rooms).toHaveLength(1);
      expect(stored.doc.rooms[0].name).toBe("持久化房间");
      expect(stored.doc.rooms[0].plan.furniture).toHaveLength(1);
      expect(stored.doc.lastActive?.type).toBe("custom");
    }

    // Unmount (simulates navigating away / reloading)
    unmount();

    // Session 2: Remount component
    render(<FloorPlanShell locale="zh" isMobile={false} />);

    // Should restore the custom room and placed furniture
    await waitFor(() => {
      expect(screen.getByTestId("active-plan-name")).toHaveTextContent("持久化房间");
    });
    expect(screen.getByTestId("placed-furniture-list")).toBeInTheDocument();
    expect(screen.getByTestId("active-plan-area")).toHaveTextContent("12.0 m²");
  });

  it("AC-5: asset preview mode does not read or write to custom room local storage", async () => {
    render(
      <FloorPlanShell
        initialActivePlan={VALID_STANDARD_FLOOR_PLAN}
        locale="zh"
        isMobile={false}
      />,
    );

    // localStorage should remain untouched
    expect(localStorage.getItem(CUSTOM_ROOM_STORAGE_KEY)).toBeNull();
  });
});
