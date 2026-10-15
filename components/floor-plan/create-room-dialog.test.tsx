import * as React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CreateRoomDialog } from "./create-room-dialog";

afterEach(() => {
  cleanup();
});

describe("CreateRoomDialog Component (AC-1)", () => {
  it("renders with default inputs (3000 × 4000 mm) and live preview", () => {
    render(
      <CreateRoomDialog
        open={true}
        onOpenChange={vi.fn()}
        onCreateRoom={vi.fn()}
        locale="zh"
      />,
    );

    expect(screen.getByTestId("create-room-dialog")).toBeInTheDocument();
    const nameInput = screen.getByTestId("create-room-name-input");
    const widthInput = screen.getByTestId("create-room-width-input");
    const depthInput = screen.getByTestId("create-room-depth-input");

    expect(nameInput).toHaveValue("");
    expect(widthInput).toHaveValue(3000);
    expect(depthInput).toHaveValue(4000);

    // Live preview shows 12.0 m² for default 3000 × 4000 mm
    const preview = screen.getByTestId("create-room-preview");
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveTextContent("12.0 m²");
    expect(preview).toHaveTextContent("3000 × 4000 mm");
  });

  it("submits valid input and triggers onCreateRoom", () => {
    const handleCreate = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <CreateRoomDialog
        open={true}
        onOpenChange={handleOpenChange}
        onCreateRoom={handleCreate}
        locale="zh"
      />,
    );

    const nameInput = screen.getByTestId("create-room-name-input");
    const widthInput = screen.getByTestId("create-room-width-input");
    const depthInput = screen.getByTestId("create-room-depth-input");
    const submitBtn = screen.getByTestId("create-room-submit-btn");

    fireEvent.change(nameInput, { target: { value: "我的小次卧" } });
    fireEvent.change(widthInput, { target: { value: "2800" } });
    fireEvent.change(depthInput, { target: { value: "3500" } });

    // Live preview updates
    const preview = screen.getByTestId("create-room-preview");
    expect(preview).toHaveTextContent("9.8 m²");
    expect(preview).toHaveTextContent("2800 × 3500 mm");

    fireEvent.click(submitBtn);

    expect(handleCreate).toHaveBeenCalledTimes(1);
    expect(handleCreate).toHaveBeenCalledWith({
      name: "我的小次卧",
      widthMm: 2800,
      depthMm: 3500,
    });
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("disables submit and shows validation message when dimension is non-positive or non-integer", () => {
    const handleCreate = vi.fn();

    render(
      <CreateRoomDialog
        open={true}
        onOpenChange={vi.fn()}
        onCreateRoom={handleCreate}
        locale="zh"
      />,
    );

    const widthInput = screen.getByTestId("create-room-width-input");
    const submitBtn = screen.getByTestId("create-room-submit-btn");

    // Invalid: 0
    fireEvent.change(widthInput, { target: { value: "0" } });
    expect(submitBtn).toBeDisabled();
    expect(screen.getByTestId("create-room-error")).toBeInTheDocument();

    // Invalid: negative
    fireEvent.change(widthInput, { target: { value: "-500" } });
    expect(submitBtn).toBeDisabled();

    // Invalid: float/non-integer
    fireEvent.change(widthInput, { target: { value: "3000.5" } });
    expect(submitBtn).toBeDisabled();

    fireEvent.click(submitBtn);
    expect(handleCreate).not.toHaveBeenCalled();
  });

  it("cancel button closes dialog without creating any plan", () => {
    const handleCreate = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <CreateRoomDialog
        open={true}
        onOpenChange={handleOpenChange}
        onCreateRoom={handleCreate}
        locale="zh"
      />,
    );

    const cancelBtn = screen.getByTestId("create-room-cancel-btn");
    fireEvent.click(cancelBtn);

    expect(handleCreate).not.toHaveBeenCalled();
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
