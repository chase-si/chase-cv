import type { ReactNode } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it } from "vitest";

import { PreviewThemeScopeProvider } from "@/components/image-to-ui/preview-theme-scope";
import { SaasPreviewStatusArea } from "@/components/image-to-ui/saas-theme-preview/saas-preview-status-area";
import enMessages from "@/messages/en.json";

afterEach(() => {
  cleanup();
});

function renderBlock(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <PreviewThemeScopeProvider previewRootStyle={{ color: "var(--foreground)" }}>
        {ui}
      </PreviewThemeScopeProvider>
    </NextIntlClientProvider>,
  );
}

describe("SaasPreviewStatusArea", () => {
  it("renders platform health KPI grid with expected metric values", () => {
    renderBlock(<SaasPreviewStatusArea />);

    const statusArea = screen.getByTestId("saas-status-area");
    expect(within(statusArea).getAllByTestId("saas-kpi-card")).toHaveLength(4);
    expect(within(statusArea).getByTestId("saas-metric-mrr")).toHaveTextContent("$84,200");
    expect(within(statusArea).getByTestId("saas-metric-incidents")).toHaveTextContent("3");
  });
});
