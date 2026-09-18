import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import { OpeningEditor } from "./opening-editor";

afterEach(() => {
  cleanup();
});

describe("OpeningEditor Component (US-9, AC-9)", () => {
  it("renders editor with current opening values and metadata", () => {
    // door1 is on w6 (length 5000 mm, width 900 mm, position 0.3)
    render(
      <OpeningEditor
        plan={VALID_STANDARD_FLOOR_PLAN}
        openingId="door1"
      />,
    );

    expect(screen.getByTestId("opening-editor")).toBeInTheDocument();
    expect(screen.getByTestId("opening-type-badge")).toHaveTextContent(/door/i);
    expect(screen.getByTestId("opening-width-input")).toHaveValue(900);
    expect(screen.getByTestId("opening-position-slider")).toHaveValue("0.3");
  });

  it("adjusts opening width and applies changes to plan (AC-9)", () => {
    const handleUpdatePlan = vi.fn();
    render(
      <OpeningEditor
        plan={VALID_STANDARD_FLOOR_PLAN}
        openingId="door1"
        onUpdatePlan={handleUpdatePlan}
      />,
    );

    const widthInput = screen.getByTestId("opening-width-input");
    fireEvent.change(widthInput, { target: { value: "1100" } });
    expect(widthInput).toHaveValue(1100);

    const applyBtn = screen.getByTestId("apply-opening-btn");
    fireEvent.click(applyBtn);

    expect(handleUpdatePlan).toHaveBeenCalledTimes(1);
    const updatedPlan = handleUpdatePlan.mock.calls[0][0];
    const updatedDoor = updatedPlan.openings.find((o: any) => o.id === "door1");
    expect(updatedDoor.width).toBe(1100);
    expect(updatedDoor.position).toBe(0.3);
  });

  it("adjusts opening position along wall and applies changes (AC-9)", () => {
    const handleUpdatePlan = vi.fn();
    render(
      <OpeningEditor
        plan={VALID_STANDARD_FLOOR_PLAN}
        openingId="door1"
        onUpdatePlan={handleUpdatePlan}
      />,
    );

    const positionSlider = screen.getByTestId("opening-position-slider");
    fireEvent.change(positionSlider, { target: { value: "0.45" } });

    const applyBtn = screen.getByTestId("apply-opening-btn");
    fireEvent.click(applyBtn);

    expect(handleUpdatePlan).toHaveBeenCalledTimes(1);
    const updatedPlan = handleUpdatePlan.mock.calls[0][0];
    const updatedDoor = updatedPlan.openings.find((o: any) => o.id === "door1");
    expect(updatedDoor.position).toBeCloseTo(0.45, 2);
  });

  it("supports quick width increment and decrement buttons", () => {
    render(
      <OpeningEditor
        plan={VALID_STANDARD_FLOOR_PLAN}
        openingId="door1"
      />,
    );

    const widthInput = screen.getByTestId("opening-width-input");
    expect(widthInput).toHaveValue(900);

    const incBtn = screen.getByTestId("width-inc-btn");
    fireEvent.click(incBtn);
    expect(widthInput).toHaveValue(1000);

    const decBtn = screen.getByTestId("width-dec-btn");
    fireEvent.click(decBtn);
    expect(widthInput).toHaveValue(900);
  });

  it("shows error alert and blocks update when width is less than 300 mm", () => {
    const handleUpdatePlan = vi.fn();
    render(
      <OpeningEditor
        plan={VALID_STANDARD_FLOOR_PLAN}
        openingId="door1"
        onUpdatePlan={handleUpdatePlan}
      />,
    );

    const widthInput = screen.getByTestId("opening-width-input");
    fireEvent.change(widthInput, { target: { value: "200" } });

    const applyBtn = screen.getByTestId("apply-opening-btn");
    fireEvent.click(applyBtn);

    expect(screen.getByTestId("opening-error-alert")).toBeInTheDocument();
    expect(screen.getByTestId("opening-error-message")).toHaveTextContent(/at least 300 mm/i);
    expect(handleUpdatePlan).not.toHaveBeenCalled();
  });

  it("shows error alert when width exceeds wall length minus margins (AC-9)", () => {
    const handleUpdatePlan = vi.fn();
    render(
      <OpeningEditor
        plan={VALID_STANDARD_FLOOR_PLAN}
        openingId="door1"
        onUpdatePlan={handleUpdatePlan}
      />,
    );

    const widthInput = screen.getByTestId("opening-width-input");
    // w6 is 5000 mm. Try 4900 mm with default 100 mm margins
    fireEvent.change(widthInput, { target: { value: "4900" } });

    const applyBtn = screen.getByTestId("apply-opening-btn");
    fireEvent.click(applyBtn);

    expect(screen.getByTestId("opening-error-alert")).toBeInTheDocument();
    expect(screen.getByTestId("opening-error-message")).toHaveTextContent(/exceeds maximum allowable width/i);
    expect(handleUpdatePlan).not.toHaveBeenCalled();
  });

  it("allows previewing changes before applying", () => {
    render(
      <OpeningEditor
        plan={VALID_STANDARD_FLOOR_PLAN}
        openingId="door1"
      />,
    );

    const widthInput = screen.getByTestId("opening-width-input");
    fireEvent.change(widthInput, { target: { value: "1000" } });

    const previewBtn = screen.getByTestId("preview-opening-btn");
    fireEvent.click(previewBtn);

    expect(screen.getByTestId("opening-preview-details")).toBeInTheDocument();
    expect(screen.getByTestId("preview-opening-width")).toHaveTextContent("1000 mm");
  });

  it("resets modified inputs on cancel", () => {
    render(
      <OpeningEditor
        plan={VALID_STANDARD_FLOOR_PLAN}
        openingId="door1"
      />,
    );

    const widthInput = screen.getByTestId("opening-width-input");
    fireEvent.change(widthInput, { target: { value: "1200" } });
    expect(widthInput).toHaveValue(1200);

    const cancelBtn = screen.getByTestId("cancel-opening-btn");
    fireEvent.click(cancelBtn);

    expect(widthInput).toHaveValue(900);
    expect(screen.queryByTestId("opening-preview-details")).not.toBeInTheDocument();
  });
});
