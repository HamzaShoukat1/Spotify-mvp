import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Check } from "lucide-react-native";
import { router } from "expo-router";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";
import { useSignup } from "../../context/SignupContext";
import { useSignupMutation } from "@/hooks/use-auth";

export default function Signup4() {
  const { mutate: createAccount, isPending } = useSignupMutation();
  const { signupData, setName, resetSignup } = useSignup();
  const [name, setNameLocal] = useState(signupData.name || "");
  const [error, setError] = useState("");
  const [newsOffers, setNewsOffers] = useState(false);
  const [shareData, setShareData] = useState(false);

  const handleCreateAccount = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    setName(trimmedName);
    setError("");
    createAccount(
      {
        email: signupData.email,
        password: signupData.password,
        gender: signupData.gender,
        name: trimmedName,
      },
      {
        onSuccess: () => {
          resetSignup();
          router.replace("/(onboarding)/Choose-Artist");
        },
        onError: (requestError) => {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to create account."
          );
        },
      }
    );
  };

  return (
    <ArtistStepLayout
      step={4}
      title="What's your name?"
      description="Choose the name that will appear on your Spotify profile."
      onBack={() => router.back()}
      onNext={handleCreateAccount}
      nextLabel="Create account"
      isPending={isPending}
    >
      <TextInput
        value={name}
        onChangeText={(value) => {
          setNameLocal(value);
          setError("");
        }}
        className="h-14 w-full rounded-xl border border-[#303030] bg-[#282828] px-4 text-base text-white"
        placeholder="Your name"
        placeholderTextColor="#A3A3A3"
        autoCapitalize="words"
        autoCorrect={false}
        autoComplete="name"
        textContentType="name"
        selectionColor="#FFFFFF"
      />

      {error ? <Text className="mt-2 text-sm text-red-500">{error}</Text> : null}

      <View className="mt-6 border-t border-[#333333] pt-5">
        <Text className="text-sm leading-5 text-white">
          By creating an account, you agree to Spotify's Terms of Use and
          acknowledge the Privacy Policy.
        </Text>
        <Text className="mt-3 text-sm font-semibold text-[#1ED760]">
          Terms of Use · Privacy Policy
        </Text>
      </View>

      {/* <View className="mt-7 gap-5">
        <TouchableOpacity
          onPress={() => setNewsOffers((value) => !value)}
          activeOpacity={0.8}
          className="flex-row items-center"
        >
          <View
            className={`mr-3 h-6 w-6 items-center justify-center rounded-full border ${
              newsOffers ? "border-[#1ED760] bg-[#1ED760]" : "border-[#777777]"
            }`}
          >
            {newsOffers ? <Check size={15} color="#000000" strokeWidth={3} /> : null}
          </View>
          <Text className="flex-1 text-sm leading-5 text-white">
            Send me news and offers from Spotify.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShareData((value) => !value)}
          activeOpacity={0.8}
          className="flex-row items-center"
        >
          <View
            className={`mr-3 h-6 w-6 items-center justify-center rounded-full border ${
              shareData ? "border-[#1ED760] bg-[#1ED760]" : "border-[#777777]"
            }`}
          >
            {shareData ? <Check size={15} color="#000000" strokeWidth={3} /> : null}
          </View>
          <Text className="flex-1 text-sm leading-5 text-white">
            Share my registration data with Spotify's content providers for
            marketing purposes.
          </Text>
        </TouchableOpacity>
      </View> */}
    </ArtistStepLayout>
  );
}
