import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { apple, facebook, google, Logo, signupbg } from '../../assets/images/index';
import { router } from 'expo-router';

export default function Signup() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="w-full h-full bg-black"
    >
      {/* Background Image  */}
      <View className="left-0 right-0 bg-black">
        <Image
          source={signupbg}
          className="w-full max-w-[428px] h-full max-h-[370px] opacity-70 "
        />
      </View>


      {/* Main  Container */}
      <View className="  px-8 ">
        <View className="items-center mb-6 mt-2">

          <Text className="text-white text-[28px]  w-full max-w-[246px] font-[700] text-center tracking-[0px] leading-[100%]">
            Millions of Songs.{"\n"}Free on Spotify.
          </Text>
        </View>

        {/*  Buttons */}
        <View className="w-full max-w-[337px] gap-4">
          <TouchableOpacity  onPress={()=> router.push("/(auth)/signup-1")}className="bg-[#1ED760] py-3.5 rounded-[45px] items-center justify-center">
            <Text className="text-black font-bold leading-[100%]  font-[700] tracking-normal text-[16px]">Sign up free</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border border-gray-500 py-3.5 rounded-full flex-row items-center justify-center relative">
            <Image source={google} className="w-5 h-5 absolute left-6" resizeMode="contain" />
            <Text className="text-white font-bold text-base">Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border border-gray-500 py-3.5 rounded-full flex-row items-center justify-center relative">
            <Image source={facebook} className="w-5 h-5 absolute left-6" resizeMode="contain" />
            <Text className="text-white font-bold text-base">Continue with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border border-gray-500 py-3.5 rounded-full flex-row items-center justify-center relative">
            <Image source={apple} className="w-5 h-5 absolute left-6" resizeMode="contain" />
            <Text className="text-white font-bold text-base">Continue with Apple</Text>
          </TouchableOpacity>
        </View>


        <TouchableOpacity onPress={()=> router.push("/(auth)/login")} className="flex items-center mt-5 pb-2">
          <Text className="text-white font-bold text-[17px] leading-tight tracking-wide">Log in</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}
