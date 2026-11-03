import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAlbum, getAlbum, getAlbums } from "@/services/album.service";

export function useCreateAlbum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { draft: Parameters<typeof createAlbum>[0]; onProgress?: Parameters<typeof createAlbum>[1] }) => createAlbum(input.draft, input.onProgress),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["albums"] }),
  });
}
export function useAlbums() { return useQuery({ queryKey: ["albums"], queryFn: getAlbums }); }
export function useAlbum(albumId?: string) {
  return useQuery({
    queryKey: ["album", albumId],
    queryFn: () => {
      if (!albumId) throw new Error("Album ID is required");
      return getAlbum(albumId);
    },
    enabled: !!albumId,
  });
}