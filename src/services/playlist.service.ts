import { ApiClient } from "@/api/ApiClient";

const BackendUrl =
  process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.100.247:9000";
const API = `${BackendUrl}/api`;

export type PlaylistSong = {
  _id: string;
  musicTitle: string;
  primaryArtistName: string;
  coverPhoto?: { url?: string };
};
export type Playlist = {
  _id: string;
  name: string;
  owner: string;
  songs: PlaylistSong[];
  createdAt?: string;
};

export const getUserPlaylists = () => ApiClient(`${API}/playlists/user`) as Promise<Playlist[]>;
export const getPlaylist = (id: string) => ApiClient(`${API}/playlists/${id}`) as Promise<Playlist>;
export const getAvailableSongs = () => ApiClient(`${API}/songs`) as Promise<PlaylistSong[]>;
export const createPlaylist = (name: string) => ApiClient(`${API}/playlists`, {
  method: "POST",
  body: JSON.stringify({ name }),
}) as Promise<Playlist>;
export const renamePlaylist = ({ id, name }: { id: string; name: string }) =>
  ApiClient(`${API}/playlists/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  }) as Promise<Playlist>;
export const deletePlaylist = (id: string) =>
  ApiClient(`${API}/playlists/${id}`, { method: "DELETE" });
export const addSongToPlaylist = ({
  playlistId,
  songId,
}: {
  playlistId: string;
  songId: string;
}) =>
  ApiClient(`${API}/playlists/${playlistId}/songs`, {
    method: "POST",
    body: JSON.stringify({ song_id: songId }),
  }) as Promise<Playlist>;
export const removeSongFromPlaylist = ({
  playlistId,
  songId,
}: {
  playlistId: string;
  songId: string;
}) =>
  ApiClient(`${API}/playlists/${playlistId}/songs/${songId}`, {
    method: "DELETE",
  }) as Promise<Playlist>;
