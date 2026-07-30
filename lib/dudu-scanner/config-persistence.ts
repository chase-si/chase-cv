import {
  coerceDuduScannerConfig,
  DUDU_SCANNER_DEFAULT_CONFIG,
  isDuduScannerTargetId,
  isDuduScannerThemeId,
  isTargetInTheme,
  type DuduScannerConfigShape,
} from "@/lib/dudu-scanner/catalog";

export const DUDU_SCANNER_CONFIG_STORAGE_VERSION = 1;
export const DUDU_SCANNER_CONFIG_STORAGE_KEY = "dudu-scanner-config-v1";

type StoredDuduScannerConfig = {
  version: number;
  scanMode?: DuduScannerConfigShape["scanMode"];
  themeId: DuduScannerConfigShape["themeId"];
  targetId: DuduScannerConfigShape["targetId"];
  soundEnabled: boolean;
};

export type DuduScannerStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function parseStoredDuduScannerConfig(raw: string | null): DuduScannerConfigShape {
  if (!raw) {
    return { ...DUDU_SCANNER_DEFAULT_CONFIG };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredDuduScannerConfig>;
    if (parsed.version !== DUDU_SCANNER_CONFIG_STORAGE_VERSION) {
      return { ...DUDU_SCANNER_DEFAULT_CONFIG };
    }
    const legacyTargetIsValid =
      isDuduScannerThemeId(parsed.themeId) &&
      isDuduScannerTargetId(parsed.targetId) &&
      isTargetInTheme(parsed.targetId, parsed.themeId);
    return coerceDuduScannerConfig({
      ...parsed,
      scanMode: parsed.scanMode ?? (legacyTargetIsValid ? "operator" : "mystery"),
    });
  } catch {
    return { ...DUDU_SCANNER_DEFAULT_CONFIG };
  }
}

export function serializeDuduScannerConfig(config: DuduScannerConfigShape): string {
  const payload: StoredDuduScannerConfig = {
    version: DUDU_SCANNER_CONFIG_STORAGE_VERSION,
    scanMode: config.scanMode,
    themeId: config.themeId,
    targetId: config.targetId,
    soundEnabled: config.soundEnabled,
  };
  return JSON.stringify(payload);
}

export function readDuduScannerConfig(storage: DuduScannerStorage): DuduScannerConfigShape {
  return parseStoredDuduScannerConfig(storage.getItem(DUDU_SCANNER_CONFIG_STORAGE_KEY));
}

export function writeDuduScannerConfig(
  storage: DuduScannerStorage,
  config: DuduScannerConfigShape,
): void {
  storage.setItem(DUDU_SCANNER_CONFIG_STORAGE_KEY, serializeDuduScannerConfig(config));
}
