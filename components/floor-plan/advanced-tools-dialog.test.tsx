import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import { FLOOR_PLAN_ZH } from "@/lib/floor-plan/i18n";
import { AdvancedToolsDialog } from "./advanced-tools-dialog";

afterEach(() => {
  cleanup();
});

describe("AdvancedToolsDialog Component (AC-26)", () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    plan: VALID_STANDARD_FLOOR_PLAN,
    isDraftMode: true,
    violations: [],
    selectedEntity: null,
    onSelectEntity: vi.fn(),
    onUpdatePlan: vi.fn(),
    onSelectDefinition: vi.fn(),
    onExportJson: vi.fn(),
    onRestartFromTemplate: vi.fn(),
    locale: "zh",
    t: FLOOR_PLAN_ZH,
  };

  it("renders modal dialog with 4 tool tabs when open", () => {
    render(<AdvancedToolsDialog {...defaultProps} />);

    expect(screen.getByTestId("advanced-tools-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("advanced-tools-dialog-title")).toHaveTextContent("高级与专家工具");
    expect(screen.getByTestId("advanced-tab-rules")).toBeInTheDocument();
    expect(screen.getByTestId("advanced-tab-structure")).toBeInTheDocument();
    expect(screen.getByTestId("advanced-tab-furniture")).toBeInTheDocument();
    expect(screen.getByTestId("advanced-tab-manage")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(<AdvancedToolsDialog {...defaultProps} open={false} />);
    expect(screen.queryByTestId("advanced-tools-dialog")).not.toBeInTheDocument();
  });

  it("closes dialog when clicking close button or pressing Escape", () => {
    const onOpenChange = vi.fn();
    render(<AdvancedToolsDialog {...defaultProps} onOpenChange={onOpenChange} />);

    fireEvent.click(screen.getByTestId("advanced-tools-close-btn"));
    expect(onOpenChange).toHaveBeenCalledWith(false);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("AC-26: Tool 1 - Full-house spatial rules inspection", () => {
    render(
      <AdvancedToolsDialog
        {...defaultProps}
        locale="en"
        defaultTab="rules"
        violations={[
          {
            ruleId: "furniture-wall-collision",
            severity: "error",
            relatedEntityIds: ["w1"],
            relatedObjectIds: ["w1"],
            title: "Wall collision",
            message: "Wall collision detected",
          },
        ]}
      />,
    );

    expect(screen.getByTestId("rule-feedback-panel")).toBeInTheDocument();
    expect(screen.getByText("Wall collision detected")).toBeInTheDocument();
  });

  it("AC-26: Tool 2 - Wall and opening structural property editor", () => {
    const handleSelectEntity = vi.fn();
    render(
      <AdvancedToolsDialog
        {...defaultProps}
        defaultTab="structure"
        onSelectEntity={handleSelectEntity}
      />,
    );

    expect(screen.getByTestId("advanced-structure-panel")).toBeInTheDocument();

    // Select wall w1
    const wallBtn = screen.getByTestId("select-structure-wall-w1");
    fireEvent.click(wallBtn);
    expect(handleSelectEntity).toHaveBeenCalledWith({ type: "wall", id: "w1" });

    // Switch to openings filter
    fireEvent.click(screen.getByTestId("filter-openings-btn"));

    // Select opening door1
    const openingBtn = screen.getByTestId("select-structure-opening-door1");
    fireEvent.click(openingBtn);
    expect(handleSelectEntity).toHaveBeenCalledWith({ type: "opening", id: "door1" });
  });

  it("AC-26: Tool 3 - Full furniture catalog palette", () => {
    const handleSelectDefinition = vi.fn();
    render(
      <AdvancedToolsDialog
        {...defaultProps}
        defaultTab="furniture"
        onSelectDefinition={handleSelectDefinition}
      />,
    );

    expect(screen.getByTestId("furniture-catalog-palette")).toBeInTheDocument();
  });

  it("AC-26: Tool 4 & 5 - Plan export JSON and restart template in plan management tab", () => {
    const handleExportJson = vi.fn();
    const handleRestart = vi.fn();
    render(
      <AdvancedToolsDialog
        {...defaultProps}
        defaultTab="manage"
        onExportJson={handleExportJson}
        onRestartFromTemplate={handleRestart}
      />,
    );

    expect(screen.getByTestId("advanced-manage-panel")).toBeInTheDocument();

    const exportBtn = screen.getByTestId("export-json-btn");
    fireEvent.click(exportBtn);
    expect(handleExportJson).toHaveBeenCalledTimes(1);

    const restartBtn = screen.getByTestId("restart-template-btn");
    fireEvent.click(restartBtn);
    expect(handleRestart).toHaveBeenCalledTimes(1);
  });
});
