import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

import {
    ArrowLeft,
    MoreVertical,
} from 'lucide-react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useArtistDetailForPublic } from '@/hooks/useArtist';

export default function ArtistDetail() {
    const { artistId } = useLocalSearchParams<{ artistId: string }>();

    const {
        data: artist,
        isLoading,
        isError,
    } = useArtistDetailForPublic(artistId);

    const artistMusic = artist?.artistmusic ?? [];

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1DB954" />
            </View>
        );
    }

    if (isError || !artist) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-black px-6">
                <Text className="text-center text-white">Artist profile could not be loaded.</Text>
                <Pressable onPress={() => router.back()} className="mt-5 rounded-full bg-white px-5 py-3">
                    <Text className="font-semibold text-black">Go back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header Banner Image */}
                <View className="relative h-[370px] w-full">
                    {artist.profileImage?.url && (
                        <Image source={{ uri: artist.profileImage.url }} className="absolute inset-0 h-full w-full" resizeMode="cover" />
                    )}
                    <View className="absolute inset-0 bg-black/20" />
                    <View className="absolute left-5 top-5">
                        <Pressable onPress={() => router.back()} className="h-12 w-12 items-center justify-center rounded-full bg-black/60">
                            <ArrowLeft color="#FFFFFF" size={28} strokeWidth={2} />
                        </Pressable>
                    </View>
                    <View className="absolute bottom-7 left-6 right-6">
                        <Text className="text-5xl font-[900] text-white" numberOfLines={2}>
                            {artist.name}
                        </Text>
                    </View>
                </View>

                {/* Sub-Header Actions */}
                <View className="px-6">
                    {artist.artistType ? (
                        <Text className="mt-5 text-base font-medium text-neutral-300">{artist.artistType}</Text>
                    ) : null}
                    <Text className="mt-1 text-sm text-neutral-500">Artist</Text>

                    <View className="mt-6 flex-row items-center">
                        <Pressable className="rounded-full border border-neutral-500 px-7 py-3">
                            <Text className="font-bold text-white">Follow</Text>
                        </Pressable>
                        <Pressable className="ml-4 h-12 w-12 items-center justify-center">
                            <MoreVertical color="#FFFFFF" size={27} />
                        </Pressable>
                    </View>
                </View>

                {/* EXACT MATCH: Popular Tracks Section */}
                <View className="mt-8 px-6">
                    <Text className="text-2xl font-bold text-white mb-4">Popular</Text>
                    {artistMusic.length > 0 ? (
                        artistMusic.map((track, index) => (
                            <Pressable
                                key={track._id}
                                onPress={() => router.push({
                                    pathname: '/(root)/(screens)/Track-View',
                                    params: { musicId: track._id },
                                })}
                                className="flex-row items-center justify-between py-3"
                            >
                                <View className="flex-row items-center flex-1">
                                    <Text className="text-neutral-400 font-semibold text-base w-7 text-left">{index + 1}</Text>
                                    {track.coverPhoto?.url ? (
                                        <Image source={{ uri: track.coverPhoto.url }} className="h-14 w-14 rounded-md" resizeMode="cover" />
                                    ) : (
                                        <View className="h-14 w-14 rounded-md bg-neutral-800" />
                                    )}
                                    <View className="ml-4 flex-1 justify-center">
                                        <Text className="text-white font-semibold text-lg" numberOfLines={1}>
                                            {track.musicTitle}
                                        </Text>
                                        {/* <Text className="text-neutral-400 text-sm mt-1" numberOfLines={1}>
                                            1.22121.21
                                        </Text> */}
                                    </View>
                                </View>
                                <MoreVertical color="#A3A3A3" size={22} />
                            </Pressable>
                        ))
                    ) : (
                        <Text className="text-neutral-500 text-base">No tracks available.</Text>
                    )}
                </View>

                {/* About Profile Info */}
                <View className="px-6 mt-6">
                    <View className="border-t border-neutral-800 pt-7">
                        <Text className="text-2xl font-bold text-white">About</Text>
                        <Text className="mt-3 text-base leading-6 text-neutral-300">
                            {artist.bio || 'No bio available.'}
                        </Text>
                    </View>

                    <View className="mt-8">
                        <Text className="text-2xl font-bold text-white">Genres</Text>
                        {artist.genres ? (
                            <View className="mt-4 flex-row flex-wrap gap-2">
                                {artist.genres.split(',').map((genre: string) => (
                                    <View key={genre} className="rounded-full bg-neutral-800 px-4 py-2">
                                        <Text className="text-sm font-medium text-neutral-200">{genre.trim()}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text className="mt-3 text-base text-neutral-500">No genres listed.</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
