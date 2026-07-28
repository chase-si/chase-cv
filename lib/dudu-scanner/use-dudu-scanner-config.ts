"use client";

import { useCallback, useEffect, useState } from "react";

import {
  DUDU_SCANNER_DEFAULT_CONFIG,
  type DuduScannerConfigShape,
  type DuduScannerTargetId,
  type DuduScannerThemeId,
} from "@/lib/dudu-scanner/catalog";
import { readDuduScannerConfig, writeDuduScannerConfig } from "@/lib/dudu-scanner/config-persistence";
import {
  applySoundChange,
  applyTargetChange,
  applyThemeChange,
} from "@/lib/dudu-scanner/config-state";

function readInitialConfig(): DuduScannerConfigShape {
  if (typeof window === "undefined") {
    return { ...DUDU_SCANNER_DEFAULT_CONFIG };
  }
  return readDuduScannerConfig(window.localStorage);
}

export function useDuduScannerConfig() {
  const [config, setConfig] = useState<DuduScannerConfigShape>(readInitialConfig);

  useEffect(() => {
    writeDuduScannerConfig(window.localStorage, config);
  }, [config]);

  const setThemeId = useCallback((themeId: DuduScannerThemeId) => {
    setConfig((current) => applyThemeChange(current, themeId));
  }, []);

  const setTargetId = useCallback((targetId: DuduScannerTargetId) => {
    setConfig((current) => applyTargetChange(current, targetId));
  }, []);

  const setSoundEnabled = useCallback((soundEnabled: boolean) => {
    setConfig((current) => applySoundChange(current, soundEnabled));
  }, []);

  return {
    config,
    setThemeId,
    setTargetId,
    setSoundEnabled,
  };
}
