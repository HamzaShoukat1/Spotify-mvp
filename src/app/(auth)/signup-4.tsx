import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Check } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSignup } from '../../context/SignupContext';
import { useSignupMutation } from '@/hooks/use-auth';

export default function Signup4() {
  const { mutate: AccountCreating, isPending } = useSignupMutation();
  const { signupData, setName, resetSignup } = useSignup();
  
  const [name, setNameLocal] = useState(signupData.name || '');
  const [error, setError] = useState('');
  const [newsOffers, setNewsOffers] = useState(false);
  const [shareData, setShareData] = useState(false);

  const handleCreateAccount = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }

    setName(trimmedName);

    AccountCreating(
      {
        email: signupData.email, 
        password: signupData.password,
        gender: signupData.gender,
        name: trimmedName,   
      },
      {
        onSuccess: () => {
          Alert.alert(
            'Account created',
            'Your account has been created successfully.',
            [
              {
                text: 'OK',
                onPress: () => {
                  resetSignup();
                  router.replace('/(onboarding)/Choose-Artist');
                },
              },
            ]
          );
        },
        onError: (err: any) => {
          setError(err instanceof Error ? err.message : 'Unable to create account.');
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-[#121212]"
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 justify-center relative">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4 p-2 bg-black rounded-full"
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-base font-extrabold">Create account</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="px-6 pt-8 pb-10"
        >
          {/* Question */}
          <Text className="text-white text-[20px] leading-[24px] font-bold mb-3 tracking-wide">
            What's your name?
          </Text>

          {/* Name Input */}
          <View className="bg-[#777777] h-14 rounded-[5px] w-full flex-row items-center justify-between px-4">
            <TextInput
              value={name}
              onChangeText={(value) => {
                setNameLocal(value);
                setError('');
              }}
              className="flex-1 text-white text-base"
              placeholder="Your name"
              placeholderTextColor="#a3a3a3"
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name"
              textContentType="name"
              selectionColor="#ffffff"
            />
            {name.trim().length > 0 ? (
              <Check size={20} color="#FFFFFF" strokeWidth={3} />
            ) : null}
          </View>

          <Text className="text-white text-[8px] font-[900] mt-2">
            This appears on your spotify profile
          </Text>

          {error ? (
            <Text className="text-red-500 text-[10px] mt-2">{error}</Text>
          ) : null}

          {/* Divider */}
          <View className="h-[1px] bg-[#333333] mt-4 mb-4" />

          {/* Terms */}
          <View className="w-full max-w-[333px] gap-[7px]">
            <Text className="text-[#FFFFFF] font-[600] text-[9px] leading-normal mb-3">
              By tapping on Create account, you agree to the spotify Terms of Use.
            </Text>
            <Text className="text-[#1ED760] text-[10px] mb-3">Terms of Use</Text>
            <Text className="text-[#FFFFFF] text-[10px] leading-normal mb-3">
              To learn more about how Spotify collects, uses, shares and protects your personal data, please see the Spotify Privacy Policy
            </Text>
          </View>
          <Text className="text-[#1ED760] text-[10px] mb-5">Privacy Policy</Text>

          {/* News & Offers */}
          <TouchableOpacity
            onPress={() => setNewsOffers(!newsOffers)}
            activeOpacity={0.8}
            className="flex-row items-start mb-5"
          >
            <Text className="flex-1 text-[#FFFFFF] text-[10px] leading-[12px]">
              Please send me news and offers from Spotify.
            </Text>
            <View
              className={`w-5 h-5 rounded-full border items-center justify-center mr-3 ${
                newsOffers ? 'border-white' : 'border-[#777777]'
              }`}
            >
              {newsOffers ? <View className="w-2.5 h-2.5 rounded-full bg-white" /> : null}
            </View>
          </TouchableOpacity>

          {/* Share Data */}
          <TouchableOpacity
            onPress={() => setShareData(!shareData)}
            activeOpacity={0.8}
            className="flex-row items-start"
          >
            <Text className="flex-1 text-[#FFFFFF] text-[10px] leading-[12px]">
              Share my registration data with Spotify's content providers for marketing purposes.
            </Text>
            <View
              className={`w-5 h-5 rounded-full border items-center justify-center mr-3 ${
                shareData ? 'border-white' : 'border-[#777777]'
              }`}
            >
              {shareData ? <View className="w-2.5 h-2.5 rounded-full bg-white" /> : null}
            </View>
          </TouchableOpacity>

          {/* Create Account Button */}
          <View className="items-center mt-10">
            <TouchableOpacity
              onPress={handleCreateAccount}
              disabled={isPending}
              activeOpacity={0.8}
              className="bg-white w-full max-w-[179px] py-3 items-center rounded-[21px]"
            >
              <Text className="text-black text-sm font-extrabold">
                {isPending ? 'Creating...' : 'Create an Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
