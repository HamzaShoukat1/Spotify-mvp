// import { BecameArtistModel } from '@/models/BecameArtistModel'
import { router } from 'expo-router'
import { Plus, BarChart2, Clock, Megaphone, Settings, Music } from 'lucide-react-native'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
export default function SpotifyProfileMenu() {

  return (
    <>
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1, backgroundColor: '#121212' }} 
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity className="flex-row items-center px-5 pt-12 py-4 border-b border-[#282828]">
        <View className="w-14 h-14 rounded-full bg-[#1DB954] items-center justify-center mr-4">
          <Text className="text-black text-2xl font-bold">H</Text>
        </View>
        <View>
          <Text className="text-white text-xl font-bold">Hamzaali</Text>
          <Text className="text-[#A7A7A7] text-sm mt-0.5">View profile</Text>
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

        <TouchableOpacity className="flex-row items-center py-4">
          <Clock color="#FFFFFF" size={28} strokeWidth={2} />
          <Text className="text-white text-[17px] ml-4">Recents</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center py-4">
          <Megaphone color="#FFFFFF" size={28} strokeWidth={2} />
          <Text className="text-white text-[17px] ml-4">Your Updates</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center py-4" 
          onPress={() => router.push('/(root)/(screens)/Setting-And-Privacy')}
        >
          <Settings color="#FFFFFF" size={28} strokeWidth={2} />
          <Text className="text-white text-[17px] ml-4">Settings and privacy</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center py-4" 
          onPress={() => router.push('/(root)/(artist)/artist-profile')}
        >
          <Music color="#FFFFFF" size={28} strokeWidth={2} />
          <Text className="text-white text-[17px] ml-4">Become An Artist Now</Text>
        </TouchableOpacity>
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
