import { getLikesPostdetails, togglelike } from '@/services/like.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


export function useLikesPostDetails() {
    return useQuery({
        queryKey: ['likedSongs'],
        queryFn: getLikesPostdetails,
    });
}

export function useToggleLike() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (musicId: string) => togglelike(musicId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['likedSongs'] });
        },
    });
}
