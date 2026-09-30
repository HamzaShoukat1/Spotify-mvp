import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ChevronLeft } from "lucide-react-native";

import { router } from "expo-router";

import { useSignup } from "../../context/SignupContext";

export default function Signup1() {
  const { signupData, setEmail } = useSignup();

  const [email, setEmailLocal] = useState(
    signupData.email
  );

  const [error, setError] = useState("");

  const handleNext = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;trimmedEmail
    }

    setEmail(trimmedEmail);

    setError("");

    router.push("/signup-2");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        className="flex-1 bg-[#121212]"
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 justify-center relative">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4 p-2 bg-black rounded-full"
            activeOpacity={0.7}
          >
            <ChevronLeft
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text className="text-white text-base font-extrabold">
            Create account
          </Text>
        </View>

        {/* Main Content */}
        <View className="flex-1 px-6 pt-8">
          <Text className="text-white text-[20px] leading-[24px] font-bold mb-3 tracking-wide">
            What's your email?
          </Text>

          {/*  Input */}
          <TextInput
            value={email}
            onChangeText={(value) => {
              setEmailLocal(value);
              setError("");
            }}
            className={`bg-[#777777] text-white h-14 rounded-[5px] w-full max-w-[365px] px-4 text-base mb-2 ${
              error
                ? "border border-red-500"
                : ""
            }`}
            placeholderTextColor="#a3a3a3"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            selectionColor="#ffffff"
          />

          <Text className="text-white text-[8px] font-[900]">
            You'll need to confirm this email later.
          </Text>

          {/* Error */}
          {error ? (
            <Text className="text-red-500 text-[10px] mt-2">
              {error}
            </Text>
          ) : null}

          {/* Next */}
          <View className="items-center mt-12">
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.8}
              className={` py-3 px-10 rounded-[21px] ${email ? "bg-white" : "bg-[#535353]"}`}
            >
              <Text className="text-black text-base font-bold">
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}