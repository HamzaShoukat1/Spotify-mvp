import { View, Text, KeyboardAvoidingView, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { Heart, User, Share2, ListPlus, SquarePlay, Radio } from 'lucide-react-native'
import { AlbumPic } from '../../assets/images/index';
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router';

export default function AlbumControl() {
    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 w-full"
            >
               
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ alignItems: 'center',}}
                    >

                        <View className="shadow-2xl w-full flex items-center  shadow-black ">
                            <Image 
                                source={AlbumPic} 
                                className="  rounded-sm w-full max-w-[164px]"
                                resizeMode="contain"
                            />
                        </View>

                        {/* Title and Artist Info */}
                        <View className="items-center mb-10 px-6 ">
                            <Text className="text-white text-2xl font-bold text-center tracking-wide">
                                1(Remastered)
                            </Text>
                            <Text className="text-[#b3b3b3] text-sm mt-1 text-center font-medium">
                                The Beatles
                            </Text>
                        </View>

                        {/* Action Menu List */}
                        <View className="w-full flex gap-6  px-8 ">
                            
                            <TouchableOpacity className="flex-row items-center gap-3 py-1">
                                <Heart strokeWidth={1.5} size={22} color="#B3B3B3" />
                                <Text className="text-white text-base font-semibold">Like</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center gap-3  py-1">
                                <User strokeWidth={1.5} size={22} color="#B3B3B3" />
                                <Text className="text-white text-base font-semibold">View artist</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center gap-3 py-1">
                                <Share2 strokeWidth={1.5} size={22} color="#B3B3B3" />
                                <Text className="text-white text-base font-semibold">Share</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center gap-3 py-1">
                                <Heart strokeWidth={1.5} size={22} color="#B3B3B3" />
                                <Text className="text-white text-base font-semibold">Like all songs</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center gap-3 py-1">
                                <ListPlus strokeWidth={1.5} size={22} color="#B3B3B3" />
                                <Text className="text-white text-base font-semibold">Add to playlist</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center gap-3 py-1">
                                <SquarePlay strokeWidth={1.5} size={22} color="#B3B3B3" />
                                <Text className="text-white text-base font-semibold">Add to queue</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center gap-3 py-1">
                                <Radio strokeWidth={1.5} size={22} color="#B3B3B3" />
                                <Text className="text-white text-base font-semibold">Go to radio</Text>
                            </TouchableOpacity>

                        </View>

                        {/* Close Footer Action */}
                        <TouchableOpacity onPress={()=> router.back()} className="mt-8 py-4 w-full items-center">
                            <Text className="text-white text-base  font-semibold tracking-wider">
                                Close
                            </Text>
                        </TouchableOpacity>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
}
