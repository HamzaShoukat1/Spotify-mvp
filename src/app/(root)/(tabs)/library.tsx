import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plus, ArrowUpDown, LayoutGrid, Heart, Bell, Pin } from "lucide-react-native"

const PLACEHOLDER_IMAGE1 = 'https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const LIBRARY_ITEMS = [
  {
    id: '1',
    title: 'Liked Songs',
    subtitle: 'Playlist • 58 songs',
    type: 'playlist',
    isPinned: true,
    customIcon: 'heart',
  },
  {
    id: '2',
    title: 'New Episodes',
    subtitle: 'Updated 2 days ago',
    type: 'playlist',
    isPinned: true,
    customIcon: 'bell',
  },
  {
    id: '3',
    title: 'Lolo Zouaï',
    subtitle: 'Artist',
    type: 'artist',
    isPinned: false,
  },
  {
    id: '4',
    title: 'Lana Del Rey',
    subtitle: 'Artist',
    type: 'artist',
    isPinned: false,
  },
  {
    id: '5',
    title: 'Front Left',
    subtitle: 'Playlist • Spotify',
    type: 'playlist',
    isPinned: false,
  },
  {
    id: '6',
    title: 'Marvin Gaye',
    subtitle: 'Artist',
    type: 'artist',
    isPinned: false,
  },
  {
    id: '7',
    title: 'Les',
    subtitle: 'Song • Childish Gambino',
    type: 'song',
    isPinned: false,
    isExplicit: true,
  },
];

const FILTER_TAGS = ['Playlists', 'Artists', 'Albums', 'Podcasts & shows'];

export default function Library() {
  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 w-full"
      >
        {/* Header Section */}
        <View className="flex-row items-center justify-between px-4 mt-10">
          <View className="flex-row items-center space-x-3">
            <Image 
              source={{ uri: PLACEHOLDER_IMAGE1 }} 
              className="w-9 h-9 rounded-full bg-neutral-700" 
            />
            <Text className="text-white text-2xl font-bold tracking-tight">Your Library</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} className="p-1">
            <Plus color="#ffffff" size={28} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View className="my-6">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {FILTER_TAGS.map((tag, index) => (
              <TouchableOpacity 
                key={index} 
                className="bg-[#121212] px-4  rounded-[45px] py-2  border-[0.6px] border-neutral-700"
              >
                <Text className="text-white text-xs font-semibold">{tag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="flex-row items-center justify-between px-4 ">
          <TouchableOpacity className="flex-row items-center space-x-2">
            <ArrowUpDown color="#FFFFFF" size={12} />
            <Text className="text-[#FFFFFF] text-xs font-[600] ">Recently played</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <LayoutGrid color="#FBFBFB" size={18} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 3 }}
        >
          {LIBRARY_ITEMS.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              className="flex-row items-center mt-6"
              activeOpacity={0.6}
            >
              <View className="mr-3">
                {item.customIcon === 'heart' ? (
                  <View className="w-16 h-16 rounded bg-gradient-to-br from-[#450ffd] to-[#adc0c7] items-center justify-center bg-[#3c2bc1]">
                    <Heart color="#ffffff" size={28} fill="#ffffff" />
                  </View>
                ) : item.customIcon === 'bell' ? (
                  <View className="w-16 h-16 rounded bg-[#281a42] items-center justify-center">
                    <View className="bg-[#1ed760] p-2 rounded-full">
                      <Bell color="#121212" size={20} fill="#121212" />
                    </View>
                  </View>
                ) : (
                  <Image
                    source={{ uri: PLACEHOLDER_IMAGE1 }}
                    className={`w-16 h-16 bg-neutral-800 ${item.type === 'artist' ? 'rounded-full' : 'rounded'}`}
                  />
                )}
              </View>

              <View className="flex-1 justify-center">
                <Text className="text-white text-[15px]  font-semibold">
                  {item.title}
                </Text>
                
                <View className="flex-row items-center mt-1 space-x-1">
                  {item.isPinned && (
                    <View className="mr-1 transform rotate-45">
                      <Pin color="#1ed760" size={12} fill="#1ed760" />
                    </View>
                  )}
                  
                  {item.isExplicit && (
                    <View className="bg-[#b3b3b3] rounded px-1 mr-1 justify-center items-center h-4 w-4">
                      <Text className="text-[#121212] text-[9px] font-bold">E</Text>
                    </View>
                  )}

                  <Text className="text-[#a7a7a7] text-xs">
                    {item.subtitle}
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
