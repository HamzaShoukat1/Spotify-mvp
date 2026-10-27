import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addSongToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAvailableSongs,
  getPlaylist,
  getUserPlaylists,
  Playlist,
  renamePlaylist,
  removeSongFromPlaylist,
} from "@/services/playlist.service";

export const playlistsQueryKey = ["playlists"] as const;
export const playlistQueryKey = (id: string) => ["playlist", id] as const;
export const songsQueryKey = ["availableSongs"] as const;

export const useUserPlaylists = () =>
  useQuery({
    queryKey: playlistsQueryKey,
    queryFn: getUserPlaylists,
    staleTime: 30_000,
  });
export const usePlaylist = (id: string) =>
  useQuery({
    queryKey: playlistQueryKey(id),
    queryFn: () => getPlaylist(id),
    enabled: !!id,
  });
export const useAvailableSongs = () =>
  useQuery({
    queryKey: songsQueryKey,
    queryFn: getAvailableSongs,
    staleTime: 60_000,
  });

export function useCreatePlaylist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPlaylist,
    onMutate: async (name) => {
      await qc.cancelQueries({ queryKey: playlistsQueryKey });
      const previous = qc.getQueryData<Playlist[]>(playlistsQueryKey);
      qc.setQueryData<Playlist[]>(playlistsQueryKey, (old) => [
        { _id: `optimistic-${Date.now()}`, name, owner: "", songs: [] },
        ...(old ?? []),
      ]);
      return { previous };
    },
    onError: (_e, _v, ctx) => qc.setQueryData(playlistsQueryKey, ctx?.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: playlistsQueryKey }),
  });
}

export function usePlaylistSongMutation(playlistId: string, adding: boolean) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ songId }: { songId: string }) =>
      adding
        ? addSongToPlaylist({ playlistId, songId })
        : removeSongFromPlaylist({ playlistId, songId }),
    onMutate: async ({ songId }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: playlistQueryKey(playlistId) }),
        qc.cancelQueries({ queryKey: playlistsQueryKey }),
      ]);
      const previousDetail = qc.getQueryData<Playlist>(
        playlistQueryKey(playlistId),
      );
      const previousList = qc.getQueryData<Playlist[]>(playlistsQueryKey);
      const song = qc
        .getQueryData<Playlist["songs"]>(songsQueryKey)
        ?.find((item) => item._id === songId);
      const update = (p: Playlist): Playlist => ({
        ...p,
        songs: adding
          ? p.songs.some((s) => s._id === songId) || !song
            ? p.songs
            : [...p.songs, song]
          : p.songs.filter((s) => s._id !== songId),
      });
      qc.setQueryData<Playlist>(playlistQueryKey(playlistId), (p) =>
        p ? update(p) : p,
      );
      qc.setQueryData<Playlist[]>(playlistsQueryKey, (list) =>
        list?.map((p) => (p._id === playlistId ? update(p) : p)),
      );
      return { previousDetail, previousList };
    },
    onError: (_e, _v, ctx) => {
      qc.setQueryData(playlistQueryKey(playlistId), ctx?.previousDetail);
      qc.setQueryData(playlistsQueryKey, ctx?.previousList);
    },
    onSuccess: (playlist) => {
      qc.setQueryData(playlistQueryKey(playlistId), playlist);
      qc.setQueryData<Playlist[]>(playlistsQueryKey, (list) =>
        list?.map((p) => (p._id === playlistId ? playlist : p)),
      );
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: playlistQueryKey(playlistId) });
      qc.invalidateQueries({ queryKey: playlistsQueryKey });
    },
  });
}

export function useDeletePlaylist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePlaylist,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: playlistsQueryKey });
      const previous = qc.getQueryData<Playlist[]>(playlistsQueryKey);
      qc.setQueryData<Playlist[]>(playlistsQueryKey, (list) =>
        list?.filter((p) => p._id !== id),
      );
      return { previous };
    },
    onError: (_e, _id, ctx) =>
      qc.setQueryData(playlistsQueryKey, ctx?.previous),
    onSettled: (_data, error, id) => {
      if (!error) qc.removeQueries({ queryKey: playlistQueryKey(id) });
      qc.invalidateQueries({ queryKey: playlistsQueryKey });
    },
  });
}

export function useRenamePlaylist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: renamePlaylist,
    onMutate: async ({ id, name }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: playlistsQueryKey }),
        qc.cancelQueries({ queryKey: playlistQueryKey(id) }),
      ]);
      const previousList = qc.getQueryData<Playlist[]>(playlistsQueryKey);
      const previousDetail = qc.getQueryData<Playlist>(playlistQueryKey(id));
      qc.setQueryData<Playlist[]>(playlistsQueryKey, (list) =>
        list?.map((p) => (p._id === id ? { ...p, name } : p)),
      );
      qc.setQueryData<Playlist>(playlistQueryKey(id), (p) =>
        p ? { ...p, name } : p,
      );
      return { previousList, previousDetail };
    },
    onError: (_e, { id }, ctx) => {
      qc.setQueryData(playlistsQueryKey, ctx?.previousList);
      qc.setQueryData(playlistQueryKey(id), ctx?.previousDetail);
    },
    onSettled: (_d, _e, { id }) => {
      qc.invalidateQueries({ queryKey: playlistsQueryKey });
      qc.invalidateQueries({ queryKey: playlistQueryKey(id) });
    },
  });
}
