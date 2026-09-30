import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import { google, facebook } from '../../assets/images/index';
import { router } from 'expo-router';
import { useLoginMutation } from '@/hooks/use-auth';

export default function Login() {
    const { mutate: loginUser, isPending } = useLoginMutation();
    const [email, setEmailLocal] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setError("Please enter your email");
            return;
        }



        setError("");

        loginUser(
            { email: trimmedEmail },
            {
                onSuccess: () => {
                    Alert.alert(
                        'Welcome Back',
                        'Logged in successfully.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    router.replace('/(root)/(tabs)/home');
                                },
                            },
                        ]
                    );
                },
                onError: (err: any) => {
                    setError(err instanceof Error ? err.message : 'Unable to login.');
                },
            }
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-black"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Title */}
                <Text className="text-white text-[24px] font-bold text-center tracking-normal mb-8">
                    Log in to Spotify
                </Text>

                {/* Input Container */}
                <View className="w-full mb-4">
                    <Text className="text-white font-bold text-sm mb-2">
                        Email
                    </Text>
                    <TextInput
                        value={email}
                        onChangeText={(value) => {
                            setEmailLocal(value);
                            setError("");
                        }}
                        className={`bg-[#282828] text-white h-14 rounded-[5px] px-4 text-base ${error ? "border border-red-500" : "border border-transparent"
                            }`}
                        placeholder="Email"
                        placeholderTextColor="#a7a7a7"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        textContentType="emailAddress"
                        selectionColor="#ffffff"
                    />
                    {error ? <Text className="text-red-500 text-xs mt-1">{error}</Text> : null}
                </View>

                {/* Action Buttons */}
                <View className="w-full items-center gap-4 mt-2">
                    {/* Main Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isPending}
                        className={`w-full py-4 rounded-full items-center justify-center ${isPending ? 'bg-[#1ed760]/50' : 'bg-[#1ED760]'}`}
                    >
                        <Text className="text-black font-bold text-[16px]">
                            {isPending ? 'Connecting...' : 'Continue'}
                        </Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View className="flex-row items-center my-2 w-full">
                        <View className="flex-1 h-[1px] bg-[#404040]" />
                        <Text className="text-white text-xs font-bold mx-4 uppercase tracking-wider">or</Text>
                        <View className="flex-1 h-[1px] bg-[#404040]" />
                    </View>

                    {/* Social Buttons */}
                    <TouchableOpacity className="border border-[#727272] w-full py-3.5 rounded-full flex-row items-center justify-center relative">
                        <Image source={google} className="w-5 h-5 absolute left-6" resizeMode="contain" />
                        <Text className="text-white font-bold text-base">Continue with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="border border-[#727272] w-full py-3.5 rounded-full flex-row items-center justify-center relative">
                        <Image source={facebook} className="w-5 h-5 absolute left-6" resizeMode="contain" />
                        <Text className="text-white font-bold text-base">Continue with Facebook</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer Navigation */}
                <TouchableOpacity
                    onPress={() => router.push("/(auth)/signup-1")}
                    className="flex-row justify-center items-center mt-8 pb-6"
                >
                    <View className='flex flex-col items-center justify-center '>
                        <Text className="text-[#a7a7a7] text-sm">Don't have an account? </Text>
                        <Text className="text-white font-bold text-sm underline">Sign up free</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
