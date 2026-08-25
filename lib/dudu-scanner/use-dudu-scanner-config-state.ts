"use client";

import { startTransition, useCallback, useEffect, useState } from "react";

import {
  DUDU_SCANNER_DEFAULT_CONFIG,
  type DuduScannerScanMode,
  type DuduScannerConfigShape,
  type DuduScannerTargetId,
  type DuduScannerThemeId,
} from "@/lib/dudu-scanner/catalog";
import { readDuduScannerConfig, writeDuduScannerConfig } from "@/lib/dudu-scanner/config-persistence";
import { readScanModeFromSearch, syncScanModeQueryParam } from "@/lib/dudu-scanner/mode-query";
import {
  applySoundChange,
  applyScanModeChange,
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
      const stored = readDuduScannerConfig(window.localStorage);
      const modeFromUrl = readScanModeFromSearch(window.location.search);
      setConfig(
        modeFromUrl ? applyScanModeChange(stored, modeFromUrl) : stored,
      );
      setHydratedFromStorage(true);
    });
  }, []);

  useEffect(() => {
    if (!hydratedFromStorage) {
      return;
    }
    writeDuduScannerConfig(window.localStorage, config);
    syncScanModeQueryParam(window.history, window.location, config.scanMode);
  }, [config, hydratedFromStorage]);

  const setThemeId = useCallback((themeId: DuduScannerThemeId) => {
    setConfig((current) => applyThemeChange(current, themeId));
  }, []);

  const setScanMode = useCallback((scanMode: DuduScannerScanMode) => {
    setConfig((current) => applyScanModeChange(current, scanMode));
  }, []);

  const setTargetId = useCallback((targetId: DuduScannerTargetId) => {
    setConfig((current) => applyTargetChange(current, targetId));
  }, []);

  const setSoundEnabled = useCallback((soundEnabled: boolean) => {
    setConfig((current) => applySoundChange(current, soundEnabled));
  }, []);

  return {
    config,
    setScanMode,
    setThemeId,
    setTargetId,
    setSoundEnabled,
  };
}
