export type DuduScannerStoredCustomAsset = {
  id: string;
  mimeType: string;
  blob: Blob;
  createdAt: number;
};

export type DuduScannerCustomAssetStore = {
  list(): Promise<DuduScannerStoredCustomAsset[]>;
  put(asset: DuduScannerStoredCustomAsset): Promise<void>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
};

const DB_NAME = "dudu-scanner-custom-v1";
const STORE_NAME = "assets";

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
  });
}

function openCustomAssetDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB open failed"));
  });
}

export function createMemoryCustomAssetStore(
  initial: DuduScannerStoredCustomAsset[] = [],
): DuduScannerCustomAssetStore {
  const assets = new Map(initial.map((asset) => [asset.id, asset]));
  return {
    async list() {
      return [...assets.values()].sort((left, right) => left.createdAt - right.createdAt);
    },
    async put(asset) {
      assets.set(asset.id, asset);
    },
    async delete(id) {
      assets.delete(id);
    },
    async clear() {
      assets.clear();
    },
  };
}

export async function createIndexedDbCustomAssetStore(): Promise<DuduScannerCustomAssetStore> {
  const db = await openCustomAssetDb();
  return {
    async list() {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const records = await requestToPromise(
        store.getAll() as IDBRequest<DuduScannerStoredCustomAsset[]>,
      );
      return records.sort((left, right) => left.createdAt - right.createdAt);
    },
    async put(asset) {
      const tx = db.transaction(STORE_NAME, "readwrite");
      await requestToPromise(tx.objectStore(STORE_NAME).put(asset));
    },
    async delete(id) {
      const tx = db.transaction(STORE_NAME, "readwrite");
      await requestToPromise(tx.objectStore(STORE_NAME).delete(id));
    },
    async clear() {
      const tx = db.transaction(STORE_NAME, "readwrite");
      await requestToPromise(tx.objectStore(STORE_NAME).clear());
    },
  };
}

export async function openDuduScannerCustomAssetStore(): Promise<{
  store: DuduScannerCustomAssetStore;
  persisted: boolean;
}> {
  if (typeof indexedDB === "undefined") {
    return { store: createMemoryCustomAssetStore(), persisted: false };
  }
  try {
    const store = await createIndexedDbCustomAssetStore();
    return { store, persisted: true };
  } catch {
    return { store: createMemoryCustomAssetStore(), persisted: false };
  }
}
