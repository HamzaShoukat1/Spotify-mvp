import {
    ActivityIndicator,
    Image,
    Pressable,
    FlatList,
    Text,
    View,
} from 'react-native';

import { router } from 'expo-router';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LikeButton } from '@/components/LikeButton';
import { useLikedSongs } from '@/hooks/use-like';

export default function ArtistDetail() {
    const { data: likedSongs = [], isLoading, isError } = useLikedSongs();

    const renderLikedSong = ({ item: track }: any) => {
        const music = track?.music;
        const coverPhoto = music?.coverPhoto?.url;

        return (
            <Pressable
                className="mx-5 mb-3 flex-row items-center"
                onPress={() => music?._id && router.push({
                    pathname: "/Track-View",
                    params: { musicId: music._id },
                })}
            >
                {coverPhoto ? (
                    <Image
                        source={{ uri: coverPhoto }}
                        className="h-16 w-16 rounded-sm"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="h-16 w-16 items-center justify-center rounded-sm bg-[#282828]" />
                )}

                <View className="ml-4 flex-1 pr-3">
                    <Text
                        numberOfLines={1}
                        className="text-base font-semibold text-white"
                    >
                        {music?.musicTitle || 'Unknown title'}
                    </Text>

                    <Text
                        numberOfLines={1}
                        className="mt-1 text-sm text-[#A7A7A7]"
                    >
                        {music?.primaryArtistName || 'Unknown artist'}
                    </Text>
                </View>

                {music?._id && <LikeButton musicId={music._id} size={21} />}

                <MoreVertical size={20} color="#A7A7A7" />
            </Pressable>
        );
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
                <ActivityIndicator size="large" color="#1DB954" />
            </View>
        );
    }

    if (isError) {
        console.log('Error loading liked post details');

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#121212',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text className="text-white">Something went wrong...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#121212' }}>
            <FlatList
                data={likedSongs}
                keyExtractor={(track) => track?._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListHeaderComponent={
                    <View className="px-5 pb-6">
                        <View className="flex-row items-center justify-between pb-8 pt-4">
                            <Pressable onPress={() => router.back()} hitSlop={10}>
                                <ArrowLeft size={28} color="#FFFFFF" />
                            </Pressable>

                            <MoreVertical size={22} color="#A7A7A7" />
                        </View>

                        <Text className="text-3xl font-bold text-white">
                            Liked Songs
                        </Text>

                        <Text className="mt-2 text-sm text-[#A7A7A7]">
                            {likedSongs.length}{' '}
                            {likedSongs.length === 1 ? 'song' : 'songs'}
                        </Text>
                    </View>
                }
                renderItem={renderLikedSong}
                ListEmptyComponent={
                    <View className="items-center px-8 pt-16">
                        <Text className="text-center text-base font-semibold text-white">
                            Songs you like appear here
                        </Text>

                        <Text className="mt-2 text-center text-sm text-[#A7A7A7]">
                            Tap the heart on any track to build your collection.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
