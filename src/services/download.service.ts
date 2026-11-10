import { ApiClient } from "@/api/ApiClient";

const BackendUrl =
  process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.100.247:9000";

export interface DownloadAuthResponse {
  downloadId: string;
  musicId: string;
  musicTitle: string;
  primaryArtistName: string;
  coverPhotoUrl: string;
  downloadUrl: string;
  expiresInSeconds: number;
  expiresAt: string;
}

export interface OfflineEntitlementResponse {
  isEntitled: boolean;
  planTier: "premium" | "free";
  entitlementExpiresAt: string | null;
  gracePeriodDays: number;
  serverTime: string;
}

export async function authorizeDownload(
  musicId: string
): Promise<DownloadAuthResponse> {
  return ApiClient(`${BackendUrl}/downloads/authorize`, {
    method: "POST",
    body: JSON.stringify({ musicId }),
  });
}

export async function getOfflineEntitlement(): Promise<OfflineEntitlementResponse> {
  return ApiClient(`${BackendUrl}/downloads/entitlement`, {
    method: "GET",
  });
}

export async function confirmDownloadCompletion(payload: {
  musicId: string;
  fileSize?: number;
  duration?: number;
}): Promise<void> {
  return ApiClient(`${BackendUrl}/downloads/confirm`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteDownloadOnServer(musicId: string): Promise<void> {
  return ApiClient(`${BackendUrl}/downloads/${musicId}`, {
    method: "DELETE",
  });
}
export async function deleteAllDownloadOnServer(): Promise<void> {
  return ApiClient(`${BackendUrl}/downloads/all`, {
    method: "DELETE",
  });
}

