import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it } from "vitest";

import { DuduScannerInstrumentPanel } from "@/components/dudu-scanner/dudu-scanner-instrument-panel";
import type { ScannerVisualMetrics } from "@/lib/dudu-scanner/scanner-visual/renderer";
import enMessages from "@/messages/en.json";

const baseMetrics: ScannerVisualMetrics = {
  signalStrength: 0,
  signalBand: "weak",
  probeInside: false,
  probeHasEntered: false,
  dwellProgress: 0,
  roundElapsedMs: 0,
  spotlightVisible: false,
  spotlightRadius: 100,
  probeVelocity: 0,
  textureOffsetX: 0,
  textureOffsetY: 0,
  scanLineBias: 0,
  gain: 0.5,
  scanFrequencyHz: 0.9,
};

function renderPanel(signalStrength: number) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <DuduScannerInstrumentPanel
        backButton={null}
        canvas={<div>Canvas</div>}
        metrics={{ ...baseMetrics, signalStrength }}
        status="Scanning"
        timestamp="00:00:00"
      />
    </NextIntlClientProvider>,
  );
}

describe("DuduScannerInstrumentPanel", () => {
  afterEach(cleanup);

  it("turns the signal icon and bar green at exactly 90 percent", () => {
    const { rerender } = renderPanel(0.899);
    expect(screen.getByTestId("dudu-scanner-signal-icon")).not.toHaveClass("bg-chart-2");
    expect(screen.getByTestId("dudu-scanner-signal-progress")).not.toHaveClass(
      "[&_[data-slot=progress-indicator]]:bg-chart-2",
    );

    rerender(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <DuduScannerInstrumentPanel
          backButton={null}
          canvas={<div>Canvas</div>}
          metrics={{ ...baseMetrics, signalStrength: 0.9 }}
          status="Scanning"
          timestamp="00:00:00"
        />
      </NextIntlClientProvider>,
    );

    expect(screen.getByTestId("dudu-scanner-signal-icon")).toHaveClass("bg-chart-2");
    expect(screen.getByTestId("dudu-scanner-signal-progress")).toHaveClass(
      "[&_[data-slot=progress-indicator]]:bg-chart-2",
    );
  });
});
