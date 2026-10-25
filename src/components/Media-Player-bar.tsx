import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import TrackPlayer, {
    useActiveTrack,
    usePlaybackState,
    State,
    useProgress
} from 'react-native-track-player';
import { router } from 'expo-router';

export const MediaPlayerBar = () => {
    const activeTrack = useActiveTrack();
    const playbackState = usePlaybackState();
    const { position, duration } = useProgress(300);

    if (!activeTrack) return null;

    const isPlaying = playbackState.state === State.Playing;
    const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

    const handlePlaybackToggle = async () => {
        if (isPlaying) {
            await TrackPlayer.pause();
        } else {
            await TrackPlayer.play();
        }
    };

    const handlePressBar = () => {
        router.push({
            pathname: '/(root)/(screens)/Track-View',
            params: { musicId: activeTrack.id }
        });
    };

    const albumArt = activeTrack.artwork;
    const songTitle = activeTrack.title || 'Unknown Title';
    const artistName = activeTrack.artist || 'Unknown Artist';
    const imageSource = typeof albumArt === 'string' ? { uri: albumArt } : albumArt;

    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={handlePressBar}
            className="flex-row items-center justify-between w-full h-16 px-4 relative overflow-hidden"
            style={{
                backgroundColor: '#10301C',
            }}
        >
            <View className="flex-row items-center flex-1 mr-4">
                {albumArt ? (
                    <Image
                        source={imageSource}
                        className="w-10 h-10 rounded-md bg-[#1e1e1e]"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-10 h-10 rounded-md bg-[#1e1e1e]" />
                )}

                <View className="ml-3 flex-1">
                    <Text
                        numberOfLines={1}
                        className="text-white font-bold text-sm tracking-wide"
                    >
                        {songTitle}
                        <Text className="text-[#a7a7a7] font-normal text-xs">  •  {artistName}</Text>
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center justify-end">
                <TouchableOpacity
                    onPress={handlePlaybackToggle}
                    hitSlop={12}
                    className="p-2"
                >
                    {isPlaying ? (
                        <Pause size={22} color="white" fill="white" />
                    ) : (
                        <Play size={22} color="white" fill="white" />
                    )}
                </TouchableOpacity>
            </View>

            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2.5,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
            >
                <View
                    style={{
                        width: `${Math.min(Math.max(progressPercent, 0), 100)}%`,
                        height: '100%',
                        backgroundColor: '#1DB954'
                    }}
                />
            </View>
        </TouchableOpacity>
    );
};
