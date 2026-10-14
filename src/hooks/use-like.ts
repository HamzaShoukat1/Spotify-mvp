import { getLikedSongs, likeSong, unlikeSong } from "@/services/like.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type LikeRecord = {
    _id: string;
    music: {
        _id: string;
        musicTitle: string;
        primaryArtistName: string;
        coverPhoto?: {
            url?: string;
        };
    };
    createdAt?: string;
};

export const likedSongsQueryKey = ["likedSongs"];

export function useLikedSongs() {
    return useQuery({
        queryKey: likedSongsQueryKey,
        queryFn: getLikedSongs as () => Promise<LikeRecord[]>,
        staleTime: 30_000,
    });
}

type ToggleLikeVariables = {
    musicId: string;
    isLiked: boolean;
};

export function useToggleLike() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ musicId, isLiked }: ToggleLikeVariables) => {
            if (isLiked) {
                return likeSong(musicId);
            }

            return unlikeSong(musicId);
        },

        onMutate: async ({ musicId, isLiked }) => {
            await queryClient.cancelQueries({
                queryKey: likedSongsQueryKey,
            });

            const previousSongs =
                queryClient.getQueryData<LikeRecord[]>(likedSongsQueryKey);

            queryClient.setQueryData<LikeRecord[]>(likedSongsQueryKey, (oldSongs) => {
                if (!oldSongs) return oldSongs;

                if (isLiked) {
                    return oldSongs.some((song) => song.music?._id === musicId)
                        ? oldSongs
                        : [
                            {
                                _id: `optimistic-${musicId}`,
                                music: {
                                    _id: musicId,
                                    musicTitle: "",
                                    primaryArtistName: "",
                                },
                            },
                            ...oldSongs,
                        ];
                }

                return oldSongs.filter((song) => song.music?._id !== musicId);
            });

            return { previousSongs };
        },

        onError: (_error, _variables, context) => {
            queryClient.setQueryData(likedSongsQueryKey, context?.previousSongs);
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: likedSongsQueryKey,
            });
        },
    });
}
