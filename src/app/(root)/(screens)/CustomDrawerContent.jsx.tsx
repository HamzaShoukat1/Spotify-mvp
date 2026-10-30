// import { BecameArtistModel } from '@/models/BecameArtistModel'
import { Plus, BarChart2, Clock, Settings, Music, Palette } from 'lucide-react-native'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useCurrentUser } from '@/hooks/use-auth'
import {router} from "expo-router"
// import { SubscriptionBadge } from '@/components/SubscriptionBadge'
export default function SpotifyProfileMenu() {

  const { data: UserDetails, isLoading } = useCurrentUser()


  // const router = useRouter()
  const userName = UserDetails?.name?.trim() || 'User'
  const userInitial = userName.charAt(0).toUpperCase()
  // const userImage = UserDetails?.profileImage?.url || UserDetails?.avatar?.url || UserDetails?.avatar

  return (
    <>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: '#121212' }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.push('/(root)/(screens)/Edit-Profile')}
          className="flex-row items-center px-5 pt-12 py-4 border-b border-[#282828]">
          <View className="w-14 h-14 rounded-full bg-[#1DB954] items-center justify-center mr-4 overflow-hidden">
            {/* {userInitial ? (
              <Image source={{ uri: userInitial }} className="h-full w-full" resizeMode="cover" />
            ) : ( */}
            <Text className="text-black text-2xl font-bold">{userInitial}</Text>
            {/* )} */}
          </View>
          <View>
            <Text className="text-white text-xl font-bold">{userName}</Text>
            <View className="mt-2">
              {/* <SubscriptionBadge /> */}
            </View>
            <TouchableOpacity
              className="text-[#A7A7A7] text-sm mt-0.5"
              onPress={() => router.push('/(root)/(screens)/Edit-Profile')}
            >
              <Text className="text-[#A7A7A7]">View profile</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View className="mt-2 px-5">
          <TouchableOpacity className="flex-row items-center py-4">
            <Plus color="#FFFFFF" size={28} strokeWidth={2} />
            <Text className="text-white text-[17px] ml-4">Add account</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-4">
            <BarChart2 color="#FFFFFF" size={28} strokeWidth={2} />
            <Text className="text-white text-[17px] ml-4">Listening stats</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity className="flex-row items-center py-4">
            <Clock color="#FFFFFF" size={28} strokeWidth={2} />
            <Text className="text-white text-[17px] ml-4">Recents</Text>
          </TouchableOpacity> */}

          {!isLoading && UserDetails?.role === 'artist' && (
            <TouchableOpacity onPress={() => router.push("/(root)/(screens)/Artist-hub")} className="flex-row items-center py-4">
              <Palette color="#FFFFFF" size={28} strokeWidth={2} />
              <Text className="text-white text-[17px] ml-4">Artist hub</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="flex-row items-center py-4"
            onPress={() => router.push('/(root)/(screens)/Setting-And-Privacy')}
          >
            <Settings color="#FFFFFF" size={28} strokeWidth={2} />
            <Text className="text-white text-[17px] ml-4">Settings and privacy</Text>
          </TouchableOpacity>

          {!isLoading && UserDetails?.role === 'user' && (
            <TouchableOpacity
              className="flex-row items-center py-4"
              onPress={() => router.push('/(root)/(artist)/artist-profile')}
            >
              <Music color="#FFFFFF" size={28} strokeWidth={2} />
              <Text className="text-white text-[17px] ml-4">Become An Artist Now</Text>
            </TouchableOpacity>
          )}
          {/* 
        <TouchableOpacity
          className="flex-row items-center py-4"
          onPress={() => router.push('/(root)/(music)/music-audio')}
        >
          <Music color="#FFFFFF" size={28} strokeWidth={2} />
          <Text className="text-white text-[17px] ml-4">Add Music</Text>
        </TouchableOpacity> */}
        </View>

      </ScrollView>

    </>
  )
}
