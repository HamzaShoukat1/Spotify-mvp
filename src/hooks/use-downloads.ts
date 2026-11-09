import { useEffect, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  downloadManager,
  DownloadProgress,
} from "../services/download-manager.service";
import {
  getCompletedDownloads,
  getDownloadRecord,
  LocalDownloadRecord,
  LocalDownloadStatus,
  getStoredOfflineEntitlement,
  saveOfflineEntitlement,
  isOfflinePlaybackAllowed,
} from "../storage/download-storage";
import { getOfflineEntitlement } from "../services/download.service";
import { useAuth } from "../context/Auth.Context";

export const DOWNLOADS_QUERY_KEY = ["downloads", "list"] as const;
export const ENTITLEMENT_QUERY_KEY = ["downloads", "entitlement"] as const;

export function useDownloadedSongs() {
  const queryClient = useQueryClient();

  const query = useQuery<LocalDownloadRecord[]>({
    queryKey: DOWNLOADS_QUERY_KEY,
    queryFn: getCompletedDownloads,
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    const unsubscribe = downloadManager.subscribeStatus(() => {
      queryClient.invalidateQueries({ queryKey: DOWNLOADS_QUERY_KEY });
    });
    return unsubscribe;
  }, [queryClient]);

  return {
    ...query,
    downloadedSongs: query.data || [],
    count: query.data?.length || 0,
  };
}

export function useSongDownload(musicId: string | null | undefined) {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<DownloadProgress | null>(
    musicId ? downloadManager.getProgress(musicId) : null
  );
  const [liveStatus, setLiveStatus] = useState<LocalDownloadStatus | "none">("none");

  const { data: record, refetch } = useQuery<LocalDownloadRecord | null>({
    queryKey: ["downloads", "record", musicId],
    queryFn: async () => {
      if (!musicId) return null;
      return getDownloadRecord(musicId);
    },
    enabled: Boolean(musicId),
  });

  useEffect(() => {
    if (record) {
      setLiveStatus(record.downloadStatus);
    } else {
      setLiveStatus("none");
    }
  }, [record]);

  useEffect(() => {
    if (!musicId) return;

    const unsubProgress = downloadManager.subscribeProgress(musicId, (p) => {
      setProgress(p);
    });

    const unsubStatus = downloadManager.subscribeStatus((r) => {
      if (r.musicId === musicId) {
        setLiveStatus(r.downloadStatus);
        refetch();
        queryClient.invalidateQueries({ queryKey: DOWNLOADS_QUERY_KEY });
      }
    });

    return () => {
      unsubProgress();
      unsubStatus();
    };
  }, [musicId, queryClient, refetch]);

  const startDownload = useCallback(
    async (song: {
      title: string;
      artist: string;
      coverPhoto: string;
      duration?: number;
    }) => {
      if (!musicId) return;
      await downloadManager.startDownload({
        musicId,
        title: song.title,
        artist: song.artist,
        coverPhoto: song.coverPhoto,
        duration: song.duration,
      });
    },
    [musicId]
  );

  const pauseDownload = useCallback(async () => {
    if (!musicId) return;
    await downloadManager.pauseDownload(musicId);
  }, [musicId]);

  const resumeDownload = useCallback(async () => {
    if (!musicId) return;
    await downloadManager.resumeDownload(musicId);
  }, [musicId]);

  const cancelDownload = useCallback(async () => {
    if (!musicId) return;
    await downloadManager.cancelDownload(musicId);
  }, [musicId]);

  const removeDownload = useCallback(async () => {
    if (!musicId) return;
    await downloadManager.removeDownload(musicId);
  }, [musicId]);

  const retryDownload = useCallback(async () => {
    if (!musicId) return;
    await downloadManager.retryDownload(musicId);
  }, [musicId]);

  const isDownloaded = liveStatus === "completed";
  const isDownloading = liveStatus === "downloading" || liveStatus === "pending";
  const isPaused = liveStatus === "paused";
  const isFailed = liveStatus === "failed";

  return {
    status: liveStatus,
    record,
    progress,
    isDownloaded,
    isDownloading,
    isPaused,
    isFailed,
    startDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    removeDownload,
    retryDownload,
  };
}

export function useOfflineEntitlement() {
  const { user } = useAuth();
  const userId = user?._id;

  const query = useQuery({
    queryKey: [...ENTITLEMENT_QUERY_KEY, userId],
    queryFn: async () => {
      try {
        const remote = await getOfflineEntitlement();
        if (userId) {
          await saveOfflineEntitlement({
            userId,
            isEntitled: remote.isEntitled,
            planTier: remote.planTier,
            entitlementExpiresAt: remote.entitlementExpiresAt,
            lastValidatedAt: new Date().toISOString(),
          });
        }
        return remote;
      } catch (error) {
        const local = await getStoredOfflineEntitlement();
        if (local) {
          return {
            isEntitled: local.isEntitled,
            planTier: local.planTier,
            entitlementExpiresAt: local.entitlementExpiresAt,
            gracePeriodDays: 30,
            serverTime: local.lastValidatedAt,
          };
        }
        throw error;
      }
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });

  const checkCanPlayOffline = useCallback(async () => {
    return isOfflinePlaybackAllowed(userId);
  }, [userId]);

  return {
    ...query,
    isEntitled: Boolean(query.data?.isEntitled),
    entitlementExpiresAt: query.data?.entitlementExpiresAt || null,
    checkCanPlayOffline,
  };
}
