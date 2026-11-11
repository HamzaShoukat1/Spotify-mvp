import * as FileSystem from "expo-file-system/legacy";
import {
  authorizeDownload,
  confirmDownloadCompletion,
  deleteDownloadOnServer,
} from "./download.service";
import {
  LocalDownloadRecord,
  LocalDownloadStatus,
  getAudioFilePath,
  getDownloadRecord,
  initDownloadStorage,
  removeDownloadRecord,
  updateDownloadStatus,
  upsertDownloadRecord,
  verifyFileExists,
} from "../storage/download-storage";

export interface DownloadProgress {
  musicId: string;
  alreadydownloadedbyteswritten: number;
  expectedBytestowrite: number;
  progressPercentage: number;
}

type downloadprogresslistener = (progress: DownloadProgress) => void;
type downloadStatus = (record: LocalDownloadRecord) => void;

const MAX_CONCURRENT = 2;

class DownloadManager {
  private activeTasks: Map<string, FileSystem.DownloadResumable> = new Map();
  private progressMap: Map<string, DownloadProgress> = new Map();
  private progressListeners: Map<string, Set<downloadprogresslistener>> = new Map();
  private globalStatusListeners: Set<downloadStatus> = new Set();
  private downloadQueue: string[] = [];
  private activeCount: number = 0;

  constructor() {
    this.processQueue = this.processQueue.bind(this)
  }

  public subscribeProgress(
    musicId: string,
    listener: downloadprogresslistener): () => void {
    if (!this.progressListeners.has(musicId)) {
      this.progressListeners.set(musicId, new Set());
    }
    this.progressListeners.get(musicId)!.add(listener);

    const existing = this.progressMap.get(musicId);
    if (existing) {
      listener(existing);
    }

    return () => {
      const set = this.progressListeners.get(musicId);
      if (set) {
        set.delete(listener);
        if (set.size === 0) {
          this.progressListeners.delete(musicId);
        }
      }
    };
  }

  public subscribeStatus(listener: downloadStatus): () => void {
    this.globalStatusListeners.add(listener);
    return () => {
      this.globalStatusListeners.delete(listener);
    };
  }

  private notifyStatus(record: LocalDownloadRecord) {
    this.globalStatusListeners.forEach((fn) => {
      try {
        fn(record);
      } catch (e) {
        console.error("[DownloadManager] Status listener error:", e);
      }
    });
  }

  private notifyProgress(progress: DownloadProgress) {
    this.progressMap.set(progress.musicId, progress);
    const listeners = this.progressListeners.get(progress.musicId);
    if (listeners) {
      listeners.forEach((fn) => {
        try {
          fn(progress);
        } catch (e) {
          console.error("[DownloadManager] Progress listener error:", e);
        }
      });
    }
  }

  public getProgress(musicId: string): DownloadProgress | null {
    return this.progressMap.get(musicId) || null;
  }

  public async startDownload(params: {
    musicId: string;
    title: string;
    artist: string;
    coverPhoto: string;
    duration?: number;
  }): Promise<void> {
    const { musicId, title, artist, coverPhoto, duration = 0 } = params;

    const existing = await getDownloadRecord(musicId);
    if (existing?.downloadStatus === "completed") {
      const exists = await verifyFileExists(existing.localUri);
      if (exists) {
        console.log(`[DownloadManager] Song ${musicId} is already downloaded.`);
        return;
      }
    }

    if (this.activeTasks.has(musicId)) {
      console.log(`[DownloadManager] Song ${musicId} is already actively downloading.`);
      return;
    }

    const record = await upsertDownloadRecord({
      musicId,
      title,
      artist,
      coverPhoto,
      duration,
      downloadStatus: "pending",
      localUri: getAudioFilePath(musicId),
    });
    this.notifyStatus(record);

    if (!this.downloadQueue.includes(musicId)) {
      this.downloadQueue.push(musicId);
    }

    this.processQueue();
  }
  //scheduale the download tasks 
  // private async processQueue() {
  //   if (this.activeCount >= MAX_CONCURRENT || this.downloadQueue.length === 0) {
  //     return;
  //   }

  //   const musicId = this.downloadQueue.shift();
  //   if (!musicId) return;

  //   this.activeCount++;
  //   try {
  //     await this.executeDownload(musicId);
  //   } finally {
  //     this.activeCount--;
  //     this.processQueue();
  //   }
  // }
  private async processQueue() {
    while (this.activeCount < MAX_CONCURRENT && this.downloadQueue.length > 0) {
      const musicId = this.downloadQueue.shift();
      if (!musicId) break;

      this.activeCount++;

      this.executeDownload(musicId)
        .catch(err => console.error("Download failed", err))
        .finally(() => {
          this.activeCount--;
          this.processQueue();
        });
    }
  }

