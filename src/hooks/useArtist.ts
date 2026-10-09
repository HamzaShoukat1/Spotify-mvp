import {
    becameAnArtist,
    getArtistdetailforpubluc,
    getArtistProfile,
    getPublicArtists,
    updateArtistProfile,
} from '@/services/artist.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function usebecameArtist() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: becameAnArtist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['artist-profile'] });
            queryClient.invalidateQueries({ queryKey: ['public-artists'] });
            queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        },
    });
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



export function useArtistDetailForPublic(artistId: string) {
    return useQuery({
        queryKey: ['artistDetail', artistId],
        queryFn: () => getArtistdetailforpubluc(artistId),
        enabled: !!artistId,
    });
}

export function usePublicArtists() {
    return useQuery({
        queryKey: ['public-artists'],
        queryFn: getPublicArtists,
    });
}
