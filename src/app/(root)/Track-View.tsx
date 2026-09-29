import { View, Text, KeyboardAvoidingView, Platform, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AlbumPic } from '../../assets/images/index';
import { ChevronDown, MoreHorizontal, Heart, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Share2, ListMusic, Maximize2 } from 'lucide-react-native'
import { router } from 'expo-router';

export default function TrackView() {
    return (
        <SafeAreaView className="flex-1 bg-[#86251b]">
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                className="flex-1 w-full px-6 justify-between pb-4"
            >
                {/* Header Section */}
                <View className="flex-row justify-between items-center mt-2">
                    <TouchableOpacity onPress={()=> router.back()}>
                        <ChevronDown color="#ffffff" size={24} />
                    </TouchableOpacity>
                    <Text className="text-white font-medium text-xs tracking-wider">1 (Remastered)</Text>
                    <TouchableOpacity>
                        <MoreHorizontal color="#ffffff" size={24} />
                    </TouchableOpacity>
                </View>

                {/* Album Art Container */}
                <View className="items-center justify-center my-6 flex-1  ">
                    <Image 
                        source={AlbumPic} 
                        className=" rounded-sm w-full h-full max-w-[400px]" 
                        resizeMode="contain"
                    />
                </View>

                {/* Track Info Section */}
                <View className="w-full mb-4">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-1 pr-4">
                            <Text numberOfLines={1} className="text-white font-bold text-xl tracking-wide">
                                From Me to You - Mono / Remast
                            </Text>
                            <Text numberOfLines={1} className="text-[#c7a4a1] text-sm mt-1">
                                The Beatles
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Heart color="#ffffff" size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Bar  */}
                    <View className="w-full  max-w-[402px] mt-4">
                        <View className="w-full h-[4px] bg-[#a6564e] rounded-full relative">
                            <View className="absolute left-0 top-0 bottom-0 w-[25%] bg-white rounded-full flex-row justify-end items-center">
                                <View className="w-2.5 h-2.5 rounded-full bg-white absolute -right-1" />
                            </View>
                        </View>
                        <View className="flex-row justify-between items-center mt-2">
                            <Text className="text-[#c7a4a1] text-xs">0:32</Text>
                            <Text className="text-[#c7a4a1] text-xs">-1:18</Text>
                        </View>
                    </View>
                </View>

                {/* Media  Section */}
                <View className="w-full mb-6">
                    <View className="flex-row justify-between items-center px-2">
                        <TouchableOpacity>
                            <Shuffle color="#c7a4a1" size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <SkipBack color="#ffffff" size={28} fill="#ffffff" />
                        </TouchableOpacity>
                        <TouchableOpacity className="w-16 h-16 bg-white rounded-full items-center justify-center">
                            <Pause color="#86251b" size={28} fill="#86251b" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <SkipForward color="#ffffff" size={28} fill="#ffffff" />
                        </TouchableOpacity>
                        <TouchableOpacity className="relative">
                            <Repeat color="#1ed760" size={20} />
                            <View className="w-1 h-1 bg-[#1ed760] rounded-full absolute -bottom-1.5 self-center" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-between items-center mt-6 px-1">
                        <View className="flex-row items-center">
                            <View className="w-2 h-3 bg-[#1ed760] transform rotate-12 mr-1 rounded-xs" /> 
                            <Text className="text-[#1ed760] text-[10px] font-bold tracking-wider uppercase">
                                BEATSPILL+
                            </Text>
                        </View>
                        <View className="flex-row items-center space-x-6">
                            <TouchableOpacity className="mr-5">
                                <Share2 color="#c7a4a1" size={18} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <ListMusic color="#c7a4a1" size={18} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View className="w-full bg-[#D8672A] rounded-xl p-4 flex-row justify-between items-center mb-1">
                    <Text className="text-white font-bold text-base">Lyrics</Text>
                    <TouchableOpacity onPress={()=> router.push("/(root)/Track-detail")} className="bg-[#a13b1d] flex-row items-center px-3 py-1.5 rounded-full space-x-1">
                        <Text className="text-white text-[10px] font-bold tracking-wider uppercase mr-1">MORE</Text>
                        <Maximize2 color="#ffffff" size={10} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
