import { useState } from "react";
import { Text, TextInput } from "react-native";
import { router } from "expo-router";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";
import { useSignup } from "../../context/SignupContext";

export default function Signup2() {
  const { signupData, setPassword } = useSignup();
  const [password, setPasswordLocal] = useState(signupData.password);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    setPassword(password);
    router.push("/signup-3");
  };

  return (
    <ArtistStepLayout
      step={2}
      title="Create a password"
      description="Use at least 8 characters to keep your account secure."
      onBack={() => router.back()}
      onNext={handleNext}
      nextLabel="Next"
    >
      <TextInput
        value={password}
        onChangeText={(value) => {
          setPasswordLocal(value);
          setError("");
        }}
        className={`h-14 w-full max-w-[365px] rounded-md bg-[#282828] px-4 text-base text-white ${
          error ? "border border-red-500" : ""
        }`}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password-new"
        textContentType="newPassword"
        selectionColor="#FFFFFF"
      />
      {error ? <Text className="mt-2 text-sm text-red-500">{error}</Text> : null}
    </ArtistStepLayout>
  );
}
