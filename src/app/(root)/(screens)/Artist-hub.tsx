import { View, Text, KeyboardAvoidingView, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { Heart, User, Share2, ListPlus, SquarePlay, Radio, GalleryThumbnails, UserSearch, Users, Moon } from 'lucide-react-native'
import { AlbumPic } from '../../../assets/images/index';
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router';

export default function Artisthub() {
    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 w-full"
            >

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center', }}
                >



                    {/* Title and Artist Info */}
                    <View className="items-center mb-10 px-6 ">
                        <Text className="text-white text-2xl font-bold text-center tracking-wide">
                            Artist Hub
                        </Text>

                    </View>

                    <View className="w-full flex gap-6  px-8 ">

                        <TouchableOpacity className="flex-row items-center gap-3 py-1">
                            <Heart strokeWidth={1.5} size={22} color="#B3B3B3" />
                            <Text className="text-white text-base font-semibold">OverView</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push("/(root)/(music)/music-audio")} className="flex-row items-center gap-3  py-1">
                            <User strokeWidth={1.5} size={22} color="#B3B3B3" />
                            <Text className="text-white text-base font-semibold">Music</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push("/(root)/(screens)/Song-Share")} className="flex-row items-center gap-3 py-1">
                            <Share2 strokeWidth={1.5} size={22} color="#B3B3B3" />
                            <Text className="text-white text-base font-semibold">Albym</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center gap-3 py-1">
                            <Heart strokeWidth={1.5} size={22} color="#B3B3B3" />
                            <Text className="text-white text-base font-semibold">Analytics</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center gap-3 py-1">
                            <Heart strokeWidth={1.5} size={22} color="#B3B3B3" />
                            <Text className="text-white text-base font-semibold">Profile</Text>
                        </TouchableOpacity>




                    </View>

                    {/* Close Footer Action */}
                    <TouchableOpacity onPress={() => router.back()} className=" py-6 w-full items-center">
                        <Text className="text-white text-base  font-semibold tracking-wider">
                            Close
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
