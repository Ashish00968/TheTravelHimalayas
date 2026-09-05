import { useSyncExternalStore, useCallback } from "react";

export interface SavedPlace {
  id: string;
  name: string;
  type: string;
  regionId: string;
  regionName: string;
  divisionId: string;
  divisionName?: string;
  elevation?: string;
  duration?: string;
  difficulty?: string;
  image?: string;
  url: string;
  savedAt: number;
}

const STORAGE_KEY = "dht_saved_expeditions_v1";

let cachedRaw: string | null = null;
let cachedSnapshot: SavedPlace[] = [];

function readFromStorage(): SavedPlace[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedSnapshot;
    cachedRaw = raw;
    cachedSnapshot = raw ? (Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : []) : [];
    return cachedSnapshot;
  } catch {
    return [];
  }
}

function writeToStorage(items: SavedPlace[]): void {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(items);
    cachedRaw = raw;
    cachedSnapshot = items;
    localStorage.setItem(STORAGE_KEY, raw);
    window.dispatchEvent(new CustomEvent("dht_saved_updated", { detail: items }));
  } catch {
    // Handle storage quota exceeded gracefully
  }
}

export function getSavedExpeditions(): SavedPlace[] {
  return readFromStorage();
}

export function isExpeditionSaved(id: string): boolean {
  return readFromStorage().some((item) => item.id === id);
}

export function toggleSaveExpedition(place: Omit<SavedPlace, "savedAt">): boolean {
  const current = readFromStorage();
  const exists = current.some((item) => item.id === place.id);

  if (exists) {
    const next = current.filter((item) => item.id !== place.id);
    writeToStorage(next);
    return false;
  } else {
    const next = [{ ...place, savedAt: Date.now() }, ...current];
    writeToStorage(next);
    return true;
  }
}

export function removeSavedExpedition(id: string): void {
  const current = readFromStorage();
  const next = current.filter((item) => item.id !== id);
  writeToStorage(next);
}

export function clearAllSavedExpeditions(): void {
  writeToStorage([]);
}

function subscribe(callback: () => void) {
  window.addEventListener("dht_saved_updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("dht_saved_updated", callback);
    window.removeEventListener("storage", callback);
  };
}

const SERVER_SNAPSHOT: SavedPlace[] = [];
function getServerSnapshot(): SavedPlace[] {
  return SERVER_SNAPSHOT;
}

/** React 19 hook for synchronized, zero-cascading access to saved expeditions */
export function useSavedExpeditions() {
  const saved = useSyncExternalStore(subscribe, readFromStorage, getServerSnapshot);

  const toggle = useCallback((place: Omit<SavedPlace, "savedAt">) => {
    return toggleSaveExpedition(place);
  }, []);

  const remove = useCallback((id: string) => {
    removeSavedExpedition(id);
  }, []);

  const clear = useCallback(() => {
    clearAllSavedExpeditions();
  }, []);

  const isSaved = useCallback(
    (id: string) => {
      return saved.some((item) => item.id === id);
    },
    [saved]
  );

  return {
    saved,
    count: saved.length,
    mounted: true,
    isSaved,
    toggle,
    remove,
    clear,
  };
}