  //perform the download
  private async executeDownload(musicId: string) {
    const record = await getDownloadRecord(musicId);
    if (!record) return;

    if (record.downloadStatus === "cancelled" || record.downloadStatus === "paused") {
      return;
    }

    const targetLocalUri = record.localUri || getAudioFilePath(musicId);

    try {
      await initDownloadStorage();

      const auth = await authorizeDownload(musicId);
      const downloadUrl = auth.downloadUrl;

      await updateDownloadStatus(musicId, "downloading", {
        downloadUrl,
      });
      const downloadingRecord = (await getDownloadRecord(musicId))!;
      this.notifyStatus(downloadingRecord);

      // 2. Setup Progress Callback
      const progressCallback = (data: FileSystem.DownloadProgressData) => {
        const total = data.totalBytesExpectedToWrite;
        const written = data.totalBytesWritten;
        const percentage = total > 0 ? Math.min(Math.round((written / total) * 100), 99) : 0;

        this.notifyProgress({
          musicId,
          alreadydownloadedbyteswritten: written,
          expectedBytestowrite: total,
          progressPercentage: percentage,
        });
      };

      const resumable = FileSystem.createDownloadResumable(
        downloadUrl,
        targetLocalUri,
        {},
        progressCallback,
        record.resumeData
      );

      this.activeTasks.set(musicId, resumable);

      const result = await resumable.downloadAsync();
      this.activeTasks.delete(musicId);

      if (result && result.uri) {
        const info = await FileSystem.getInfoAsync(result.uri);
        if (info.exists && (info.size ?? 0) > 0) {
          const completedRecord = await updateDownloadStatus(musicId, "completed", {
            fileSize: info.size,
            localUri: result.uri,
          });

          this.notifyProgress({
            musicId,
            alreadydownloadedbyteswritten: info.size ?? 0,
            expectedBytestowrite: info.size ?? 0,
            progressPercentage: 100,
          });

          if (completedRecord) {
            this.notifyStatus(completedRecord);
          }

          confirmDownloadCompletion({
            musicId,
            fileSize: info.size,
            duration: record.duration,
          }).catch((err) =>
            console.warn("[DownloadManager] Failed to confirm on server:", err)
          );
        } else {
          throw new Error("Downloaded file is empty or missing");
        }
      }
    } catch (error: any) {
      this.activeTasks.delete(musicId);
      const current = await getDownloadRecord(musicId);
      // If paused or cancelled by user, don't mark failed
      if (current?.downloadStatus === "paused" || current?.downloadStatus === "cancelled") {
        return;
      }

      console.error(`[DownloadManager] Download failed for ${musicId}:`, error);
      const failedRecord = await updateDownloadStatus(musicId, "failed");
      if (failedRecord) {
        this.notifyStatus(failedRecord);
      }
    }
  }

  public async pauseDownload(musicId: string): Promise<void> {
    const task = this.activeTasks.get(musicId);
    if (task) {
      try {
        const pauseResult = await task.pauseAsync();
        this.activeTasks.delete(musicId);
        const record = await updateDownloadStatus(musicId, "paused", {
          resumeData: pauseResult.resumeData,
        });
        if (record) this.notifyStatus(record);
      } catch (error) {
        console.error(`[DownloadManager] Failed to pause task for ${musicId}:`, error);
      }
    } else {
      // Remove from pending queue if not yet started
      const index = this.downloadQueue.indexOf(musicId);
      if (index !== -1) {
        this.downloadQueue.splice(index, 1);
      }
      const record = await updateDownloadStatus(musicId, "paused");
      if (record) this.notifyStatus(record);
    }
  }

  public async resumeDownload(musicId: string): Promise<void> {
    const record = await getDownloadRecord(musicId);
    if (!record) return;

    // Update status BEFORE enqueueing so executeDownload doesn't early-return on "paused"
    const updatedRecord = await updateDownloadStatus(musicId, "pending");
    if (updatedRecord) this.notifyStatus(updatedRecord);

    if (!this.downloadQueue.includes(musicId)) {
      this.downloadQueue.push(musicId);
    }
    this.processQueue();
  }

  public async cancelDownload(musicId: string): Promise<void> {
    const task = this.activeTasks.get(musicId);
    if (task) {
      try {
        await task.cancelAsync();
      } catch { }
      this.activeTasks.delete(musicId);
    }

    const index = this.downloadQueue.indexOf(musicId);
    if (index !== -1) {
      this.downloadQueue.splice(index, 1);
    }

    this.progressMap.delete(musicId);

    const existing = await getDownloadRecord(musicId);

    if (existing?.localUri) {
      try {
        await FileSystem.deleteAsync(existing.localUri, { idempotent: true });
      } catch (error) {
        console.error(`[DownloadManager] Failed to delete file for ${musicId}:`, error);
      }
    }

    await removeDownloadRecord(musicId);

    const record: LocalDownloadRecord = {
      id: `cancelled_${musicId}`,
      musicId,
      title: existing?.title ?? "",
      artist: existing?.artist ?? "",
      localUri: "",
      fileSize: 0,
      duration: existing?.duration ?? 0,
      coverPhoto: existing?.coverPhoto ?? "",
      downloadStatus: "cancelled",
      downloadedAt: null,
      updatedAt: new Date().toISOString(),
    };
    this.notifyStatus(record);
  }




  public async retryDownload(musicId: string): Promise<void> {
    const record = await getDownloadRecord(musicId);
    if (record) {
      await this.startDownload({
        musicId: record.musicId,
        title: record.title,
        artist: record.artist,
        coverPhoto: record.coverPhoto,
        duration: record.duration,
      });
    }
  }

  public async removeDownload(musicId: string): Promise<void> {
    await this.cancelDownload(musicId);
    deleteDownloadOnServer(musicId).catch(() => null);
  }

  public async getStatus(musicId: string): Promise<LocalDownloadStatus | "none"> {
    const record = await getDownloadRecord(musicId);
    if (!record) return "none";
    if (record.downloadStatus === "completed") {
      const exists = await verifyFileExists(record.localUri);
      return exists ? "completed" : "none";
    }
    return record.downloadStatus;
  }
}

export const downloadManager = new DownloadManager();
