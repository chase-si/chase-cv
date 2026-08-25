import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DuduScannerResultView } from "@/components/dudu-scanner/dudu-scanner-result-view";
import { resolveTargetDisplaySrc } from "@/lib/dudu-scanner/target-asset";
import enMessages from "@/messages/en.json";
import zhMessages from "@/messages/zh.json";

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

class FakeUtterance {
  text: string;
  lang = "";
  rate = 1;
  voice: SpeechSynthesisVoice | null = null;
  onstart: ((event: Event) => void) | null = null;
  onend: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

function stubSpeechSynthesis(options?: { speaking?: boolean }) {
  const speak = vi.fn((utterance: FakeUtterance) => {
    utterance.onstart?.(new Event("start"));
  });
  const cancel = vi.fn();
  const synthesis = {
    speak,
    cancel,
    getVoices: vi.fn(() => []),
    get speaking() {
      return options?.speaking ?? false;
    },
  };

  vi.stubGlobal("speechSynthesis", synthesis);
  vi.stubGlobal("SpeechSynthesisUtterance", FakeUtterance);

  return { speak, cancel, synthesis };
}

function renderResult(locale: "en" | "zh" = "en") {
  const messages = locale === "en" ? enMessages : zhMessages;

  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <DuduScannerResultView
        targetId="fry-sprite"
        targetImageSrc={resolveTargetDisplaySrc("fry-sprite", false)}
        onScanAgain={() => {}}
        onChangeTarget={() => {}}
      />
    </NextIntlClientProvider>,
  );
}

describe("DuduScannerResultView health suggestion speech", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("explains that the operator can play the tip or read their own", () => {
    stubSpeechSynthesis();
    renderResult();

    expect(
      screen.getByText("Tap play for the tip below, or read aloud a suggestion of your own."),
    ).toBeInTheDocument();
  });

  it("hides the speak control when speech synthesis is unavailable", () => {
    vi.stubGlobal("speechSynthesis", undefined);
    renderResult();

    expect(screen.queryByRole("button", { name: "Play healthy mission" })).not.toBeInTheDocument();
  });

  it("speaks the current healthy mission when the play control is clicked", () => {
    const { speak } = stubSpeechSynthesis();
    renderResult();

    fireEvent.click(screen.getByRole("button", { name: "Play healthy mission" }));

    expect(speak).toHaveBeenCalledTimes(1);
    const utterance = speak.mock.calls[0][0] as FakeUtterance;
    expect(utterance.text).toBe(enMessages.duduScanner.targets.frySprite.suggestion);
    expect(utterance.lang).toBe("en-US");
    expect(utterance.rate).toBe(0.9);
    expect(screen.getByRole("button", { name: "Stop healthy mission" })).toBeInTheDocument();
  });

  it("speaks Chinese copy with a Chinese voice locale", () => {
    const { speak } = stubSpeechSynthesis();
    renderResult("zh");

    fireEvent.click(screen.getByRole("button", { name: "播放健康小任务" }));

    const utterance = speak.mock.calls[0][0] as FakeUtterance;
    expect(utterance.text).toBe(zhMessages.duduScanner.targets.frySprite.suggestion);
    expect(utterance.lang).toBe("zh-CN");
  });

  it("stops playback when the control is clicked while speaking", () => {
    const { speak, cancel } = stubSpeechSynthesis();
    renderResult();

    fireEvent.click(screen.getByRole("button", { name: "Play healthy mission" }));
    fireEvent.click(screen.getByRole("button", { name: "Stop healthy mission" }));

    expect(cancel).toHaveBeenCalled();
    expect(speak).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Play healthy mission" })).toBeInTheDocument();
  });

  it("cancels playback when the result view unmounts", () => {
    const { cancel } = stubSpeechSynthesis();
    const { unmount } = renderResult();

    fireEvent.click(screen.getByRole("button", { name: "Play healthy mission" }));
    unmount();

    expect(cancel).toHaveBeenCalled();
  });

  it("hides character copy and health guidance for a custom round", () => {
    stubSpeechSynthesis();
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <DuduScannerResultView
          targetImageSrc="blob:custom"
          customRound
          onScanAgain={() => {}}
          onChangeTarget={() => {}}
        />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText("Uploaded picture")).toBeInTheDocument();
    expect(screen.queryByTestId("dudu-scanner-health-guidance")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Play healthy mission" })).not.toBeInTheDocument();
  });
});
