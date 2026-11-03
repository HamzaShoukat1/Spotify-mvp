import { getAccessToken } from "@/storage/secureStorage";
import { ApiClient } from "@/api/ApiClient";
import type { AlbumDraft } from "@/context/AlbumContext";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.100.247:9000";

export type AlbumSummary = {
  _id: string;
  albumTitle: string;
  artistName: string;
  albumCoverArt: { url: string; publicId: string };
  createdAt?: string;
};

export type AlbumDetails = AlbumSummary & {
  tracks: {
    _id: string;
    musicTitle: string;
    trackNumber: number;
    coverPhoto?: { url: string; publicId: string };
  }[];
};

const MIME_TYPES: Record<string, string> = {
  aac: "audio/aac",
  m4a: "audio/mp4",
  mp3: "audio/mpeg",
  ogg: "audio/ogg",
  wav: "audio/wav",
};

function getMimeType(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return MIME_TYPES[extension ?? ""] ?? "audio/mpeg";
}

export async function createAlbum(draft: AlbumDraft, onProgress?: (percent: number) => void): Promise<AlbumSummary> {
  const formData = new FormData();
  formData.append("albumTitle", draft.albumTitle);
  formData.append("artistName", draft.artistName);
  formData.append("trackMetadata", JSON.stringify(draft.tracks.map(({ title, fileName }) => ({ title, fileName }))));
  formData.append("coverPhoto", { uri: draft.coverPhoto, name: "album-cover.jpg", type: "image/jpeg" } as unknown as Blob);
  draft.tracks.forEach((track) => formData.append("tracks", {
    uri: track.uri,
    name: track.fileName,
    type: track.mimeType || getMimeType(track.fileName),
  } as unknown as Blob));

  const token = await getAccessToken();
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${BACKEND_URL}/api/albums/`);
    request.timeout = 15 * 60 * 1000;
    if (token) request.setRequestHeader("Authorization", `Bearer ${token}`);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress?.(Math.min(99, Math.max(0, percent)));
      }
    };
    request.onload = () => {
      try {
        const data = JSON.parse(request.responseText);
        if (request.status >= 200 && request.status < 300) {
          onProgress?.(100);
          resolve(data.data);
        }
        else reject(new Error(data?.message || "Album upload failed"));
      } catch { reject(new Error("Album upload failed")); }
    };
    request.onerror = () => reject(new Error("Network error while uploading album"));
    request.ontimeout = () => reject(new Error("Album upload timed out. Please try again."));
    request.onabort = () => reject(new Error("Album upload was cancelled."));
    request.send(formData);
  });
}

export const getAlbums = () => ApiClient(`${BACKEND_URL}/api/albums`, { method: "GET" }) as Promise<AlbumSummary[]>;
export const getAlbum = (albumId: string) => ApiClient(`${BACKEND_URL}/api/albums/${albumId}`, { method: "GET" }) as Promise<AlbumDetails>;