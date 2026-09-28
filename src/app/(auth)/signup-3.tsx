import React, { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ChevronLeft, Check } from "lucide-react-native";

import { router } from "expo-router";

import { useSignup } from "../../context/SignupContext";

const genderOptions = [
  "Male",
  "Female",
  "Prefer not to say",
] as const;

export default function Signup3() {
  const { signupData, setGender } = useSignup();

  const [selectedGender, setSelectedGender] =
    useState(signupData.gender);

  const handleNext = () => {
    if (!selectedGender) {
      return;
    }

    setGender(selectedGender);

    router.push("/signup-4");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <View className="flex-1 bg-[#121212]">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 justify-center relative">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4 p-2 bg-black rounded-full"
            activeOpacity={0.7}
          >
            <ChevronLeft
              size={15}
              color="#777777"
            />
          </TouchableOpacity>

          <Text className="text-white text-base font-extrabold">
            Create account
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-6 pt-8">
          <Text className="text-white text-[20px] leading-[24px] font-bold mb-3 tracking-wide">
            What's your gender?
          </Text>

          {/* Gender Options */}
          <View className="gap-2">
            {genderOptions.map((gender) => {
              const isSelected =
                selectedGender === gender;

              return (
                <TouchableOpacity
                  key={gender}
                  onPress={() =>
                    setSelectedGender(gender)
                  }
                  activeOpacity={0.8}
                  className="bg-[#777777] h-14 rounded-[5px] px-4 flex-row items-center justify-between"
                >
                  <Text className="text-white text-base font-semibold">
                    {gender}
                  </Text>

                  {isSelected ? (
                    <Check
                      size={20}
                      color="#FFFFFF"
                      strokeWidth={3}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Next */}
          <View className="items-center mt-12">
            <TouchableOpacity
              onPress={handleNext}
              disabled={!selectedGender}
              activeOpacity={0.8}
              className={`py-3 px-10 rounded-[21px] ${
                selectedGender
                  ? "bg-white"
                  : "bg-[#303030]"
              }`}
            >
              <Text
                className={`text-base font-bold ${
                  selectedGender
                    ? "text-black"
                    : ""
                }`}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}