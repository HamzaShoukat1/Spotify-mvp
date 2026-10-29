import { useState } from "react";
import { Text, TextInput } from "react-native";
import { router } from "expo-router";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";
import { useSignup } from "../../context/SignupContext";

export default function Signup1() {
  const { signupData, setEmail } = useSignup();
  const [email, setEmailLocal] = useState(signupData.email);
  const [error, setError] = useState("");

  const handleNext = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setEmail(trimmedEmail);
    router.push("/signup-2");
  };

  return (
    <ArtistStepLayout
      step={1}
      title="What's your email?"
      description="You'll need to confirm this email later."
      onBack={() => router.push("/(auth)/sign-up")}
      onNext={handleNext}
      nextLabel="Next"
    >
      <TextInput
        value={email}
        onChangeText={(value) => {
          setEmailLocal(value);
          setError("");
        }}
        className={`h-14 w-full max-w-[365px] rounded-md bg-[#282828] px-4 text-base text-white ${
          error ? "border border-red-500" : ""
        }`}
        placeholder="Email address"
        placeholderTextColor="#A3A3A3"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        selectionColor="#FFFFFF"
      />
      {error ? <Text className="mt-2 text-sm text-red-500">{error}</Text> : null}
    </ArtistStepLayout>
  );
}
