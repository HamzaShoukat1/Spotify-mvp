import { Heart } from 'lucide-react-native';
import { Pressable } from 'react-native';
import Toast from 'react-native-toast-message';
import { useLikedSongs, useToggleLike } from '@/hooks/use-like';

type LikeButtonProps = {
    musicId: string;
    size?: number;
};

export function LikeButton({ musicId, size = 25 }: LikeButtonProps) {
    const { data: likedSongs } = useLikedSongs();
    const { mutate: toggleLike, isPending } = useToggleLike();
    const isLiked = likedSongs?.some((song) => song.music?._id === musicId) ?? false;

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={isLiked ? 'Unlike song' : 'Like song'}
            accessibilityState={{ checked: isLiked, disabled: isPending }}
            disabled={isPending}
            hitSlop={10}
            onPress={(event) => {
                event.stopPropagation();
                const nextLikedState = !isLiked;

                toggleLike({ musicId, isLiked: !isLiked });

                Toast.show({
                    position: 'bottom',
                    text1: `${nextLikedState ? 'Added to' : 'Removed from'} Liked Songs`
                });

            }}
            className={`h-10 w-10 items-center justify-center rounded-full ${isLiked ? 'bg-[#1DB954]' : 'bg-transparent'
                }`}
        >
            <Heart
                color={isLiked ? '#1DB954' : '#FFFFFF'}
                fill={isLiked ? '#121212' : 'transparent'}
                size={size}
                strokeWidth={2}
            />
        </Pressable>
    );
}
