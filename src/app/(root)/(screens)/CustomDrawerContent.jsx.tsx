import { router } from 'expo-router'
import { Plus, BarChart2, Clock, Megaphone, Settings, MessageSquare, Edit } from 'lucide-react-native'
import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SpotifyProfileMenu() {
  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 w-full"
      >
        <ScrollView className="flex-1">
          {/* Profile Header Section */}
          <TouchableOpacity className="flex-row items-center px-5 py-4 border-b border-[#282828]">
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
              <Plus color="#FFFFFF" size={24} strokeWidth={2} />
              <Text className="text-white text-base font-semibold ml-4">Add account</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-4">
              <BarChart2 color="#FFFFFF" size={24} strokeWidth={2} className="rotate-90" />
              <Text className="text-white text-base font-semibold ml-4">Listening stats</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-4">
              <Clock color="#FFFFFF" size={24} strokeWidth={2} />
              <Text className="text-white text-base font-semibold ml-4">Recents</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-4">
              <Megaphone color="#FFFFFF" size={24} strokeWidth={2} />
              <Text className="text-white text-base font-semibold ml-4">Your Updates</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-4" onPress={()=> router.push("/(root)/(screens)/Setting-And-Privacy")}>
              <Settings color="#FFFFFF" size={24} strokeWidth={2} />
              <Text className="text-white text-base font-semibold ml-4">Settings and privacy</Text>
            </TouchableOpacity>
          </View>

          {/* <View className="flex-row px-5 py-6 border-b border-[#282828]">
            <View className="items-center mr-6">
              <TouchableOpacity className="w-14 h-14 rounded-full bg-[#154726] border border-[#1DB954] items-center justify-center relative">
                <Text className="text-[#1DB954] text-xl font-bold">H</Text>
              </TouchableOpacity>
              <Text className="text-white text-xs mt-2 font-medium">Activity</Text>
              <Text className="text-[#A7A7A7] text-[10px] mt-0.5">Turn on</Text>
            </View>

            <View className="items-center">
              <TouchableOpacity className="w-14 h-14 rounded-full bg-[#282828] items-center justify-center">
                <Plus color="#FFFFFF" size={20} />
              </TouchableOpacity>
              <Text className="text-white text-xs mt-2 font-medium">Invite</Text>
              <Text className="text-[#A7A7A7] text-[10px] mt-0.5">friends</Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center px-5 pt-6 pb-2">
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-white text-xl font-bold mr-1">Messages</Text>
              <Text className="text-white text-xl font-bold">{'>'}</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Edit color="#A7A7A7" size={22} />
            </TouchableOpacity>
          </View> */}

          {/* <View className="px-5 mt-2">
            <Text className="text-[#A7A7A7] text-sm leading-5 pr-8">
              Share what you love with friends, directly on Spotify.
            </Text>

            <TouchableOpacity className="flex-row items-center mt-6 py-2">
              <View className="w-6 h-6 border-2 border-[#A7A7A7] rounded justify-center items-center mr-3">
                <Edit color="#A7A7A7" size={14} />
              </View>
              <Text className="text-white text-base font-semibold">New message</Text>
            </TouchableOpacity>
          </View> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
