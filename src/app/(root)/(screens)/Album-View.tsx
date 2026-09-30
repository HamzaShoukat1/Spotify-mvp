import { View, Text, KeyboardAvoidingView, Platform, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { AlbumPic } from '../../../assets/images/index';
import { Pause, ChevronLeft, Heart, ArrowDownCircle, MoreHorizontal, Bluetooth } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
// import {LinearGradient} from "expo-linear-gradient"
export default function AlbumView() {
  const tracks = [
    { id: 1, title: 'Love Me Do - Mono / Remastered', artist: 'The Beatles', isPlaying: false },
    { id: 2, title: 'From Me to You - Mono / Remastered', artist: 'The Beatles', isPlaying: true },
    { id: 3, title: 'She Loves You - Mono / Remastered', artist: 'The Beatles', isPlaying: false },
    { id: 4, title: 'I Want To Hold Your Hand - Remastered 2015', artist: 'The Beatles', isPlaying: false },
  ];

  return (
    <View className='w-full h-full bg-[#86251b]'>

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 w-full">
          
          {/* ScrollView Wrapper Container */}
          <View className="flex-1 ">
            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
              <View className="flex-row items-center py-3">
                <TouchableOpacity onPress={()=> router.back()}>
                  <ChevronLeft color="#ffffff" size={28} />
                </TouchableOpacity>
              </View>
              <View className="items-center my-6">
                <Image source={AlbumPic} className="w-full max-w-[234px] rounded-sm shadow-2xl" style={{ resizeMode: 'contain' }} />
              </View>
              <View className='w-full max-w-[413px]'>

              <View className="mb-4">
                <Text className="text-white text-2xl font-bold tracking-tight">1 (Remastered)</Text>
                <View className="flex-row items-center mt-2">
                  <View className="w-5 h-5 bg-gray-600 rounded-full mr-2 items-center justify-center">
                    <Text className="text-[8px] text-white">B</Text>
                  </View>
                  <Text className="text-white font-semibold text-sm">The Beatles</Text>
                </View>
                <Text className="text-gray-400 text-xs mt-1">Album • 2000</Text>
              </View>
              {/* Media Management Action Bar */}
              <View className="flex-row items-center gap-3 justify-between mb-6">
                <View className="flex-row items-center gap-5">
                  <TouchableOpacity>
                    <Heart color="#b3b3b3" size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <ArrowDownCircle color="#000000" size={24} fill="#90EE90" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <MoreHorizontal color="#b3b3b3" size={24} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity className="w-14 h-14 bg-[#1db954] rounded-full items-center justify-center shadow-md">
                  <Pause color="#000000" size={24} fill="#000000" />
                </TouchableOpacity>
              </View>
              </View>

              {/* Track Listi */}
              <View className="pb-28">
                {tracks.map((track) => (
                  <View key={track.id} className="flex-row w-full max-w-[406px] items-center justify-between py-2">
                    <View className="flex-1 pr-4">
                      <Text className={`text-[13px] font-medium ${track.isPlaying ? 'text-[#1db954]' : 'text-white'}`} numberOfLines={1}>
                        {track.title}
                      </Text>
                      <View className="flex-row items-center gap-1.5 mt-0.5">
                        <ArrowDownCircle color="#000000" size={12} fill="#90EE90" />
                        <Text className="text-gray-400 text-[14px]" numberOfLines={1}>{track.artist}</Text>
                      </View>
                    </View>
                    <TouchableOpacity  onPress={()=> router.push("/(root)/(screens)/Album-Control")} >
                      <MoreHorizontal color="#b3b3b3" size={18} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

        <TouchableOpacity onPress={()=> router.push("/(root)/(screens)/Track-View")}>
              <View className=" w-full  max-w-[413px] bg-orange-950 mx-2  rounded-lg p-3 flex-row items-center justify-between shadow-xl z-50">
            <View className="flex-row items-center flex-1">
              <Image source={AlbumPic} className="w-10 h-10 rounded-sm mr-3" />
              <View className="flex-1">
                <Text className="text-white text-xs font-medium" numberOfLines={1}>
                  From Me to You - Mono / Remastered
                </Text>
                <View className="flex-row items-center mt-0.5">
                  <Bluetooth color="#1db954" size={10} />
                  <Text className="text-[#1db954] text-[10px] font-semibold ml-1 uppercase tracking-wider">BEATSPILL+</Text>
                </View>
              </View>
            </View>
            <View className="flex-row items-center gap-4 px-2">
              <TouchableOpacity>
                <Bluetooth color="#1db954" size={20} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Pause color="#ffffff" size={20} fill="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        </KeyboardAvoidingView>
      </SafeAreaView>
      </View>

  );
}
