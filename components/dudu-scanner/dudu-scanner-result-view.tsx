"use client";

import Image from "next/image";
import { Heart, Square, Volume2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { DuduScannerBackButton } from "@/components/dudu-scanner/dudu-scanner-back-button";
import type { AppLocale } from "@/i18n/routing";
import { type DuduScannerTargetId } from "@/lib/dudu-scanner/catalog";
import { DUDU_SCANNER_TARGET_MESSAGE_KEY } from "@/lib/dudu-scanner/i18n-keys";

const SPEECH_RATE = 0.9;
const SPEECH_LANG_BY_LOCALE: Record<AppLocale, string> = {
  en: "en-US",
  zh: "zh-CN",
};

function isSpeechSynthesisSupported() {
  return typeof window.speechSynthesis?.speak === "function";
}

function subscribeToNothing() {
  return () => {};
}

function pickVoice(lang: string) {
  const prefix = lang.slice(0, 2).toLowerCase();
  return window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith(prefix));
}

type DuduScannerResultViewProps = {
  targetId?: DuduScannerTargetId;
  targetImageSrc: string;
  customRound?: boolean;
  onScanAgain: () => void;
  onChangeTarget: () => void;
  onBack?: () => void;
  discoveryProgress?: ReactNode;
};

export function DuduScannerResultView({
  targetId,
  targetImageSrc,
  customRound = false,
  onScanAgain,
  onChangeTarget,
  onBack,
  discoveryProgress,
}: DuduScannerResultViewProps) {
  const t = useTranslations("duduScanner");
  const locale = useLocale() as AppLocale;
  const targetMessageKey = targetId ? DUDU_SCANNER_TARGET_MESSAGE_KEY[targetId] : null;
  const suggestion = targetMessageKey ? t(`targets.${targetMessageKey}.suggestion`) : "";
  const speechSupported = useSyncExternalStore(
    subscribeToNothing,
    isSpeechSynthesisSupported,
    () => false,
  );
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window.speechSynthesis?.cancel === "function") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleHealthTaskSpeech = () => {
    if (!speechSupported) {
      return;
    }

    if (speaking || window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(suggestion);
    utterance.lang = SPEECH_LANG_BY_LOCALE[locale];
    utterance.rate = SPEECH_RATE;
    const voice = pickVoice(utterance.lang);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-4 overflow-hidden p-4 text-center sm:gap-6 sm:p-6"
      data-testid="dudu-scanner-result-view"
    >
      {onBack ? (
        <div className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
          <DuduScannerBackButton onClick={onBack} />
        </div>
      ) : null}
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {t("result.eyebrow")}
        </p>
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{t("result.title")}</h2>
      </div>

      <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-2xl border border-border bg-card px-4 py-5 shadow-xs sm:px-8 sm:py-6">
        <div className="relative flex size-40 items-center justify-center rounded-2xl border border-primary/30 bg-muted/30">
          {customRound ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={targetImageSrc}
              alt=""
              className="size-32 object-contain"
              data-testid="dudu-scanner-result-target"
            />
          ) : (
            <Image
              src={targetImageSrc}
              alt=""
              width={140}
              height={140}
              loading="eager"
              className="size-32 object-contain"
              data-testid="dudu-scanner-result-target"
            />
          )}
        </div>
        {customRound ? (
          <p className="text-lg font-medium text-foreground">{t("result.customName")}</p>
        ) : targetMessageKey ? (
          <>
            <p className="text-lg font-medium text-foreground">
              {t(`targets.${targetMessageKey}.name`)}
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              {t(`targets.${targetMessageKey}.description`)}
            </p>
          </>
        ) : null}
        {customRound || !targetMessageKey ? null : (
          <div
            className="flex w-full max-w-sm items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 px-3 py-3 text-left"
            data-testid="dudu-scanner-health-guidance"
          >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Heart className="size-4" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="min-w-0 flex-1 text-xs font-semibold text-primary">{t("result.healthTask")}</p>
              {speechSupported ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-primary hover:text-primary"
                  aria-label={speaking ? t("result.stopHealthTask") : t("result.playHealthTask")}
                  aria-pressed={speaking}
                  onClick={toggleHealthTaskSpeech}
                >
                  {speaking ? <Square className="size-3" /> : <Volume2 className="size-3.5" />}
                </Button>
              ) : null}
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{t("result.healthTaskHint")}</p>
            <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">{suggestion}</p>
          </div>
        </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{t("disclaimer")}</p>

      {discoveryProgress}

      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <Button type="button" size="lg" className="w-full sm:w-auto" onClick={onScanAgain} data-testid="dudu-scanner-scan-again">
          {t("result.scanAgain")}
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onChangeTarget}
          data-testid="dudu-scanner-change-target"
        >
          {t("result.changeTarget")}
        </Button>
      </div>
    </div>
  );
}
