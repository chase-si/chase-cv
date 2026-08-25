import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DuduScannerOperatorControlBar } from "@/components/dudu-scanner/dudu-scanner-operator-control-bar";
import {
  DUDU_SCANNER_OPERATOR_TOUCH_CONTROLS,
  touchControlIdToDomainCommand,
} from "@/lib/dudu-scanner/scanner-commands";
import enMessages from "@/messages/en.json";

function renderBar(onDomainCommand = vi.fn()) {
  return {
    onDomainCommand,
    ...render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <DuduScannerOperatorControlBar paused={false} onDomainCommand={onDomainCommand} />
      </NextIntlClientProvider>,
    ),
  };
}

describe("DuduScannerOperatorControlBar", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows four touch controls in two columns without a collapse toggle or rescan", () => {
    renderBar();
    expect(screen.queryByTestId("dudu-scanner-operator-bar-toggle")).not.toBeInTheDocument();
    expect(screen.queryByTestId("dudu-scanner-operator-reset")).not.toBeInTheDocument();
    expect(DUDU_SCANNER_OPERATOR_TOUCH_CONTROLS).toEqual([
      "pause-resume",
      "reveal",
      "lock",
      "hide",
    ]);
    for (const controlId of DUDU_SCANNER_OPERATOR_TOUCH_CONTROLS) {
      expect(screen.getByTestId(`dudu-scanner-operator-${controlId}`)).toBeInTheDocument();
    }
    expect(screen.getByRole("group", { name: "Scanner controls" })).toHaveClass("grid-cols-2");
  });

  it("dispatches domain commands for each touch control", () => {
    const onDomainCommand = vi.fn();
    renderBar(onDomainCommand);

    for (const controlId of DUDU_SCANNER_OPERATOR_TOUCH_CONTROLS) {
      onDomainCommand.mockClear();
      fireEvent.click(screen.getByTestId(`dudu-scanner-operator-${controlId}`));
      expect(onDomainCommand).toHaveBeenCalledWith(touchControlIdToDomainCommand(controlId));
    }
  });
});
