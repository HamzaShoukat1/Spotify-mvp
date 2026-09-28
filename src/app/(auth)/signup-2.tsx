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

export default function Signup2() {
  const { signupData, setPassword } = useSignup();

  const [password, setPasswordLocal] =
    useState(signupData.password);

  const [error, setError] = useState("");

  const handleNext = () => {
    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Your password must be at least 8 characters."
      );
      return;
    }

    setPassword(password);

    setError("");

    router.push("/signup-3");
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

        {/* Content */}
        <View className="flex-1 px-6 pt-8">
          <Text className="text-white text-[20px] leading-[24px] font-bold mb-3 tracking-wide">
            Create a password
          </Text>

          {/* Password Input */}
          <TextInput
            value={password}
            onChangeText={(value) => {
              setPasswordLocal(value);
              setError("");
            }}
            className={`bg-[#777777] text-white h-14 rounded-[5px] w-full max-w-[365px] px-4 text-base mb-2 ${
              error
                ? "border border-red-500"
                : ""
            }`}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password-new"
            textContentType="newPassword"
            selectionColor="#ffffff"
          />

          {/* Helper */}
          <Text className="text-white text-[8px] font-[900]">
            Use at least 8 characters.
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
                            className={` py-3 px-10 rounded-[21px] ${password ? "bg-white" : "bg-[#535353]"}`}

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