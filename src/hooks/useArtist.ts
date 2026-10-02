import { becameAnArtist, createMusic } from '@/services/artist.service';
import { useMutation } from '@tanstack/react-query';

export function usebecameArtist() {
    return useMutation({
        mutationFn: becameAnArtist,
    });
}


export function useCreateMusic() {
    return useMutation({
        mutationFn: createMusic
    })
}