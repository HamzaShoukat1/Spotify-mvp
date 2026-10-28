import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import {
  Mail,
  UserRound,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useChangeUsername, useCurrentUser } from "@/hooks/use-auth";
import { ChangeUserNameModal } from "@/models/ChangeUsernameModal";
import Toast from "react-native-toast-message";
import { ChangeEmailModal } from "@/models/ChangeEmailModal";

export default function EditProfile() {
  const { data: UserDetails } = useCurrentUser();
  const { mutate } = useChangeUsername();
  const router = useRouter();

  const userName = UserDetails?.name?.trim() || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const userEmail = UserDetails?.email || "No email available";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const HandleUsernameChange = (newUserName: string) => {
    mutate(newUserName, {
      onSuccess: () => {
        setIsModalOpen(false);

        Toast.show({
          type: "success",
          position: "top",
          visibilityTime: 1800,
          text1: "Username updated successfully",
        });
      },
      onError: () => {
        Toast.show({
          type: "error",
          position: "top",
          visibilityTime: 1800,
          text1: "Could not update username",
          text2: "Please try again.",
        });
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* Header */}
          <View className="flex-row items-center px-5 pt-3 pb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="w-10 h-10 rounded-full bg-[#242424] items-center justify-center"
            >
              <ArrowLeft size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <Text className="text-white text-xl font-bold ml-4">
              Edit profile
            </Text>
          </View>

          {/* Profile Section */}
          <View className="items-center px-6 pt-5 pb-8">
            <View className="w-36 h-36 rounded-full bg-[#282828] items-center justify-center border border-[#3E3E3E]">
              <Text className="text-white text-6xl font-bold">
                {userInitial}
              </Text>
              {/* 
                            <View className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[#1ED760] items-center justify-center border-4 border-[#121212]">
                                <Pencil size={15} color="#000000" />
                            </View> */}
            </View>

            <Text
              className="text-white text-2xl font-bold mt-5"
              numberOfLines={1}
            >
              {userName}
            </Text>

            <Text className="text-[#B3B3B3] text-sm mt-2">
              Your Spotify profile
            </Text>
          </View>

      

          {/* Account Details */}
          <View className="px-5">
            <Text className="text-[#B3B3B3] text-xs font-bold tracking-widest mb-3">
              ACCOUNT DETAILS
            </Text>

            <View className="bg-[#181818] rounded-2xl overflow-hidden">
              {/* Username */}
              <TouchableOpacity
                onPress={() => setIsModalOpen(true)}
                activeOpacity={0.7}
                className="flex-row items-center px-4 py-5"
              >
                <View className="w-11 h-11 rounded-full bg-[#282828] items-center justify-center">
                  <UserRound size={21} color="#FFFFFF" strokeWidth={1.8} />
                </View>

                <View className="flex-1 ml-4">
                  <Text className="text-white text-base font-semibold">
                    Username
                  </Text>

                  <Text
                    className="text-[#B3B3B3] text-sm mt-1"
                    numberOfLines={1}
                  >
                    {userName}
                  </Text>
                </View>

                <ChevronRight size={22} color="#B3B3B3" />
              </TouchableOpacity>

              <View className="h-[1px] bg-[#282828] ml-[72px]" />

              {/* Email */}
              <TouchableOpacity
                onPress={() => setIsEmailModalOpen(true)}
                activeOpacity={0.7}
                className="flex-row items-center px-4 py-5"
              >
                <View className="w-11 h-11 rounded-full bg-[#282828] items-center justify-center">
                  <Mail size={21} color="#FFFFFF" strokeWidth={1.8} />
                </View>

                <View className="flex-1 ml-4">
                  <Text className="text-white text-base font-semibold">
                    Email address
                  </Text>

                  <Text
                    className="text-[#B3B3B3] text-sm mt-1"
                    numberOfLines={1}
                  >
                    {userEmail}
                  </Text>
                </View>

                <ChevronRight size={22} color="#B3B3B3" />
              </TouchableOpacity>
            </View>

            {/* Privacy Note */}
            <View className="flex-row items-start mt-6 px-1">
              <ShieldCheck size={19} color="#B3B3B3" strokeWidth={1.7} />

              <Text className="text-[#B3B3B3] text-xs leading-5 ml-3 flex-1">
                Keep your account details up to date so you can access your
                account without any issues.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action */}
        <View className="px-5 pt-4 pb-3 border-t border-[#282828]">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            className="py-4 items-center justify-center bg-[#FFFFFF] rounded-full"
          >
            <Text className="text-black text-base font-bold">Done</Text>
          </TouchableOpacity>
        </View>

        {/* Username Modal */}
        {isModalOpen && (
          <View className="absolute inset-0 z-[70]">
            <ChangeUserNameModal
              onClose={() => setIsModalOpen(false)}
              currentUsername={userName}
              onSave={HandleUsernameChange}
            />
          </View>
        )}

        {/* Email Modal */}
        {isEmailModalOpen && (
          <View className="absolute inset-0 z-[70]">
            <ChangeEmailModal
              currentEmail={userEmail}
              onClose={() => setIsEmailModalOpen(false)}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
