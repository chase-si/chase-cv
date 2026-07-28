"use client";

import { startTransition, useCallback, useEffect, useState } from "react";

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

export function useDuduScannerConfigState() {
  const [config, setConfig] = useState<DuduScannerConfigShape>(() => ({
    ...DUDU_SCANNER_DEFAULT_CONFIG,
  }));
  const [hydratedFromStorage, setHydratedFromStorage] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setConfig(readDuduScannerConfig(window.localStorage));
      setHydratedFromStorage(true);
    });
  }, []);

  useEffect(() => {
    if (!hydratedFromStorage) {
      return;
    }
    writeDuduScannerConfig(window.localStorage, config);
  }, [config, hydratedFromStorage]);

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
