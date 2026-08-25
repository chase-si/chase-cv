"use client";

import { useCallback, useEffect, useState } from "react";

import { DUDU_SCANNER_TARGET_IDS, type DuduScannerTargetId } from "@/lib/dudu-scanner/catalog";

const STORAGE_KEY = "dudu-scanner-discoveries-v1";

function readDiscoveries(): DuduScannerTargetId[] {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = value ? JSON.parse(value) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((targetId): targetId is DuduScannerTargetId =>
      typeof targetId === "string" && DUDU_SCANNER_TARGET_IDS.includes(targetId as DuduScannerTargetId),
    );
  } catch {
    return [];
  }
}

export function useDuduScannerDiscoveries() {
  const [discoveries, setDiscoveries] = useState<Set<DuduScannerTargetId>>(() => new Set());

  useEffect(() => {
    setDiscoveries(new Set(readDiscoveries()));
  }, []);

  const discoverTarget = useCallback((targetId: DuduScannerTargetId) => {
    setDiscoveries((current) => {
      if (current.has(targetId)) {
        return current;
      }
      const next = new Set(current).add(targetId);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { discoveredCount: discoveries.size, discoverTarget };
}
