import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DuduScannerResultView } from "@/components/dudu-scanner/dudu-scanner-result-view";
import { getTargetRecord, DUDU_SCANNER_TARGET_IDS } from "@/lib/dudu-scanner/catalog";
import { DUDU_SCANNER_TARGET_MESSAGE_KEY } from "@/lib/dudu-scanner/i18n-keys";
import { resolveTargetDisplaySrc } from "@/lib/dudu-scanner/target-asset";
import enMessages from "@/messages/en.json";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...rest
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...rest} />
  ),
}));

function renderResult(targetId: typeof DUDU_SCANNER_TARGET_IDS[number]) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <DuduScannerResultView
        targetId={targetId}
        targetImageSrc={resolveTargetDisplaySrc(targetId, false)}
        onScanAgain={() => {}}
        onChangeTarget={() => {}}
      />
    </NextIntlClientProvider>,
  );
}

describe("DuduScanner result combinations", () => {
  afterEach(() => {
    cleanup();
  });

  for (const targetId of DUDU_SCANNER_TARGET_IDS) {
    it(`renders localized copy and production asset for ${targetId}`, () => {
      const messageKey = DUDU_SCANNER_TARGET_MESSAGE_KEY[targetId];
      const copy = enMessages.duduScanner.targets[messageKey];

      renderResult(targetId);

      expect(screen.getByText(copy.name)).toBeInTheDocument();
      expect(screen.getByText(copy.description)).toBeInTheDocument();
      expect(screen.getByText(copy.suggestion)).toBeInTheDocument();
      expect(screen.getByTestId("dudu-scanner-result-target")).toHaveAttribute(
        "src",
        getTargetRecord(targetId).imageSrc,
      );
    });
  }
});
