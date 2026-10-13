import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';

import { router } from 'expo-router';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLikesPostDetails } from '@/hooks/use-like';

export default function ArtistDetail() {
    const { data: userLikedPostdetails, isLoading, isError } = useLikesPostDetails();

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1DB954" />
            </View>
        );
    }

    if (isError) {
        console.log("Error loading liked post details");
        return (
            <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
                <Text className="text-white">Something went wrong...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#121212' }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Header Action Bar */}
                <View className="flex-row items-center justify-between px-5 pt-4 pb-4">
                    <Pressable onPress={() => router.back()}>
                        <ArrowLeft size={28} color="#FFFFFF" />
                    </Pressable>
                </View>

                {/* Songs Track List */}
                <View className="px-5">
                    {userLikedPostdetails && userLikedPostdetails.length > 0 ? (
                        userLikedPostdetails.map((track: any) => {
                            const coverpic = track?.coverPhoto?.url;
                            const songtitle = track?.musicTitle;
                            const artistname = track?.primaryArtistName;

                            return (
                                <View
                                    key={track._id}
                                    className="flex-row items-center justify-between py-2 mb-2"
                                >
                                    <View className="flex-row items-center flex-1 pr-4">
                                        {coverpic ? (
                                            <Image
                                                source={{ uri: coverpic }}
                                                className="w-14 h-14 rounded-sm"
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View className="w-14 h-14 bg-[#282828] rounded-sm items-center justify-center" />
                                        )}

                                        {/* Track Metadata */}
                                        <View className="ml-4 flex-1">
                                            <Text numberOfLines={1} className="text-[#1DB954] text-base font-medium mb-0.5">
                                                {songtitle || "Unknown Title"}
                                            </Text>
                                            <Text numberOfLines={1} className="text-gray-400 text-sm">
                                                {artistname || "Unknown Artist"}
                                            </Text>
                                        </View>
                                    </View>

                                    <Pressable className="p-1">
                                        <MoreVertical size={20} color="#A7A7A7" />
                                    </Pressable>
                                </View>
                            );
                        })
                    ) : (
                        <Text className="text-gray-400 text-center mt-10">No liked tracks found.</Text>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
