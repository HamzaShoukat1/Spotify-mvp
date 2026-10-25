import { View, Text, KeyboardAvoidingView, Platform, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useNavigation } from 'expo-router'
import { usePublicArtists } from '@/hooks/useArtist';
import { useCurrentUser } from '@/hooks/use-auth';
import { useMusicDetailforhome, useRecentSongPlaying } from '@/hooks/use-music';
import { RefreshControl } from 'react-native';
import {SubscriptionBadge} from '@/components/SubscriptionBadge';

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
       <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 w-full"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 110 }} 
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#1DB954"
              colors={["#1DB954"]}
              progressBackgroundColor="#282828"
            />
          }
        >
          <View className="flex-row items-center justify-between px-4 pt-3 pb-4">
            <TouchableOpacity 
              onPress={openProfileDrawer} 
              activeOpacity={0.7}
              className="w-9 h-9 rounded-full bg-[#1DB954] items-center justify-center shadow-md"
            >
              <Text className="text-black font-bold text-[15px] tracking-wider uppercase">
                {userInitial}
              </Text>
            </TouchableOpacity>
            
            <SubscriptionBadge />
          </View>

          {/* Section 1: Recently Played */}
          {recentSongs && recentSongs.length > 0 && (
            <View className="mt-2">
              <View className="px-4 pb-3">
                <Text className="font-bold text-[22px] text-white tracking-tight">
                  Recently played
                </Text>
              </View>

              {/* Enhanced Scroll Container: Snap alignments flush to screen edge */}
              <FlatList
                data={recentSongs}
                renderItem={renderPlaylistItem}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
              />
            </View>
          )}

          <View className="mt-8">
            <View className="px-4 pb-3">
              <Text className="font-bold text-[22px] text-white tracking-tight">
                Top Songs
              </Text>
            </View>
            
            <FlatList
              data={Musicdetailforhome}
              renderItem={renderMusic}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
            />
          </View>

          <View className="mt-8">
            <View className="px-4 pb-3">
              <Text className="font-bold text-[22px] text-white tracking-tight">
                Popular Artists
              </Text>
            </View>
            
            <FlatList
              data={artistsList}
              renderItem={renderArtists}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    );
}
