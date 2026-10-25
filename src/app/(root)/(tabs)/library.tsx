import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Heart } from "lucide-react-native"
import { useRouter } from 'expo-router';
import { useLikedSongs } from '@/hooks/use-like';
import { useCurrentUser } from '@/hooks/use-auth';

const LIBRARY_ITEMS = [
  {
    id: '1',
    title: 'Liked Songs',
    customIcon: 'heart',
    route: "UserlikedArtistdetails"
  }
];

const FILTER_TAGS = ["Artists"];

export default function Library() {
  const { data: UserDetails, isLoading: isUserLoading, refetch: refetchUser, isRefetching: isUserRefetching } = useCurrentUser()
  const router = useRouter()
  const userName = UserDetails?.name?.trim() || 'U'
  const userInitial = userName.charAt(0).toUpperCase()
  const { data: likedSongs, isLoading: isSongsLoading, refetch: refetchSongs, isRefetching: isSongsRefetching } = useLikedSongs();
  const likedSongsCount = likedSongs?.length ?? 0;

  const isLoading = isUserLoading || isSongsLoading;

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 w-full"
      >
        <View className="flex-row items-center justify-between px-4 pt-4">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/(root)/(screens)/Edit-Profile')}
              className="w-9 h-9 items-center justify-center rounded-full bg-[#1DB954]"
            >
              <Text className="text-black text-[15px] font-bold uppercase">
                {userInitial}
              </Text>
            </TouchableOpacity>

            <Text className="text-white text-2xl font-bold tracking-tight">
              Your Library
            </Text>
          </View>
        </View>

        <View className="mt-5 mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {FILTER_TAGS.map((tag, index) => (
              <TouchableOpacity
                key={index}
                className="bg-[#2a2a2a] px-4 py-2 rounded-full"
                activeOpacity={0.8}
              >
                <Text className="text-white text-[13px] font-medium">{tag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={isUserRefetching || isSongsRefetching}
              onRefresh={() => {
                refetchUser();
                refetchSongs();
              }}
              tintColor="#1DB954"
              colors={["#1DB954"]}
              progressBackgroundColor="#282828"
            />
          }
        >
          {LIBRARY_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center py-2"
              activeOpacity={0.6}
              onPress={() => {
                if (item.route) {
                  router.push(item.route as any);
                }
              }}
            >
              <View className="mr-4">
                {item.customIcon === 'heart' ? (
                  <View className="w-[64px] h-[64px] rounded bg-gradient-to-br from-[#450e74] to-[#5b3bb4] items-center justify-center bg-[#3c2bc1]">
                    <Heart color="#ffffff" size={24} fill="#ffffff" />
                  </View>
                ) : (
                  <View className="w-[64px] h-[64px] bg-[#282828] items-center justify-center rounded">
                    <Heart color="#a7a7a7" size={22} />
                  </View>
                )}
              </View>

              <View className="flex-1 justify-center">
                <Text className="text-white text-[16px] font-semibold tracking-wide">
                  {item.title}
                </Text>

                <View className="flex-row items-center mt-0.5">
                  <Text className="text-[#a7a7a7] text-[13px] font-medium">
                    {item.id === '1'
                      ? `${isLoading ? '—' : `${likedSongsCount} ${likedSongsCount === 1 ? 'song' : 'songs'}`}`
                      : ""}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
