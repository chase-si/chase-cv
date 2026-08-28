import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DuduScannerOperatorControlBar } from "@/components/dudu-scanner/dudu-scanner-operator-control-bar";
import {
  DUDU_SCANNER_OPERATOR_TOUCH_CONTROLS,
  touchControlIdToDomainCommand,
} from "@/lib/dudu-scanner/scanner-commands";
import enMessages from "@/messages/en.json";

function renderBar({
  onDomainCommand = vi.fn(),
  paused = false,
  targetRevealed = false,
}: {
  onDomainCommand?: ReturnType<typeof vi.fn>;
  paused?: boolean;
  targetRevealed?: boolean;
} = {}) {
  return {
    onDomainCommand,
    ...render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <DuduScannerOperatorControlBar
          paused={paused}
          targetRevealed={targetRevealed}
          onDomainCommand={onDomainCommand}
        />
      </NextIntlClientProvider>,
    ),
  };
}

describe("DuduScannerOperatorControlBar", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows lock first as the only primary control, with a combined reveal/hide and rescan", () => {
    renderBar();
    expect(screen.queryByTestId("dudu-scanner-operator-bar-toggle")).not.toBeInTheDocument();
    expect(DUDU_SCANNER_OPERATOR_TOUCH_CONTROLS).toEqual([
      "lock",
      "pause-resume",
      "reveal",
      "reset",
    ]);
    const buttons = screen.getAllByRole("button");
    expect(buttons.map((button) => button.getAttribute("data-testid"))).toEqual([
      "dudu-scanner-operator-lock",
      "dudu-scanner-operator-pause-resume",
      "dudu-scanner-operator-reveal",
      "dudu-scanner-operator-reset",
    ]);
    expect(buttons[0]).toHaveTextContent("Lock signal");
    expect(buttons[0].className).toMatch(/bg-primary/);
    expect(buttons.slice(1).every((button) => !button.className.includes("bg-primary"))).toBe(
      true,
    );
    expect(screen.getByTestId("dudu-scanner-operator-reveal")).toHaveTextContent(
      "Force discovery",
    );
    expect(screen.getByTestId("dudu-scanner-operator-reset")).toHaveTextContent("Rescan");
    expect(screen.getByRole("group", { name: "Scanner controls" })).toHaveClass("grid-cols-2");
  });

  it("toggles the combined reveal control to hide after the target is visible", () => {
    const { onDomainCommand } = renderBar({ targetRevealed: true });
    const reveal = screen.getByTestId("dudu-scanner-operator-reveal");
    expect(reveal).toHaveTextContent("Hide target");
    fireEvent.click(reveal);
    expect(onDomainCommand).toHaveBeenCalledWith({ type: "CANCEL_TARGET" });
  });

  it("dispatches domain commands for each touch control", () => {
    const onDomainCommand = vi.fn();
    renderBar({ onDomainCommand });

    for (const controlId of DUDU_SCANNER_OPERATOR_TOUCH_CONTROLS) {
      onDomainCommand.mockClear();
      fireEvent.click(screen.getByTestId(`dudu-scanner-operator-${controlId}`));
      expect(onDomainCommand).toHaveBeenCalledWith(touchControlIdToDomainCommand(controlId));
    }
  });
});
