import { View, Text, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native'
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronDown, MoreHorizontal, Heart, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Share2, ListMusic, Maximize2 } from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router';
import { useGetMusicTrack } from '@/hooks/use-music';
import { useEffect } from 'react';
import TrackPlayer, { usePlaybackState, useProgress, State, useActiveTrack } from 'react-native-track-player';
import { formatTime, setupPlayer } from '@/services/player';
import { MediaPlayerBar } from '@/components/Media-Player-bar';

export default function TrackView() {
    const { musicId } = useLocalSearchParams<{ musicId: string }>();
    const { data: musicData, isLoading, isError, } = useGetMusicTrack(musicId);
    const playbackState = usePlaybackState();
    const { duration, position } = useProgress(250);
    const isPlaying = playbackState.state === State.Playing

    const MusicCover = musicData?.coverPhoto?.url
    const MusicTitle = musicData?.musicTitle
    const ArtistName = musicData?.primaryArtistName
    const music = musicData?.music.url

    useEffect(() => {
        async function setupTrack() {
            if (!music) return;
            try {
                await setupPlayer();
                await TrackPlayer.reset();

                await TrackPlayer.add({
                    id: musicId || 'track',
                    url: music,
                    title: MusicTitle,
                    artist: ArtistName,
                    artwork: MusicCover,
                });

                await TrackPlayer.play();
            } catch (error) {
                console.error("Error initializing track playback:", error);
            }
        }

        setupTrack();

    }, [music, musicId]);

    const togglePlayback = async () => {
        try {
            if (isPlaying) {
                await TrackPlayer.pause();
            } else {
                await TrackPlayer.play();
            }
        } catch (error) {
            console.error("Error toggling playback:", error);
        }
    };

 
    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#000000',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator
                    size="large"
                    color="#1DB954"
                />
            </View>
        );
    }

    if (isError || !musicData) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-black px-6">
                <Text className="text-center text-white">
                    Song Data could not be loaded.
                </Text>

                <Pressable
                    onPress={() => router.back()}
                    className="mt-5 rounded-full bg-white px-5 py-3"
                >
                    <Text className="font-semibold text-black">
                        Go back
                    </Text>
                </Pressable>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView className="flex-1 bg-[#430E09] ">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 w-full px-6 justify-between pb-4"
            >
                {/* Header Section */}
                <View className="flex-row justify-between items-center mt-2 ">
                    <TouchableOpacity onPress={() => router.back()}>
                        <ChevronDown color="#ffffff" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MoreHorizontal color="#ffffff" size={24} />
                    </TouchableOpacity>
                </View>

                {/* Album Art Container */}
                <View className=" flex items-center justify-center my-6 h-[320px] w-full">
                    {MusicCover && (
                        <Image
                            source={{ uri: MusicCover }}
                            className="rounded-sm w-full max-w-[400px] h-full"
                            resizeMode="contain"
                        />
                    )}
                </View>

                {/* Track Info Section */}
                <View className="w-full mb-4">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-1 pr-4">
                            <Text numberOfLines={1} className="text-white font-bold text-xl tracking-wide">
                                {MusicTitle}
                            </Text>
                            <Text numberOfLines={1} className="text-[#c7a4a1] text-sm mt-1">
                                {ArtistName}
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Heart color="#ffffff" size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Bar  */}
                    <View className="w-full  max-w-[402px] mt-4">
                        <Slider
                            minimumValue={0}
                            maximumValue={Math.max(duration, 1)}
                            value={Math.min(position, duration || 0)}
                            minimumTrackTintColor="#4ade80"
                            maximumTrackTintColor="#ffffff"
                            thumbTintColor="#ffffff"
                            onSlidingComplete={(position) => TrackPlayer.seekTo(position)}
                        />
                        <View className="flex-row justify-between items-center mt-2">
                            <Text className="text-[#c7a4a1] text-xs">{formatTime(position)}</Text>
                            <Text className="text-[#c7a4a1] text-xs">-{formatTime(Math.max(duration - position, 0))}</Text>
                        </View>
                    </View>
                </View>

                {/* Media  Section */}
                <View className="w-full mb-6">
                    <View className="flex-row justify-between items-center px-2">
                        <TouchableOpacity>
                            <Shuffle color="#c7a4a1" size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <SkipBack color="#ffffff" size={28} fill="#ffffff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={togglePlayback}
                            className="w-16 h-16 bg-white rounded-full items-center justify-center"
                        >
                            {isPlaying ? (
                                <Pause color="#86251b" size={28} fill="#86251b" />
                            ) : (
                                <Play color="#86251b" size={28} fill="#86251b" className="ml-1" />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <SkipForward color="#ffffff" size={28} fill="#ffffff" />
                        </TouchableOpacity>
                        <TouchableOpacity className="relative">
                            <Repeat color="#1ed760" size={20} />
                            <View className="w-1 h-1 bg-[#1ed760] rounded-full absolute -bottom-1.5 self-center" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-between items-center mt-6 px-1">
                        <View className="flex-row items-center">
                            <View className="w-2 h-3 bg-[#1ed760] transform rotate-12 mr-1 rounded-xs" />
                            <Text className="text-[#1ed760] text-[10px] font-bold tracking-wider uppercase">
                                BEATSPILL+
                            </Text>
                        </View>
                        <View className="flex-row items-center space-x-6">
                            <TouchableOpacity className="mr-5">
                                <Share2 color="#c7a4a1" size={18} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <ListMusic color="#c7a4a1" size={18} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View className="w-full bg-[#D8672A] rounded-xl p-4 flex-row justify-between items-center mb-1">
                    <Text className="text-white font-bold text-base">Lyrics</Text>
                    <TouchableOpacity onPress={() => router.push("/(root)/(screens)/Track-detail")} className="bg-[#a13b1d] flex-row items-center px-3 py-1.5 rounded-full space-x-1">
                        <Text className="text-white text-[10px] font-bold tracking-wider uppercase mr-1">MORE</Text>
                        <Maximize2 color="#ffffff" size={10} />
                    </TouchableOpacity>
                
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
