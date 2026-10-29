import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useLoginMutation } from "@/hooks/use-auth";
import { Eye, EyeOff } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { mutate: loginUser, isPending } = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Please enter your email and password");
      return;
    }

    setError("");

    loginUser(
      {
        email: trimmedEmail,
        password,
      },
      {
        onSuccess: () => {
          router.replace("/(root)/(tabs)/home");
        },
        onError: (err: any) => {
          setError(
            err instanceof Error ? err.message : "Unable to login."
          );
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1 px-8 pt-4"
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 80}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Top/Middle Section Wrapper */}
          <View className="flex-1 justify-center w-full">
            <Text className="text-white text-[24px] font-bold text-center tracking-normal mb-8">
              Log in to Spotify
            </Text>

            {/* Email */}
            <View className="w-full mb-4">
              <Text className="text-white font-bold text-sm mb-2">
                Email
              </Text>

              <TextInput
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  setError("");
                }}
                className="bg-[#282828] text-white h-14 rounded-[5px] px-4 text-base border border-transparent"
                placeholder="Email"
                placeholderTextColor="#a7a7a7"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                selectionColor="#ffffff"
              />
            </View>

            {/* Password */}
            <View className="w-full mb-4">
              <Text className="text-white font-bold text-sm mb-2">
                Password
              </Text>

              {/* Icon Wrapper Container */}
              <View className="bg-[#282828] h-14 rounded-[5px] flex-row items-center justify-between pr-4 border border-transparent focus:border-white">
                <TextInput
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setError("");
                  }}
                  className="flex-1 text-white h-full px-4 text-base"
                  placeholder="Password"
                  placeholderTextColor="#a7a7a7"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="current-password"
                  textContentType="password"
                  selectionColor="#ffffff"
                  returnKeyType="go"
                  onSubmitEditing={handleSubmit}
                />

                {/* Eye Trigger Button */}
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                  className="p-1"
                >
                  {showPassword ? (
                    <EyeOff size={22} color="#a7a7a7" />
                  ) : (
                    <Eye size={22} color="#a7a7a7" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Error */}
            {error ? (
              <Text className="text-red-500 text-sm mb-3">
                {error}
              </Text>
            ) : null}

            {/* Action Buttons */}
            <View className="w-full items-center gap-4 mt-2">
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isPending}
                className={`w-full py-4 rounded-full items-center justify-center ${
                  isPending ? "bg-[#1ed760]/50" : "bg-[#1ED760]"
                }`}
              >
                <Text className="text-black font-bold text-[16px]">
                  {isPending ? "Connecting..." : "Continue"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/signup-1")}
            className="flex-row justify-center items-center mt-auto pt-4 pb-6"
          >
            <View className="flex-col items-center justify-center">
              <Text className="text-[#a7a7a7] text-sm">
                Don't have an account?
              </Text>
              <Text className="text-white font-bold text-sm underline">
                Sign up free
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
