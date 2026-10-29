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

      {/* Main Container */}
      <View className="px-8 items-center">
        <View className="items-center mb-6 mt-2">
          <Text className="text-white text-[28px] w-full max-w-[246px] font-[700] text-center tracking-[0px] leading-[100%]">
            Millions of Songs.{"\n"}Free on Spotify.
          </Text>
        </View>

        {/* Buttons Container */}
        <View className="w-full max-w-[337px] gap-4">
          {/* Sign Up Button */}
          <TouchableOpacity  
            onPress={() => router.push("/(auth)/signup-1")}
            className="bg-[#1ED760] py-4 rounded-[45px] items-center justify-center"
          >
            <Text className="text-black text-[16px] font-[700] tracking-normal leading-[100%]">
              Sign up free
            </Text>
          </TouchableOpacity>

          {/* Improved Log In Button */}
          <TouchableOpacity 
            onPress={() => router.push("/(auth)/login")} 
            className="border border-[#7f7f7f] py-4 rounded-[45px] items-center justify-center active:bg-[#1c1c1c]"
          >
            <Text className="text-white text-[16px] font-[700] tracking-normal leading-[100%]">
              Log in
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}
