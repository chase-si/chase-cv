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

  it("starts collapsed and expands to show every touch control", () => {
    renderBar();
    expect(screen.queryByTestId("dudu-scanner-operator-reveal")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("dudu-scanner-operator-bar-toggle"));
    for (const controlId of DUDU_SCANNER_OPERATOR_TOUCH_CONTROLS) {
      expect(screen.getByTestId(`dudu-scanner-operator-${controlId}`)).toBeInTheDocument();
    }
  });

  it("dispatches domain commands for each touch control", () => {
    const onDomainCommand = vi.fn();
    renderBar(onDomainCommand);
    fireEvent.click(screen.getByTestId("dudu-scanner-operator-bar-toggle"));

    for (const controlId of DUDU_SCANNER_OPERATOR_TOUCH_CONTROLS) {
      onDomainCommand.mockClear();
      fireEvent.click(screen.getByTestId(`dudu-scanner-operator-${controlId}`));
      expect(onDomainCommand).toHaveBeenCalledWith(touchControlIdToDomainCommand(controlId));
    }
  });
});
