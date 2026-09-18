import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import { STUDIO_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/standard-plans";
import { RoomSpanEditor } from "./room-span-editor";

afterEach(() => {
  cleanup();
});

describe("RoomSpanEditor Component (AC-6, AC-7)", () => {
  it("renders room width and depth spans with numeric controls in draft mode", () => {
    const handleUpdatePlan = vi.fn();
    render(
      <RoomSpanEditor
        plan={VALID_STANDARD_FLOOR_PLAN}
        roomId="r1"
        onUpdatePlan={handleUpdatePlan}
      />,
    );

    // Displays span editor container
    expect(screen.getByTestId("room-span-editor")).toBeInTheDocument();

    // Displays current spans
    expect(screen.getByTestId("room-span-summary-width")).toHaveTextContent("3000 mm");
    expect(screen.getByTestId("room-span-summary-depth")).toHaveTextContent("5000 mm");

    // Target span input with mm indicator
    const input = screen.getByTestId("target-span-input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(3000);
    expect(screen.getAllByText("mm").length).toBeGreaterThanOrEqual(1);

    // Action buttons
    expect(screen.getByTestId("preview-span-btn")).toBeInTheDocument();
    expect(screen.getByTestId("apply-span-btn")).toBeInTheDocument();
    expect(screen.getByTestId("cancel-span-btn")).toBeInTheDocument();
  });

  describe("AC-6: Edit room span and preview/apply confirmation", () => {
    it("previews valid adjustment, showing new area and span difference", () => {
      const handleUpdatePlan = vi.fn();
      render(
        <RoomSpanEditor
          plan={VALID_STANDARD_FLOOR_PLAN}
          roomId="r1"
          onUpdatePlan={handleUpdatePlan}
        />,
      );

      // Change width from 3000 to 3800
      const input = screen.getByTestId("target-span-input");
      fireEvent.change(input, { target: { value: "3800" } });

      // Click "Preview"
      fireEvent.click(screen.getByTestId("preview-span-btn"));

      // Shows preview details
      expect(screen.getByTestId("span-preview-details")).toBeInTheDocument();
      expect(screen.getByTestId("preview-new-span")).toHaveTextContent("3800 mm");
      expect(screen.getByTestId("preview-new-area")).toHaveTextContent("19.0 m²");
      expect(screen.getByTestId("preview-delta")).toHaveTextContent("+800 mm");

      // Original plan has NOT been committed yet
      expect(handleUpdatePlan).not.toHaveBeenCalled();
    });

    it("commits valid adjustment on Apply and calls onUpdatePlan with updated plan", () => {
      const handleUpdatePlan = vi.fn();
      render(
        <RoomSpanEditor
          plan={VALID_STANDARD_FLOOR_PLAN}
          roomId="r1"
          onUpdatePlan={handleUpdatePlan}
        />,
      );

      const input = screen.getByTestId("target-span-input");
      fireEvent.change(input, { target: { value: "3800" } });

      // Click "Apply"
      fireEvent.click(screen.getByTestId("apply-span-btn"));

      // Callback triggered with updated plan
      expect(handleUpdatePlan).toHaveBeenCalledTimes(1);
      const updatedPlan = handleUpdatePlan.mock.calls[0][0];

      // w7 moved to 3800
      const v2 = updatedPlan.vertices.find((v: any) => v.id === "v2");
      expect(v2.x).toBe(3800);
      // Opposite boundary (v1 at x=0) stayed fixed
      const v1 = updatedPlan.vertices.find((v: any) => v.id === "v1");
      expect(v1.x).toBe(0);
    });

    it("resets input and clears preview on Cancel", () => {
      const handleUpdatePlan = vi.fn();
      render(
        <RoomSpanEditor
          plan={VALID_STANDARD_FLOOR_PLAN}
          roomId="r1"
          onUpdatePlan={handleUpdatePlan}
        />,
      );

      const input = screen.getByTestId("target-span-input");
      fireEvent.change(input, { target: { value: "3800" } });
      fireEvent.click(screen.getByTestId("preview-span-btn"));

      expect(screen.getByTestId("span-preview-details")).toBeInTheDocument();

      // Click "Cancel"
      fireEvent.click(screen.getByTestId("cancel-span-btn"));

      // Preview cleared, input restored to current span
      expect(screen.queryByTestId("span-preview-details")).not.toBeInTheDocument();
      expect(screen.getByTestId("target-span-input")).toHaveValue(3000);
      expect(handleUpdatePlan).not.toHaveBeenCalled();
    });
  });

  describe("AC-7: Rejection of invalid dimensions with clear reasons", () => {
    it("displays clear error when entering dimension below minimum (<600mm) and does not commit", () => {
      const handleUpdatePlan = vi.fn();
      render(
        <RoomSpanEditor
          plan={VALID_STANDARD_FLOOR_PLAN}
          roomId="r1"
          onUpdatePlan={handleUpdatePlan}
        />,
      );

      const input = screen.getByTestId("target-span-input");
      fireEvent.change(input, { target: { value: "400" } });

      // Click Apply or Preview
      fireEvent.click(screen.getByTestId("apply-span-btn"));

      // Error message is displayed
      expect(screen.getByTestId("span-error-alert")).toBeInTheDocument();
      expect(screen.getByTestId("span-error-message")).toHaveTextContent(/at least 600 mm/i);

      // Plan was NOT committed
      expect(handleUpdatePlan).not.toHaveBeenCalled();
    });

    it("displays clear error when dimension would invert a connected boundary and does not commit", () => {
      const handleUpdatePlan = vi.fn();
      render(
        <RoomSpanEditor
          plan={VALID_STANDARD_FLOOR_PLAN}
          roomId="r1"
          onUpdatePlan={handleUpdatePlan}
        />,
      );

      // 6500mm would invert adjacent room r2 (which ends at 6000)
      const input = screen.getByTestId("target-span-input");
      fireEvent.change(input, { target: { value: "6500" } });

      fireEvent.click(screen.getByTestId("apply-span-btn"));

      expect(screen.getByTestId("span-error-alert")).toBeInTheDocument();
      expect(screen.getByTestId("span-error-message")).toHaveTextContent(/invert|minimum length/i);
      expect(handleUpdatePlan).not.toHaveBeenCalled();
    });

    it("displays clear error when wall adjustment would cause connected wall to become non-orthogonal", () => {
      const handleUpdatePlan = vi.fn();
      render(
        <RoomSpanEditor
          plan={VALID_STANDARD_FLOOR_PLAN}
          roomId="r1"
          onUpdatePlan={handleUpdatePlan}
        />,
      );

      // Select Vertical span (Depth) in r1 where moving w1 would tilt w2
      fireEvent.click(screen.getByTestId("select-axis-vertical"));

      const input = screen.getByTestId("target-span-input");
      fireEvent.change(input, { target: { value: "4200" } });

      fireEvent.click(screen.getByTestId("apply-span-btn"));

      expect(screen.getByTestId("span-error-alert")).toBeInTheDocument();
      expect(screen.getByTestId("span-error-message")).toHaveTextContent(/non-orthogonal/i);
      expect(handleUpdatePlan).not.toHaveBeenCalled();
    });
  });
});
