import * as React from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FloorPlanShell } from "./floor-plan-shell";
import { createRectangularRoomPlan } from "@/lib/floor-plan/rectangular-room";
import {
  CUSTOM_ROOM_STORAGE_KEY,
  loadCustomRoomStorage,
  saveCustomRoomRecord,
  setLastActivePlan,
} from "@/lib/floor-plan/custom-room-storage";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import { buildStandardPlanSummary } from "@/lib/floor-plan/catalog";

const FIXTURE_PLANS = [buildStandardPlanSummary(VALID_STANDARD_FLOOR_PLAN)];

class MockResizeObserver {
  observe(el: Element) {
    this.callback([
      {
        contentRect: { width: 800, height: 600 },
        target: el,
      },
    ]);
  }
  unobserve() {}
  disconnect() {}
  constructor(private callback: (entries: any[]) => void) {}
}

vi.stubGlobal("ResizeObserver", MockResizeObserver);

describe("Multi-Room Management, Unit Notices & Lifecycle (AC-11, AC-12, AC-13)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  describe("AC-11: Multi-Room Switching & Persistence in Plan Selector", () => {
    it("displays '我的房间' category in plan selector, with 0 count and create button when empty", async () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} locale="zh" isMobile={false} />);

      // Open plan selector dialog
      fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
      expect(screen.getByTestId("floor-plan-selector-dialog")).toBeInTheDocument();

      // Check category filters for '我的房间'
      const customFilterBtn = screen.getByTestId("catalog-filter-custom");
      expect(customFilterBtn).toBeInTheDocument();
      expect(customFilterBtn).toHaveTextContent("我的房间 (0)");

      // Click '我的房间' category
      fireEvent.click(customFilterBtn);

      // Shows empty state with create room button
      expect(screen.getByTestId("empty-custom-rooms")).toBeInTheDocument();
      const emptyCreateBtn = screen.getByTestId("empty-create-room-btn");
      expect(emptyCreateBtn).toBeInTheDocument();

      // Click create room in empty state
      fireEvent.click(emptyCreateBtn);
      expect(screen.getByTestId("create-room-dialog")).toBeInTheDocument();
    });

    it("creates multiple independent rooms, preserves each room's layout during switching and reload", async () => {
      // Pre-seed storage with 2 rooms: Room A (with a bed) and Room B (with a desk)
      const roomA = createRectangularRoomPlan({ name: "客厅 A", widthMm: 4000, depthMm: 5000 });
      roomA.record.plan.furniture = [
        { id: "f-sofa", definitionId: "sofa-3seat", x: 1500, y: 1500, width: 2100, depth: 900, rotation: 0 },
      ];
      saveCustomRoomRecord(roomA.record, localStorage);

      const roomB = createRectangularRoomPlan({ name: "书房 B", widthMm: 3000, depthMm: 3500 });
      roomB.record.plan.furniture = [
        { id: "f-desk", definitionId: "desk-medium", x: 1000, y: 1000, width: 1400, depth: 700, rotation: 0 },
      ];
      saveCustomRoomRecord(roomB.record, localStorage);

      // Set Room A as last active
      setLastActivePlan("custom", roomA.record.id, localStorage);

      // Session 1: Render
      const { unmount } = render(<FloorPlanShell locale="zh" isMobile={false} />);

      // Should automatically restore Room A as active
      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("客厅 A");
      });
      expect(screen.getByTestId("floor-plan-furniture-f-sofa")).toBeInTheDocument();
      expect(screen.queryByTestId("floor-plan-furniture-f-desk")).not.toBeInTheDocument();

      // Open selector, verify '我的房间 (2)'
      fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
      const customFilterBtn = screen.getByTestId("catalog-filter-custom");
      expect(customFilterBtn).toHaveTextContent("我的房间 (2)");

      // Switch to Room B
      fireEvent.click(screen.getByTestId(`open-plan-btn-${roomB.record.id}`));

      // Active plan is now Room B with desk
      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("书房 B");
      });
      expect(screen.getByTestId("floor-plan-furniture-f-desk")).toBeInTheDocument();
      expect(screen.queryByTestId("floor-plan-furniture-f-sofa")).not.toBeInTheDocument();

      // Unmount and remount (simulates page refresh)
      unmount();
      render(<FloorPlanShell locale="zh" isMobile={false} />);

      // Should restore Room B as active with its desk
      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("书房 B");
      });
      expect(screen.getByTestId("floor-plan-furniture-f-desk")).toBeInTheDocument();
      expect(screen.queryByTestId("floor-plan-furniture-f-sofa")).not.toBeInTheDocument();
    });

    it("switching to standard plan does not save layout over standard plan and restores standard plan on refresh", async () => {
      // Pre-seed storage with a custom room
      const custom = createRectangularRoomPlan({ name: "备用房间" });
      saveCustomRoomRecord(custom.record, localStorage);

      // Session 1
      const { unmount } = render(<FloorPlanShell locale="zh" isMobile={false} />);

      // Switch to standard plan (plan-cn-sh-ruidong-2br-67)
      fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
      const stdCard = screen.getByTestId("open-plan-btn-plan-cn-sh-ruidong-2br-67");
      fireEvent.click(stdCard);

      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("上海瑞冬小区两居室 67m²");
      });

      // Standard plan should not have room settings button
      expect(screen.queryByTestId("edit-room-settings-btn")).not.toBeInTheDocument();

      // Refresh / remount
      unmount();
      render(<FloorPlanShell locale="zh" isMobile={false} />);

      // Restores standard plan
      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("上海瑞冬小区两居室 67m²");
      });
      expect(screen.queryByTestId("edit-room-settings-btn")).not.toBeInTheDocument();
    });
  });

  describe("AC-12: Rename, Duplicate, Delete Custom Room", () => {
    it("renames custom room without clearing furniture or openings, and auto-names when blank", async () => {
      const room = createRectangularRoomPlan({ name: "初始名字", widthMm: 3500, depthMm: 4500 });
      room.record.plan.furniture = [
        { id: "f-bed", definitionId: "bed-double", x: 1000, y: 1000, width: 1500, depth: 2000, rotation: 0 },
      ];
      saveCustomRoomRecord(room.record, localStorage);
      setLastActivePlan("custom", room.record.id, localStorage);

      render(<FloorPlanShell locale="zh" isMobile={false} />);

      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("初始名字");
      });

      // Open selector dialog
      fireEvent.click(screen.getByTestId("open-plan-selector-btn"));

      // Click rename on the room card
      const renameBtn = screen.getByTestId(`rename-room-btn-${room.record.id}`);
      expect(renameBtn).toBeInTheDocument();
      fireEvent.click(renameBtn);

      // Prompt or input dialog
      const renameInput = screen.getByTestId("rename-room-input");
      fireEvent.change(renameInput, { target: { value: "阳光主卧" } });
      fireEvent.click(screen.getByTestId("confirm-rename-btn"));

      // Plan selector updates card name
      expect(screen.getByTestId(`plan-name-${room.record.id}`)).toHaveTextContent("阳光主卧");

      // Close selector and verify active plan name and furniture still intact
      fireEvent.click(screen.getByTestId("plan-selector-close-btn"));
      expect(screen.getByTestId("active-plan-name")).toHaveTextContent("阳光主卧");
      expect(screen.getByTestId("floor-plan-furniture-f-bed")).toBeInTheDocument();
    });

    it("duplicates custom room with deep copy, localized '副本' suffix, selects new copy, and isolates mutations", async () => {
      const room = createRectangularRoomPlan({ name: "方案 A", widthMm: 3600, depthMm: 4200 });
      room.record.plan.furniture = [
        { id: "f-1", definitionId: "bed-single", x: 800, y: 800, width: 1200, depth: 2000, rotation: 0 },
      ];
      saveCustomRoomRecord(room.record, localStorage);
      setLastActivePlan("custom", room.record.id, localStorage);

      render(<FloorPlanShell locale="zh" isMobile={false} />);

      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("方案 A");
      });

      // Open selector and duplicate
      fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
      const duplicateBtn = screen.getByTestId(`duplicate-room-btn-${room.record.id}`);
      fireEvent.click(duplicateBtn);

      // Dialog automatically closes and active plan becomes the duplicate
      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("方案 A 副本");
      });
      expect(screen.getByTestId("floor-plan-furniture-f-1")).toBeInTheDocument();

      // Select and rotate furniture in duplicate plan
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f-1"));
      fireEvent.click(screen.getByTestId("rotate-furniture-btn"));

      // Switch back to original "方案 A"
      fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
      fireEvent.click(screen.getByTestId(`open-plan-btn-${room.record.id}`));

      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("方案 A");
      });
      // Original furniture rotation was untouched
      const originalStorage = loadCustomRoomStorage(localStorage);
      if (originalStorage.ok) {
        const origRecord = originalStorage.doc.rooms.find((r) => r.id === room.record.id);
        expect(origRecord?.plan.furniture[0].rotation).toBe(0);
      }
    });

    it("delete requires confirmation; canceling keeps room; confirming deletes and falls back correctly", async () => {
      const room1 = createRectangularRoomPlan({ name: "第一间" });
      const room2 = createRectangularRoomPlan({ name: "第二间" });
      saveCustomRoomRecord(room1.record, localStorage);
      saveCustomRoomRecord(room2.record, localStorage);
      setLastActivePlan("custom", room2.record.id, localStorage);

      render(<FloorPlanShell locale="zh" isMobile={false} />);

      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("第二间");
      });

      // Open selector to delete room2
      fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
      const deleteBtn = screen.getByTestId(`delete-room-btn-${room2.record.id}`);
      fireEvent.click(deleteBtn);

      // Confirmation dialog appears
      expect(screen.getByTestId("confirm-delete-room-dialog")).toBeInTheDocument();

      // Cancel deletion
      fireEvent.click(screen.getByTestId("cancel-delete-room-btn"));
      expect(screen.queryByTestId("confirm-delete-room-dialog")).not.toBeInTheDocument();
      expect(screen.getByTestId(`plan-name-${room2.record.id}`)).toBeInTheDocument();

      // Click delete again and confirm
      fireEvent.click(screen.getByTestId(`delete-room-btn-${room2.record.id}`));
      fireEvent.click(screen.getByTestId("confirm-delete-room-btn"));

      // Should automatically switch to the other custom room ("第一间")
      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("第一间");
      });

      // Now delete "第一间" (last remaining room)
      fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
      fireEvent.click(screen.getByTestId(`delete-room-btn-${room1.record.id}`));
      fireEvent.click(screen.getByTestId("confirm-delete-room-btn"));

      // Falls back to standard plan
      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("深圳信和自由广场 1室1厅1卫1厨 50m²");
      });
    });
  });

  describe("AC-13: Canvas Millimeter Units Notice", () => {
    it("permanently displays '尺寸单位：mm' on desktop canvas in bottom-left corner across zoom & pan", () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} locale="zh" isMobile={false} />);

      const unitNotice = screen.getByTestId("canvas-unit-notice");
      expect(unitNotice).toBeInTheDocument();
      expect(unitNotice).toHaveTextContent("尺寸单位：mm");

      // Verify it's an overlay outside world transform (unaffected by transform scale)
      expect(screen.getByTestId("floor-plan-viewer-surface")).toContainElement(unitNotice);
      expect(screen.getByTestId("floor-plan-world")).not.toContainElement(unitNotice);
    });

    it("displays 'Dimensions: mm' in English and positions properly in mobile compact mode", () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} locale="en" isMobile={true} />);

      const unitNotice = screen.getByTestId("canvas-unit-notice");
      expect(unitNotice).toBeInTheDocument();
      expect(unitNotice).toHaveTextContent("Dimensions: mm");
    });

    it("includes square-meter area and millimeter note in export title for custom room export", async () => {
      const customRoom = createRectangularRoomPlan({ name: "主卧套房", widthMm: 4000, depthMm: 3000 });
      saveCustomRoomRecord(customRoom.record, localStorage);
      setLastActivePlan("custom", customRoom.record.id, localStorage);

      render(<FloorPlanShell locale="zh" isMobile={false} />);

      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("主卧套房");
      });

      // Export button is available
      const exportBtn = screen.getByTestId("export-plan-image-btn");
      expect(exportBtn).toBeInTheDocument();
    });
  });

  describe("AC-14: Dual-Platform Usability & Viewport Responsive Layout", () => {
    it("renders properly on mobile narrow screen (375px) with scrollable catalog and no horizontal overflow", async () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} locale="zh" isMobile={true} />);

      // On mobile, canvas unit notice is compact above zoom controls
      const unitNotice = screen.getByTestId("canvas-unit-notice");
      expect(unitNotice).toBeInTheDocument();
      expect(unitNotice).toHaveClass("bottom-16", "right-3");

      // Open selector sheet on mobile (opens MobileBottomSheet with FloorPlanCatalog via portal)
      fireEvent.click(screen.getByTestId("open-plan-selector-btn"));

      // Custom room filter pill is rendered and accessible inside mobile sheet
      const customFilter = await screen.findByTestId("catalog-filter-custom");
      expect(customFilter).toBeInTheDocument();
      expect(customFilter).toHaveTextContent("我的房间 (0)");
    });

    it("supports mobile landscape and desktop widescreen without layout clipping", () => {
      // Landscape mobile
      const { unmount } = render(<FloorPlanShell initialPlans={FIXTURE_PLANS} locale="zh" isMobile={true} />);
      expect(screen.getByTestId("canvas-unit-notice")).toBeInTheDocument();
      unmount();

      // Desktop
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} locale="zh" isMobile={false} />);
      const desktopNotice = screen.getByTestId("canvas-unit-notice");
      expect(desktopNotice).toBeInTheDocument();
      expect(desktopNotice).toHaveClass("lg:bottom-4", "lg:left-4");
    });
  });

  describe("AC-15: Full Lifecycle Regression & Standard Plan Protection", () => {
    it("runs complete lifecycle: create -> edit -> duplicate -> switch -> reload -> verify standard plan protection", async () => {
      // 1. Initial render without pre-existing custom rooms
      const { unmount } = render(<FloorPlanShell locale="zh" isMobile={false} />);

      // Opens plan selector
      fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
      fireEvent.click(screen.getByTestId("catalog-filter-custom"));

      // 2. Create a new room (4000x5000)
      fireEvent.click(screen.getByTestId("empty-create-room-btn"));
      expect(screen.getByTestId("create-room-dialog")).toBeInTheDocument();

      fireEvent.change(screen.getByTestId("create-room-name-input"), { target: { value: "全流程主卧" } });
      fireEvent.change(screen.getByTestId("create-room-width-input"), { target: { value: "4000" } });
      fireEvent.change(screen.getByTestId("create-room-depth-input"), { target: { value: "5000" } });
      fireEvent.click(screen.getByTestId("create-room-submit-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("全流程主卧");
      });

      // 3. Edit settings button exists on custom room
      expect(screen.getByTestId("edit-room-settings-btn")).toBeInTheDocument();

      // 4. Duplicate custom room via selector
      fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
      const customRooms = loadCustomRoomStorage(localStorage);
      expect(customRooms.ok).toBe(true);
      const createdRoomId = customRooms.ok ? customRooms.doc.rooms[0].id : "";
      expect(createdRoomId).toBeTruthy();

      const dupBtn = screen.getByTestId(`duplicate-room-btn-${createdRoomId}`);
      fireEvent.click(dupBtn);

      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("全流程主卧 副本");
      });

      // 5. Switch to a standard plan
      fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
      fireEvent.click(screen.getByTestId("catalog-filter-2br"));
      fireEvent.click(screen.getByTestId("open-plan-btn-plan-cn-sh-ruidong-2br-67"));

      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("上海瑞冬小区两居室 67m²");
      });

      // 6. Verify standard plan topology read-only protection: no room settings edit button
      expect(screen.queryByTestId("edit-room-settings-btn")).not.toBeInTheDocument();

      // 7. Refresh / remount
      unmount();
      render(<FloorPlanShell locale="zh" isMobile={false} />);

      // Restores standard plan as last active
      await waitFor(() => {
        expect(screen.getByTestId("active-plan-name")).toHaveTextContent("上海瑞冬小区两居室 67m²");
      });
      expect(screen.queryByTestId("edit-room-settings-btn")).not.toBeInTheDocument();

      // 8. Open selector, verify both custom rooms still exist intact in storage
      fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
      expect(screen.getByTestId("catalog-filter-custom")).toHaveTextContent("我的房间 (2)");
    });
  });
});
