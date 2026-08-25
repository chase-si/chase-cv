"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { convertHeicToJpeg } from "@/lib/dudu-scanner/convert-heic-to-jpeg";
import {
  openDuduScannerCustomAssetStore,
  type DuduScannerCustomAssetStore,
  type DuduScannerStoredCustomAsset,
} from "@/lib/dudu-scanner/custom-asset-store";
import {
  ingestCustomImageFiles,
  type DuduScannerCustomIngestSkipReason,
} from "@/lib/dudu-scanner/custom-image-ingest";

export type DuduScannerCustomLibraryItem = {
  id: string;
  objectUrl: string;
  mimeType: string;
};

type DuduScannerCustomLibraryContextValue = {
  items: DuduScannerCustomLibraryItem[];
  selectedAssetId: string | null;
  persistFailed: boolean;
  hydrated: boolean;
  ingestNotice: DuduScannerCustomIngestSkipReason | null;
  setSelectedAssetId: (assetId: string | null) => void;
  toggleSelectedAssetId: (assetId: string) => void;
  addFiles: (files: readonly File[]) => Promise<void>;
  removeAsset: (assetId: string) => Promise<void>;
  clearLibrary: () => Promise<void>;
};

const DuduScannerCustomLibraryContext = createContext<DuduScannerCustomLibraryContextValue | null>(
  null,
);

function revokeAll(urls: string[]) {
  for (const url of urls) {
    URL.revokeObjectURL(url);
  }
}

export function DuduScannerCustomLibraryProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<DuduScannerCustomAssetStore | null>(null);
  const objectUrlsRef = useRef<Map<string, string>>(new Map());
  const [items, setItems] = useState<DuduScannerCustomLibraryItem[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [persistFailed, setPersistFailed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [ingestNotice, setIngestNotice] = useState<DuduScannerCustomIngestSkipReason | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { store, persisted } = await openDuduScannerCustomAssetStore();
      if (cancelled) {
        return;
      }
      storeRef.current = store;
      setPersistFailed(!persisted);
      const stored = await store.list();
      if (cancelled) {
        return;
      }
      const nextItems = stored.map((asset) => {
        const objectUrl = URL.createObjectURL(asset.blob);
        objectUrlsRef.current.set(asset.id, objectUrl);
        return { id: asset.id, objectUrl, mimeType: asset.mimeType };
      });
      setItems(nextItems);
      setHydrated(true);
    })();

    return () => {
      cancelled = true;
      revokeAll([...objectUrlsRef.current.values()]);
      objectUrlsRef.current.clear();
    };
  }, []);

  const addFiles = useCallback(async (files: readonly File[]) => {
    const store = storeRef.current;
    if (!store) {
      return;
    }
    const result = await ingestCustomImageFiles(files, items.length, convertHeicToJpeg);
    setIngestNotice(result.skipped[0]?.reason ?? null);
    if (result.accepted.length === 0) {
      return;
    }
    const createdAtBase = Date.now();
    const nextStored: DuduScannerStoredCustomAsset[] = result.accepted.map((asset, index) => ({
      id: asset.id,
      mimeType: asset.mimeType,
      blob: asset.blob,
      createdAt: createdAtBase + index,
    }));
    for (const asset of nextStored) {
      await store.put(asset);
    }
    setItems((current) => [
      ...current,
      ...nextStored.map((asset) => {
        const objectUrl = URL.createObjectURL(asset.blob);
        objectUrlsRef.current.set(asset.id, objectUrl);
        return { id: asset.id, objectUrl, mimeType: asset.mimeType };
      }),
    ]);
  }, [items.length]);

  const removeAsset = useCallback(async (assetId: string) => {
    const store = storeRef.current;
    if (!store) {
      return;
    }
    await store.delete(assetId);
    const objectUrl = objectUrlsRef.current.get(assetId);
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrlsRef.current.delete(assetId);
    }
    setItems((current) => current.filter((item) => item.id !== assetId));
    setSelectedAssetId((current) => (current === assetId ? null : current));
  }, []);

  const clearLibrary = useCallback(async () => {
    const store = storeRef.current;
    if (!store) {
      return;
    }
    await store.clear();
    revokeAll([...objectUrlsRef.current.values()]);
    objectUrlsRef.current.clear();
    setItems([]);
    setSelectedAssetId(null);
  }, []);

  const toggleSelectedAssetId = useCallback((assetId: string) => {
    setSelectedAssetId((current) => (current === assetId ? null : assetId));
  }, []);

  const value = useMemo(
    () => ({
      items,
      selectedAssetId,
      persistFailed,
      hydrated,
      ingestNotice,
      setSelectedAssetId,
      toggleSelectedAssetId,
      addFiles,
      removeAsset,
      clearLibrary,
    }),
    [
      addFiles,
      clearLibrary,
      hydrated,
      ingestNotice,
      items,
      persistFailed,
      removeAsset,
      selectedAssetId,
      toggleSelectedAssetId,
    ],
  );

  return (
    <DuduScannerCustomLibraryContext.Provider value={value}>
      {children}
    </DuduScannerCustomLibraryContext.Provider>
  );
}

export function useDuduScannerCustomLibrary() {
  const context = useContext(DuduScannerCustomLibraryContext);
  if (!context) {
    throw new Error("useDuduScannerCustomLibrary must be used within DuduScannerCustomLibraryProvider");
  }
  return context;
}
