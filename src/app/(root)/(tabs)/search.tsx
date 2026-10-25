import { View, Text, KeyboardAvoidingView, Platform, TextInput, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import { TopGenre, Album, Camera } from "../../../assets/images"
import { Search } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'react-native'
import { router } from 'expo-router'

const TOP_GENRE = [
  { id: '1', name: 'Pop', image: TopGenre, color: 'bg-[#9854B2]' },
  { id: '2', name: 'Indie', image: Album, color: 'bg-[#678026]' },
];

const BROWSE_ALL = [
  { id: '1', name: '2021 Wrapped', image: TopGenre, color: 'bg-[#ABBB6D]' },
  { id: '2', name: 'Podcasts', image: Album, color: 'bg-[#223160]' },
  { id: '3', name: 'Made for you', image: Album, color: 'bg-[#75A768]' },
  { id: '4', name: 'Charts', image: Album, color: 'bg-[#8768A7]' },
];

export default function SearchScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 w-full"
      >
        <ScrollView 
          className="flex-1 px-4" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header Section */}
          <View className="flex-row justify-between items-center pt-4 pb-5">
            <Text className="font-black text-[25px] text-white tracking-tight">
              Search
            </Text>

          </View>

          <Pressable 
            onPress={() => router.push('/(root)/(screens)/search-bar')} 
            className="flex-row w-full items-center bg-white rounded-md px-3.5 py-3 mb-6 shadow-sm"
          >
            <Search color="#121212" size={20} strokeWidth={2.5} className="mr-3" />
            <TextInput 
              placeholder="What do you want to listen to?" 
              placeholderTextColor="#535353" 
              className="flex-1 text-black text-[15px] font-bold"
              editable={false} 
              pointerEvents="none" 
            />
          </Pressable>

          {/* Top Genres Grid Container */}
          <Text className="text-white font-bold text-[18px] tracking-tight mb-4">Your top genres</Text>
          <View className="flex-row flex-wrap justify-between w-full">
            {TOP_GENRE.map((item) => (
              <View
                key={item.id}
                className={`w-[48.5%] h-24 ${item.color} rounded-md p-3.5 relative overflow-hidden mb-3.5`}
              >
                <Text className="text-white font-bold text-[16px] tracking-tight leading-5 w-[70%]">
                  {item.name}
                </Text>
                <Image
                  source={item.image}
                  className="absolute bottom-0 right-0 w-16 h-16 translate-x-2 translate-y-1 rotate-[25deg]"
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>

          {/* Browse All Grid Container */}
          <Text className="text-white font-bold text-[18px] tracking-tight mt-4 mb-4">Browse all</Text>
          <View className="flex-row flex-wrap justify-between w-full">
            {BROWSE_ALL.map((item) => (
              <View
                key={item.id}
                className={`w-[48.5%] h-24 ${item.color} rounded-md p-3.5 relative overflow-hidden mb-3.5`}
              >
                <Text className="text-white font-bold text-[16px] tracking-tight leading-5 w-[70%]">
                  {item.name}
                </Text>
                <Image
                  source={item.image}
                  className="absolute bottom-0 right-0 w-16 h-16 translate-x-2 translate-y-1 rotate-[25deg]"
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
