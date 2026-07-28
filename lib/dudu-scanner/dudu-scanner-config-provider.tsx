"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { DuduScannerConfigShape, DuduScannerTargetId, DuduScannerThemeId } from "@/lib/dudu-scanner/catalog";
import { useDuduScannerConfigState } from "@/lib/dudu-scanner/use-dudu-scanner-config-state";

type DuduScannerConfigContextValue = {
  config: DuduScannerConfigShape;
  setThemeId: (themeId: DuduScannerThemeId) => void;
  setTargetId: (targetId: DuduScannerTargetId) => void;
  setSoundEnabled: (soundEnabled: boolean) => void;
};

const DuduScannerConfigContext = createContext<DuduScannerConfigContextValue | null>(null);

export function DuduScannerConfigProvider({ children }: { children: ReactNode }) {
  const value = useDuduScannerConfigState();
  return (
    <DuduScannerConfigContext.Provider value={value}>{children}</DuduScannerConfigContext.Provider>
  );
}

export function useDuduScannerConfig() {
  const context = useContext(DuduScannerConfigContext);
  if (!context) {
    throw new Error("useDuduScannerConfig must be used within DuduScannerConfigProvider");
  }
  return context;
}
