import * as FileSystem from "expo-file-system/legacy";

export type LocalDownloadStatus =
  | "pending"
  | "downloading"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export interface LocalDownloadRecord {
  id: string;
  musicId: string;
  title: string;
  artist: string;
  localUri: string;
  fileSize: number;
  duration: number;
  coverPhoto: string;
  downloadStatus: LocalDownloadStatus;
  downloadedAt: string | null;
  updatedAt: string;
  downloadUrl?: string;
  resumeData?: string;
}

export interface OfflineEntitlementRecord {
  userId: string;
  isEntitled: boolean;
  planTier: "premium" | "free";
  entitlementExpiresAt: string | null;
  lastValidatedAt: string;
}

const OFFLINE_BASE_DIR = `${FileSystem.documentDirectory || ""}spotify_offline/`;
const AUDIO_DIR = `${OFFLINE_BASE_DIR}audio/`;
const METADATA_FILE = `${OFFLINE_BASE_DIR}downloads_table.json`;
const ENTITLEMENT_FILE = `${OFFLINE_BASE_DIR}entitlement.json`;

let isInitialized = false;
let recordsCache: Map<string, LocalDownloadRecord> = new Map();


export async function initDownloadStorage(): Promise<void> {
  if (isInitialized) return;

  try {
    const baseInfo = await FileSystem.getInfoAsync(OFFLINE_BASE_DIR);
    if (!baseInfo.exists) {
      await FileSystem.makeDirectoryAsync(OFFLINE_BASE_DIR, { intermediates: true });
    }

    const audioInfo = await FileSystem.getInfoAsync(AUDIO_DIR);
    if (!audioInfo.exists) {
      await FileSystem.makeDirectoryAsync(AUDIO_DIR, { intermediates: true });
    }

    const metaInfo = await FileSystem.getInfoAsync(METADATA_FILE);
    if (metaInfo.exists) {
      const content = await FileSystem.readAsStringAsync(METADATA_FILE);
      const parsed: LocalDownloadRecord[] = JSON.parse(content || "[]");
      recordsCache = new Map(parsed.map((item) => [item.musicId, item]));
    } else {
      recordsCache = new Map();
      await FileSystem.writeAsStringAsync(METADATA_FILE, JSON.stringify([]));
    }

    isInitialized = true;
    await reconcileDownloads();
  } catch (error) {
    console.error("[DownloadStorage] Initialization failed:", error);
    // Do NOT set isInitialized = true on failure so the next call will retry.
  }
}

async function persistToDisk(): Promise<void> {
  try {
    const list = Array.from(recordsCache.values());
    await FileSystem.writeAsStringAsync(METADATA_FILE, JSON.stringify(list));
  } catch (error) {
    console.error("[DownloadStorage] Failed to persist downloads metadata:", error);
  }
}

export function getAudioFilePath(musicId: string): string {
  return `${AUDIO_DIR}${musicId}.mp3`;
}

export async function getAllDownloads(): Promise<LocalDownloadRecord[]> {
  await initDownloadStorage();
  return Array.from(recordsCache.values());
}

export async function getCompletedDownloads(): Promise<LocalDownloadRecord[]> {
  await initDownloadStorage();
  const completed: LocalDownloadRecord[] = [];
  for (const record of recordsCache.values()) {
    if (record.downloadStatus === "completed") {
      const exists = await verifyFileExists(record.localUri);
      if (exists) {
        completed.push(record);
      }
    }
  }
  return completed;
}

export async function getDownloadRecord(musicId: string): Promise<LocalDownloadRecord | null> {
  await initDownloadStorage();
  return recordsCache.get(musicId) || null;
}

export async function upsertDownloadRecord(
  partial: Partial<LocalDownloadRecord> & { musicId: string; title: string; artist: string }
): Promise<LocalDownloadRecord> {
  await initDownloadStorage();

  const now = new Date().toISOString();
  const existing = recordsCache.get(partial.musicId);

  const updated: LocalDownloadRecord = {
    id: existing?.id || `dl_${partial.musicId}_${Date.now()}`,
    musicId: partial.musicId,
    title: partial.title || existing?.title || "Unknown Title",
    artist: partial.artist || existing?.artist || "Unknown Artist",
    localUri: partial.localUri || existing?.localUri || getAudioFilePath(partial.musicId),
    fileSize: typeof partial.fileSize === "number" ? partial.fileSize : existing?.fileSize || 0,
    duration: typeof partial.duration === "number" ? partial.duration : existing?.duration || 0,
    coverPhoto: partial.coverPhoto || existing?.coverPhoto || "",
    downloadStatus: partial.downloadStatus || existing?.downloadStatus || "pending",
    downloadedAt:
      partial.downloadStatus === "completed"
        ? now
        : existing?.downloadedAt || null,
    updatedAt: now,
    downloadUrl: partial.downloadUrl || existing?.downloadUrl,
    resumeData: partial.resumeData !== undefined ? partial.resumeData : existing?.resumeData,
  };

  recordsCache.set(partial.musicId, updated);
  await persistToDisk();
  return updated;
}

