import { View, Text, KeyboardAvoidingView, Platform, TextInput, ScrollView, Pressable } from 'react-native'
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

export default function search() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 w-full"
      >
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View className="flex-row justify-between mt-4 items-center relative py-4">
            <Text className="font-bold text-[24px] text-white leading-[28px]">
              Search
            </Text>
            <Image source={Camera} className="w-[29px] h-[29px]" resizeMode="contain" />
          </View>

          {/* Search Input Bar */}
            <Pressable 
            onPress={() => router.push('/(root)/search-bar')} 
            className="flex-row w-full items-center bg-white rounded-md px-3 py-1 mb-6"
          >
            <Search color="#777777" size={21} className="mr-2" />
            <TextInput 
              placeholder="Artists, songs, or podcasts" 
              placeholderTextColor="#757575" 
              className="flex-1 text-black text-base  "
              editable={false} 
              pointerEvents="none" 
            />
          </Pressable>

          {/* Top Genres Grid */}
          <Text className="text-white font-bold text-lg mb-3">Your top genres</Text>
          <View className="flex-row flex-wrap justify-between mb-4 w-full max-w-[428px]">
            {TOP_GENRE.map((item) => (
              <View
                key={item.id}
                className={`w-full max-w-[160px] h-24   ${item.color} rounded-md p-3 relative overflow-hidden mb-4`}
              >
                <Text className="text-white font-bold text-base ">{item.name}</Text>
                <Image
                  source={item.image}
                  className=" absolute -bottom-2  w-full max-w-[66.97px] -right-2 rotate-[6deg]"
                  resizeMode="contain"
                />
              </View>
            ))}
          </View>

          {/* Browse All Grid */}
          <Text className="text-white font-bold text-lg mb-3">Browse all</Text>
          <View className="flex-row flex-wrap justify-between  pb-10 w-full max-w-[428px]">
            {BROWSE_ALL.map((item) => (
              <View
                key={item.id}
                className={`w-full max-w-[160px] h-24 ${item.color} rounded-md p-3 relative overflow-hidden mb-4`}
              >
                <Text className="text-white font-bold text-base ">{item.name}</Text>
                <Image
                  source={item.image}
                  className="w-full max-w-[66.97px] absolute -bottom-2 -right-1 rotate-[6deg]"
                  resizeMode="contain"
                />
              </View>
            ))}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
