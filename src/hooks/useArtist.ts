import {
    becameAnArtist,
    createMusic,
    getArtistProfile,
    updateArtistProfile,
} from '@/services/artist.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function usebecameArtist() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: becameAnArtist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['artist-profile'] });
        },
    });
}


export function useCreateMusic() {
    return useMutation({
        mutationFn: createMusic
    })
}

export const artistProfileQueryKey = ['artist-profile'];

export function useArtistProfile() {
    return useQuery({
        queryKey: artistProfileQueryKey,
        queryFn: getArtistProfile,
    });
}

export function useUpdateArtistProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateArtistProfile,
        onSuccess: (profile) => {
            queryClient.setQueryData(artistProfileQueryKey, profile);
        },
    });
}