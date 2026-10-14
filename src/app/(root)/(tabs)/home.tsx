import { View, Text, KeyboardAvoidingView, Platform, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useNavigation } from 'expo-router'
import { usePublicArtists } from '@/hooks/useArtist';
import { useCurrentUser } from '@/hooks/use-auth';
import { useMusicDetailforhome, useRecentSongPlaying } from '@/hooks/use-music';
import { RefreshControl } from 'react-native';

export default function Home() {
    const { data: artistsList = [], refetch: refetchartist, isRefetching: artistrefetching } = usePublicArtists();
    const { data: Musicdetailforhome = [], refetch: refetchMusic, isRefetching: musicRefching } = useMusicDetailforhome()
    const { data: recentSongs = [], refetch: refetchrecentsongplaying, isLoading: recentloading } = useRecentSongPlaying()
    const { data: currentUser } = useCurrentUser();
    
    const userName = currentUser?.name?.trim() || 'User';
    const userInitial = userName.charAt(0).toUpperCase();

    const onRefresh = () => {
        refetchMusic(),
        refetchartist(),
        refetchrecentsongplaying()
    }
    
    const refreshing = artistrefetching || musicRefching || recentloading
    const navigation = useNavigation()
    
    const openProfileDrawer = () => {
        navigation.getParent()?.dispatch({ type: 'OPEN_DRAWER' })
    }

    const renderPlaylistItem = ({ item }: any) => (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: '/(root)/(screens)/Track-View',
                params: { musicId: item._id }
            })}
            className="items-center mr-4 w-[110px]"
        >
            <Image
                source={{ uri: item.coverPhotoUrl }}
                className="w-full max-w-[105px] h-[105px] bg-neutral-800 rounded-md"
                resizeMode="cover"
            />
            <Text
                numberOfLines={1}
                className="text-neutral-400 font-medium text-[11.5px] leading-[17px] mt-2 text-center w-full"
            >
                {item.musicTitle}
            </Text>
        </TouchableOpacity>
    );

    const renderMusic = ({ item }: any) => {
        const imageUrl = item.coverPhoto?.url
        const targetId = item._id

        return (
            <TouchableOpacity
                onPress={() => router.push({
                    pathname: "/(root)/(screens)/Track-View",
                    params: { musicId: targetId }
                 })}
                className="mr-4 w-[140px]">
                <Image
                    source={{ uri: imageUrl }}
                    className="w-full max-w-[154px] h-[154px] bg-neutral-800 rounded-none"
                    resizeMode="cover"
                />
                <Text
                    numberOfLines={2}
                    className="text-neutral-400 text-xs font-semibold mt-2 w-full"
                >
                    {item.musicTitle}
                </Text>
            </TouchableOpacity>
        )
    }

    const renderArtists = ({ item }: any) => {
        const imageUrl = item.profileImage?.url
        const targetId = item._id

        return (
            <TouchableOpacity
                onPress={() => router.push({
                    pathname: '/(root)/(screens)/Artist-detail',
                    params: { artistId: targetId }
                })}
                className="items-center w-[120px]"
            >
                <Image
                    source={{ uri: imageUrl }}
                    className="w-[115px] h-[115px] rounded-full bg-neutral-800"
                    resizeMode="cover"
                />
                <Text
                    numberOfLines={1}
                    className="text-neutral-400 font-medium text-[13.5px] leading-[17px] mt-2 text-center w-full"
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 w-full"
            >
                <View className="flex-1 relative">
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    >
                        <View className='w-10 h-10 m-3 rounded-full bg-green-600 flex items-center justify-center overflow-hidden'>
                            <TouchableOpacity onPress={openProfileDrawer} className="h-full w-full items-center justify-center">
                                <Text className='text-white font-extrabold text-[20px] text-center'>
                                    {userInitial}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {recentSongs && recentSongs.length > 0 && (
                            <>
                                {/* Header */}
                                <View className="flex-row justify-between ml-1 items-center relative p-4">
                                    <Text className="font-[700] text-[19px] text-white leading-[28px] ">
                                        Recently played
                                    </Text>
                                </View>

                                {/* Recently Played List */}
                                <View className="w-full max-w-[530px] px-4 mt-2">
                                    <FlatList
                                        data={recentSongs}
                                        renderItem={renderPlaylistItem}
                                        keyExtractor={(item) => item._id}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                    />
                                </View>
                            </>
                        )}

                        {/* Editor Pick Section */}
                        <View className="w-full max-w-[550px] px-4 mt-8 mb-6">
                            <Text className="font-[700] text-[19px] ml-1 text-white leading-[28px] mb-4">
                                Top Songs
                            </Text>
                            <FlatList
                                data={Musicdetailforhome}
                                renderItem={renderMusic}
                                keyExtractor={(item) => item._id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>

                        {/* Popular Artists Section */}
                        <View className='w-full max-w-[530px] px-4 mt-2 mb-[80px]'>
                            <Text className="font-[700] text-[19px] mb-4 ml-1 text-white leading-[28px] ">
                                Popular Artists
                            </Text>
                            <FlatList
                                data={artistsList}
                                renderItem={renderArtists}
                                keyExtractor={(item) => item._id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
