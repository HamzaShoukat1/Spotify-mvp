import { createMusic, getMusicDetail, getMusicTrack } from "@/services/music.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";




export function useCreateMusic() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createMusic,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['music-detail-for-home'] });

        }

    })
}

const querykey = ["music-detail-for-home"]
export function useMusicDetailforhome() {
    return useQuery({
        queryKey: querykey,
        queryFn: getMusicDetail,
    });
}


export function useGetMusicTrack(musicId: string) {
    return useQuery({
        queryKey: ['musicTrack', musicId],
        queryFn: () => getMusicTrack(musicId),
        enabled: !!musicId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,

    });
}

