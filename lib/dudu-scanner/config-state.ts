import {
  coerceDuduScannerConfig,
  type DuduScannerConfigShape,
  type DuduScannerScanMode,
  type DuduScannerThemeId,
} from "@/lib/dudu-scanner/catalog";

export type DuduScannerConfig = DuduScannerConfigShape;

export function applyThemeChange(
  config: DuduScannerConfig,
  themeId: DuduScannerThemeId,
): DuduScannerConfig {
  return coerceDuduScannerConfig({ ...config, themeId });
}

export function applyScanModeChange(
  config: DuduScannerConfig,
  scanMode: DuduScannerScanMode,
): DuduScannerConfig {
  return { ...config, scanMode };
}

export function applyTargetChange(
  config: DuduScannerConfig,
  targetId: DuduScannerConfig["targetId"],
): DuduScannerConfig {
  return coerceDuduScannerConfig({ ...config, targetId });
}

export function applySoundChange(
  config: DuduScannerConfig,
  soundEnabled: boolean,
): DuduScannerConfig {
  return { ...config, soundEnabled };
}
