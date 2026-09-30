import { View, Text, Platform, KeyboardAvoidingView, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, X, MessageCircle, MoreHorizontal } from "lucide-react-native"
import { AlbumPic } from '../../../assets/images/index';
import { router } from 'expo-router';

export default function SongShare() {
    return (
        <SafeAreaView className="flex-1 ">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 w-full px-6 justify-between py-4"
            >
                {/* Header Section */}
                <View className="flex-row items-center justify-between w-full mt-2">
                    <TouchableOpacity onPress={()=> router.back()}>
                        <X color="#FFFFFF" size={24} />
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-semibold tracking-wide">Share</Text>
                    <View className="w-6" />
                </View>

                <View className="items-center justify-center flex-1 my-auto">
                    <View className="w-full justify-center items-center rounded-sm shadow-2xl  mb-8">
                        <Image
                            source={AlbumPic}
                            className="w-full max-w-[221px]"
                            resizeMode="contain"
                        />
                    </View>

                    <Text className="text-white text-[25px] w-full max-w-[290px] font-[600] text-center px-4 ">
                        From Me to You - Mono / Remastered
                    </Text>
                    <Text className="text-[#B3B3B3] text-base mt-2 font-medium">
                        The Beatles
                    </Text>
                </View>

                <View className="w-full max-w-[385px] pb-6">
                    <View className="flex-row justify-between items-center px-2 mb-6">
                        {/* Copy Link */}
                        <TouchableOpacity className="items-center flex-1">
                            <View className="w-14 h-14 bg-white rounded-full justify-center items-center mb-2">
                                <Link color="#000000" size={24} />
                            </View>
                            <Text className="text-white text-xs font-medium" numberOfLines={1}>Copy Link</Text>
                        </TouchableOpacity>

                        {/* What */}
                        <TouchableOpacity className="items-center flex-1">
                            <View className="w-14 h-14 bg-[#25D366] rounded-full justify-center items-center mb-2">
                                <Text className="text-white font-bold text-xl">W</Text>
                            </View>
                            <Text className="text-white text-xs font-medium" >WhatsApp</Text>
                        </TouchableOpacity>

                        {/* Twitter  */}
                        <TouchableOpacity className="items-center flex-1">
                            <View className="w-14 h-14 bg-[#1DA1F2] rounded-full justify-center items-center mb-2">
                                <Text className="text-white font-bold text-xl">T</Text>
                            </View>
                            <Text className="text-white text-xs font-medium" >Twitter</Text>
                        </TouchableOpacity>

                        {/* Messag */}
                        <TouchableOpacity className="items-center flex-1">
                            <View className="w-14 h-14 bg-[#34C759] rounded-full justify-center items-center mb-2">
                                <MessageCircle color="#FFFFFF" size={26} fill="#FFFFFF" />
                            </View>
                            <Text className="text-white text-xs font-medium">Messages</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row px-2">
                        <TouchableOpacity className="items-center w-[25%]">
                            <View className="w-14 h-14 bg-[#282828] rounded-full justify-center items-center mb-2">
                                <MoreHorizontal color="#FFFFFF" size={24} />
                            </View>
                            <Text className="text-white text-xs font-medium" >More</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
