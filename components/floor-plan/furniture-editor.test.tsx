import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import { FurnitureEditor } from "./furniture-editor";

afterEach(() => {
  cleanup();
});

describe("FurnitureEditor Component (US-11, AC-11)", () => {
  // f1 in VALID_STANDARD_FLOOR_PLAN is sofa-3seat:
  // x: 3000, y: 3500, width: 2100, depth: 900, rotation: 0
  // sofa-3seat allowed ranges: width [1800, 2600, step 100], depth [800, 1050, step 50]

  it("renders furniture metadata, coordinates, and dimensions", () => {
    render(
      <FurnitureEditor
        plan={VALID_STANDARD_FLOOR_PLAN}
        furnitureId="f1"
      />,
    );

    expect(screen.getByTestId("furniture-editor")).toBeInTheDocument();
    expect(screen.getByTestId("furniture-category-badge")).toHaveTextContent(/sofa/i);
    expect(screen.getByTestId("furniture-x-input")).toHaveValue(800);
    expect(screen.getByTestId("furniture-y-input")).toHaveValue(1200);
    expect(screen.getByTestId("furniture-width-input")).toHaveValue(2100);
    expect(screen.getByTestId("furniture-depth-input")).toHaveValue(900);
  });

  it("updates position coordinates and commits to plan (AC-11)", () => {
    const handleUpdatePlan = vi.fn();
    render(
      <FurnitureEditor
        plan={VALID_STANDARD_FLOOR_PLAN}
        furnitureId="f1"
        onUpdatePlan={handleUpdatePlan}
      />,
    );

    const xInput = screen.getByTestId("furniture-x-input");
    const yInput = screen.getByTestId("furniture-y-input");

    fireEvent.change(xInput, { target: { value: "3200" } });
    fireEvent.change(yInput, { target: { value: "3800" } });

    const applyBtn = screen.getByTestId("apply-furniture-btn");
    fireEvent.click(applyBtn);

    expect(handleUpdatePlan).toHaveBeenCalledTimes(1);
    const updatedPlan = handleUpdatePlan.mock.calls[0][0];
    const updatedF1 = updatedPlan.furniture.find((f: any) => f.id === "f1");
    expect(updatedF1.x).toBe(3200);
    expect(updatedF1.y).toBe(3800);
  });

  it("resizes dimensions within limits with immediate preview and apply (AC-11)", () => {
    const handleUpdatePlan = vi.fn();
    render(
      <FurnitureEditor
        plan={VALID_STANDARD_FLOOR_PLAN}
        furnitureId="f1"
        onUpdatePlan={handleUpdatePlan}
      />,
    );

    // Step width up by 100mm -> 2200
    const widthIncBtn = screen.getByTestId("furniture-width-inc-btn");
    fireEvent.click(widthIncBtn);

    const widthInput = screen.getByTestId("furniture-width-input");
    expect(widthInput).toHaveValue(2200);

    // Click Preview (immediate preview)
    const previewBtn = screen.getByTestId("preview-furniture-btn");
    fireEvent.click(previewBtn);

    expect(screen.getByTestId("furniture-preview-details")).toBeInTheDocument();
    expect(screen.getByTestId("preview-furniture-dimensions")).toHaveTextContent("2200 × 900 mm");

    // Click Apply
    const applyBtn = screen.getByTestId("apply-furniture-btn");
    fireEvent.click(applyBtn);

    expect(handleUpdatePlan).toHaveBeenCalledTimes(1);
    const updatedPlan = handleUpdatePlan.mock.calls[0][0];
    const updatedF1 = updatedPlan.furniture.find((f: any) => f.id === "f1");
    expect(updatedF1.width).toBe(2200);
    expect(updatedF1.depth).toBe(900);
  });

  it("rejects invalid dimensions outside allowed bounds with clear error and non-mutation (AC-11)", () => {
    const handleUpdatePlan = vi.fn();
    render(
      <FurnitureEditor
        plan={VALID_STANDARD_FLOOR_PLAN}
        furnitureId="f1"
        onUpdatePlan={handleUpdatePlan}
      />,
    );

    // sofa-3seat width range is [1800, 2600]. Enter 1200 (below min).
    const widthInput = screen.getByTestId("furniture-width-input");
    fireEvent.change(widthInput, { target: { value: "1200" } });

    const applyBtn = screen.getByTestId("apply-furniture-btn");
    fireEvent.click(applyBtn);

    expect(handleUpdatePlan).not.toHaveBeenCalled();
    expect(screen.getByTestId("furniture-error-alert")).toBeInTheDocument();
    expect(screen.getByTestId("furniture-error-message")).toHaveTextContent(
      /1200.*below.*1800|outside.*range/i,
    );
  });

  it("rotates furniture in 90-degree steps (AC-11)", () => {
    const handleUpdatePlan = vi.fn();
    render(
      <FurnitureEditor
        plan={VALID_STANDARD_FLOOR_PLAN}
        furnitureId="f1"
        onUpdatePlan={handleUpdatePlan}
      />,
    );

    const rotateBtn = screen.getByTestId("rotate-furniture-btn");
    fireEvent.click(rotateBtn);

    expect(handleUpdatePlan).toHaveBeenCalledTimes(1);
    const updatedPlan = handleUpdatePlan.mock.calls[0][0];
    const updatedF1 = updatedPlan.furniture.find((f: any) => f.id === "f1");
    expect(updatedF1.rotation).toBe(90);
  });

  it("deletes furniture instance and calls onSelect(null) (AC-11)", () => {
    const handleUpdatePlan = vi.fn();
    const handleSelect = vi.fn();

    render(
      <FurnitureEditor
        plan={VALID_STANDARD_FLOOR_PLAN}
        furnitureId="f1"
        onUpdatePlan={handleUpdatePlan}
        onSelect={handleSelect}
      />,
    );

    const deleteBtn = screen.getByTestId("delete-furniture-btn");
    fireEvent.click(deleteBtn);

    expect(handleSelect).toHaveBeenCalledWith(null);
    expect(handleUpdatePlan).toHaveBeenCalledTimes(1);
    const updatedPlan = handleUpdatePlan.mock.calls[0][0];
    expect(updatedPlan.furniture.some((f: any) => f.id === "f1")).toBe(false);
  });
});
