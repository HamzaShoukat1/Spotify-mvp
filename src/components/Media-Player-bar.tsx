import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Play, Pause, Bluetooth } from 'lucide-react-native';
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
            activeOpacity={0.9}
            onPress={handlePressBar}
            className="flex-row items-center justify-between bg-[#430E09] w-full h-14 px-3"
            style={{ position: 'relative', overflow: 'hidden' }}
        >
            <View className="flex-row items-center flex-1 ">
                {/* Album Cover */}
                {albumArt && (
                    <Image
                        source={imageSource}
                        className="w-10 h-10 rounded-md bg-amber-500"
                        resizeMode="cover"
                    />
                )}

                {/* Text Metadata */}
                <View className="ml-3 flex-1">
                    <Text
                        numberOfLines={1}
                        className="text-white font-semibold text-sm tracking-wide"
                    >
                        {songTitle} <Text className="text-gray-400 font-normal">• {artistName}</Text>
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center space-x-4">
                <TouchableOpacity onPress={handlePlaybackToggle} className="p-1">
                    {isPlaying ? (
                        <Pause size={24} color="white" fill="white" />
                    ) : (
                        <Play size={24} color="white" fill="white" />
                    )}
                </TouchableOpacity>
            </View>

            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }}
            >
                <View
                    style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        backgroundColor: '#4ade80'
                    }}
                />
            </View>
        </TouchableOpacity>
    );
};
