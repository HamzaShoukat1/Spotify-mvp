import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMusicDNA, type MusicDNAResult } from "@/services/music-dna.service";

export const musicDNAQueryKey = ["musicDNA"] as const;

export function useMusicDNA() {
  return useQuery({
    queryKey: musicDNAQueryKey,
    queryFn: () => getMusicDNA(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRefreshMusicDNA() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => getMusicDNA(true),
    onSuccess: (result: MusicDNAResult) => {
      queryClient.setQueryData(musicDNAQueryKey, result);
    },
  });
}