export async function updateDownloadStatus(
  musicId: string,
  status: LocalDownloadStatus,
  extra?: Partial<LocalDownloadRecord>
): Promise<LocalDownloadRecord | null> {
  await initDownloadStorage();
  const existing = recordsCache.get(musicId);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated: LocalDownloadRecord = {
    ...existing,
    ...extra,
    downloadStatus: status,
    downloadedAt: status === "completed" ? now : existing.downloadedAt,
    updatedAt: now,
  };

  recordsCache.set(musicId, updated);
  await persistToDisk();
  return updated;
}

export async function removeDownloadRecord(musicId: string): Promise<boolean> {
  await initDownloadStorage();
  const existing = recordsCache.get(musicId);
  if (existing) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(existing.localUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(existing.localUri, { idempotent: true });
      }
    } catch (e) {
      console.warn("[DownloadStorage] Could not delete physical audio file:", e);
    }
    recordsCache.delete(musicId);
    await persistToDisk();
    return true;
  }
  return false;
}

export async function verifyFileExists(fileUri: string | null | undefined): Promise<boolean> {
  if (!fileUri) return false;
  try {
    const info = await FileSystem.getInfoAsync(fileUri);
    return Boolean(info.exists && !info.isDirectory && (info.size ?? 0) > 0);
  } catch {
    return false;
  }
}

export async function reconcileDownloads(): Promise<void> {
  let changed = false;
  for (const record of recordsCache.values()) {
    if (record.downloadStatus === "completed") {
      const exists = await verifyFileExists(record.localUri);
      if (!exists) {
        const fixed: LocalDownloadRecord = {
          ...record,
          downloadStatus: "failed",
          downloadedAt: null,
          updatedAt: new Date().toISOString(),
        };
        recordsCache.set(record.musicId, fixed);
        changed = true;
      }
    }
  }
  if (changed) {
    await persistToDisk();
  }
}

export async function saveOfflineEntitlement(
  record: OfflineEntitlementRecord
): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(ENTITLEMENT_FILE, JSON.stringify(record));
  } catch (error) {
    console.error("[DownloadStorage] Failed to save entitlement record:", error);
  }
}

export async function getStoredOfflineEntitlement(): Promise<OfflineEntitlementRecord | null> {
  try {
    const info = await FileSystem.getInfoAsync(ENTITLEMENT_FILE);
    if (!info.exists) return null;
    const content = await FileSystem.readAsStringAsync(ENTITLEMENT_FILE);
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function isOfflinePlaybackAllowed(currentUserId?: string): Promise<boolean> {
  const entitlement = await getStoredOfflineEntitlement();
  if (!entitlement) return false;

  if (currentUserId && entitlement.userId !== currentUserId) {
    return false;
  }

  if (entitlement.planTier !== "premium" || !entitlement.isEntitled) {
    return false;
  }

  if (entitlement.entitlementExpiresAt) {
    const expiry = new Date(entitlement.entitlementExpiresAt).getTime();
    if (Date.now() > expiry) {
      return false;
    }
  }

  return true;
}

export async function clearAccountDownloads(): Promise<void> {
  try {
    await initDownloadStorage();
    for (const record of recordsCache.values()) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(record.localUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(record.localUri, { idempotent: true });
        }
      } catch { }
    }
    recordsCache.clear();
    await persistToDisk();

    const entitlementInfo = await FileSystem.getInfoAsync(ENTITLEMENT_FILE);
    if (entitlementInfo.exists) {
      await FileSystem.deleteAsync(ENTITLEMENT_FILE, { idempotent: true });
    }

    isInitialized = false;
  } catch (error) {
    console.error("[DownloadStorage] Failed to clear account downloads:", error);
  }
}
