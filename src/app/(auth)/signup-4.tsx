import { useState } from "react";
import { Text, TextInput } from "react-native";
import { router } from "expo-router";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";
import { useSignup } from "../../context/SignupContext";
import { useSignupMutation } from "@/hooks/use-auth";

export default function Signup4() {
  const { mutate: createAccount, isPending } = useSignupMutation();
  const { signupData, setName, resetSignup } = useSignup();
  const [name, setNameLocal] = useState(signupData.name || "");
  const [error, setError] = useState("");

  const handleNameChange = (value: string) => {
    const sanitizedValue = value.replace(/[^a-zA-Z\u00C0-\u024F\s'-]/g, "");
    setNameLocal(sanitizedValue);
    setError("");
  };

  const handleCreateAccount = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    if (!/^[a-zA-Z\u00C0-\u024F\s'-]+$/.test(trimmedName)) {
      setError("Name can only contain letters, spaces, hyphens, and apostrophes.");
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
        onChangeText={handleNameChange}
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
    </ArtistStepLayout>
  );
}
