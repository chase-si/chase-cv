import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FloorPlanShell } from "./floor-plan-shell";
import { RoomSettingsPanel } from "./room-settings-panel";
import { createRectangularRoomPlan } from "@/lib/floor-plan/rectangular-room";
import { CUSTOM_ROOM_STORAGE_KEY, loadCustomRoomStorage } from "@/lib/floor-plan/custom-room-storage";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

const createRoom = async (name = "审查回归") => {
  fireEvent.click(screen.getByTestId("create-room-btn"));
  fireEvent.change(screen.getByTestId("create-room-name-input"), { target: { value: name } });
  fireEvent.click(screen.getByTestId("create-room-submit-btn"));
  await waitFor(() => expect(screen.queryByTestId("create-room-dialog")).not.toBeInTheDocument());
};

describe("Floor-plan review regressions", () => {
  it("keeps furniture unchanged while the create dialog owns keyboard input", async () => {
    render(<FloorPlanShell locale="zh" isMobile={false} />);
    await createRoom();
    fireEvent.click(screen.getByTestId("add-context-furniture-bed-double"));
    const furniture = screen.getByTestId("floor-plan-furniture-layer").innerHTML;
    fireEvent.click(screen.getByTestId("create-room-btn"));
    await waitFor(() => expect(screen.getByTestId("create-room-dialog")).toContainElement(document.activeElement as HTMLElement));
    screen.getByTestId("create-room-submit-btn").focus();
    for (const key of ["Backspace", "Delete", "r", "ArrowRight"]) fireEvent.keyDown(window, { key });
    expect(screen.getByTestId("floor-plan-furniture-layer").innerHTML).toBe(furniture);
  });

  it("uses net area in the SVG and room list, and net lengths for interior spans", async () => {
    render(<FloorPlanShell locale="zh" isMobile={false} />);
    await createRoom();
    expect(screen.getByTestId("floor-plan-room-room-1")).toHaveTextContent("12.0 m²");
    expect(screen.getByTestId("room-item-room-1")).toHaveTextContent("12.0 m²");
    fireEvent.click(screen.getByTestId("toggle-room-spans"));
    expect(screen.getByTestId("floor-plan-dimension-room-room-1-h-0")).toHaveTextContent("3000");
    expect(screen.getByTestId("floor-plan-dimension-room-room-1-v-0")).toHaveTextContent("4000");
  });

  it.each(["toggle", "close", "escape", "backdrop"])("discards unapplied openings when leaving settings using %s", async (exit) => {
    const isMobile = exit !== "toggle";
    const { plan } = createRectangularRoomPlan();
    render(<FloorPlanShell initialActivePlan={plan} locale="zh" isMobile={isMobile} />);
    fireEvent.click(screen.getByTestId(isMobile ? "mobile-room-settings-btn" : "edit-room-settings-btn"));
    fireEvent.click(screen.getByTestId("add-door-draft-btn"));
    expect(screen.getByTestId("floor-plan-openings-layer").children).toHaveLength(1);
    if (exit === "toggle") fireEvent.click(screen.getByTestId("edit-room-settings-btn"));
    if (exit === "close") fireEvent.click(screen.getByTestId("mobile-bottom-sheet-close"));
    if (exit === "escape") fireEvent.keyDown(screen.getByTestId("mobile-bottom-sheet-close"), { key: "Escape" });
    if (exit === "backdrop") {
      fireEvent.mouseDown(screen.getByTestId("mobile-bottom-sheet-backdrop"));
      fireEvent.mouseUp(screen.getByTestId("mobile-bottom-sheet-backdrop"));
      fireEvent.click(screen.getByTestId("mobile-bottom-sheet-backdrop"));
    }
    await waitFor(() => expect(screen.queryByTestId("room-settings-panel")).not.toBeInTheDocument());
    expect(screen.getByTestId("floor-plan-openings-layer").children).toHaveLength(0);
    expect(screen.queryByTestId("measurement-origin-cue")).not.toBeInTheDocument();
  });

  it("reports failed persistence and saves the entire in-memory layout once storage recovers", async () => {
    render(<FloorPlanShell locale="zh" isMobile={false} />);
    await createRoom("房间 A");
    const saved = localStorage.getItem(CUSTOM_ROOM_STORAGE_KEY);
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("full", "QuotaExceededError"); });
    fireEvent.click(screen.getByTestId("add-context-furniture-bed-double"));
    expect(screen.getByRole("alert")).toHaveTextContent("未保存");
    expect(localStorage.getItem(CUSTOM_ROOM_STORAGE_KEY)).toBe(saved);
    await createRoom("房间 B");
    expect(screen.getByRole("alert")).toHaveTextContent("未保存");
    setItem.mockRestore();
    fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
    const roomA = screen.getByRole("button", { name: "房间 A (12.0 m²)" });
    fireEvent.click(roomA);
    expect(screen.getByTestId("placed-furniture-list")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    const restored = loadCustomRoomStorage();
    expect(restored.ok).toBe(true);
    if (restored.ok) {
      expect(restored.doc.rooms).toHaveLength(2);
      expect(restored.doc.rooms.find((r) => r.name === "房间 A")?.plan.furniture).toHaveLength(1);
    }
  });

  it("reports unreadable storage without crashing or replacing its contents", () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new DOMException("denied", "SecurityError"); });
    expect(() => render(<FloorPlanShell locale="zh" isMobile={false} />)).not.toThrow();
    expect(screen.getByRole("alert")).toHaveTextContent("读取");
    getItem.mockRestore();
  });

  it("preserves corrupt stored data while keeping a new room editable", async () => {
    localStorage.setItem(CUSTOM_ROOM_STORAGE_KEY, "{corrupt");
    render(<FloorPlanShell locale="zh" isMobile={false} />);
    expect(screen.getByRole("alert")).toHaveTextContent("读取");
    await createRoom("内存方案");
    fireEvent.click(screen.getByTestId("add-context-furniture-bed-double"));
    expect(screen.getByTestId("placed-furniture-list")).toBeInTheDocument();
    expect(localStorage.getItem(CUSTOM_ROOM_STORAGE_KEY)).toBe("{corrupt");
    expect(screen.getByRole("alert")).toHaveTextContent("未保存");
    // Simulate external recovery, then retry the complete in-memory document.
    localStorage.removeItem(CUSTOM_ROOM_STORAGE_KEY);
    fireEvent.click(screen.getByRole("button", { name: "重试保存" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(loadCustomRoomStorage()).toMatchObject({ ok: true, doc: { rooms: [{ name: "内存方案", plan: { furniture: [expect.anything()] } }] } });
  });

  it("rejects fractional dimensions and parses exponential integer input without truncation", () => {
    const { plan } = createRectangularRoomPlan();
    const apply = vi.fn();
    render(<RoomSettingsPanel plan={plan} onApplyPlan={apply} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByTestId("room-settings-tab-dimensions"));
    fireEvent.change(screen.getByTestId("dimension-width-input"), { target: { value: "3500.5" } });
    expect(screen.getByTestId("apply-dimensions-btn")).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("整数");
    fireEvent.change(screen.getByTestId("dimension-width-input"), { target: { value: "4e3" } });
    fireEvent.click(screen.getByTestId("apply-dimensions-btn"));
    fireEvent.click(screen.getByTestId("confirm-rebuild-btn"));
    expect(apply.mock.calls[0][0].meta.customRoom.widthMm).toBe(4000);
  });

  it.each(["width", "offset"])("retains and rejects invalid opening %s input", (field) => {
    const { plan } = createRectangularRoomPlan();
    render(<RoomSettingsPanel plan={plan} onApplyPlan={vi.fn()} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByTestId("add-door-draft-btn"));
    const input = screen.getByTestId(new RegExp(`draft-${field}-input-`));
    fireEvent.change(input, { target: { value: "100.5" } });
    expect(input).toHaveValue(100.5);
    expect(screen.getByTestId("apply-openings-btn")).toBeDisabled();
    fireEvent.change(input, { target: { value: "" } });
    expect(input).toHaveValue(null);
    expect(screen.getByTestId("apply-openings-btn")).toBeDisabled();
  });
});
