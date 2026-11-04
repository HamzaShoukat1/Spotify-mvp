import { useMutation, useQueryClient } from "@tanstack/react-query";
import { processVoiceAgent, VoiceAgentResult } from "@/services/ai-agent.service";
import { playlistsQueryKey } from "@/hooks/use-playlist";
import type { Playlist } from "@/services/playlist.service";
import Toast from "react-native-toast-message";

export function useVoiceAgent() {
  const queryClient = useQueryClient();
  return useMutation<VoiceAgentResult, Error, string>({
    mutationFn: processVoiceAgent,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: playlistsQueryKey, refetchType: "all" });
      if (result.playlist) {
        const playlist: Playlist = {
          _id: result.playlist._id,
          name: result.playlist.name,
          owner: result.playlist.owner ?? "",
          songs: result.playlist.songs ?? [],
        };
        queryClient.setQueryData<Playlist[]>(playlistsQueryKey, (current) => [
          playlist,
          ...(current ?? []).filter((item) => item._id !== playlist._id),
        ]);
        queryClient.invalidateQueries({ queryKey: ["playlist", result.playlist._id] });
      }
      const toastText = {
        created: "Playlist created",
        added: "Songs added",
        removed: "Songs removed",
        deleted: "Playlist deleted",
        none: "Request completed",
      }[result.action];
      Toast.show({
        type: "success",
        text1: toastText,
        text2: result.playlist?.name ?? result.message,
        position: "top",
      });
    },
  });
}
