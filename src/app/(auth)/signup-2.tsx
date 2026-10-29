import { useState } from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";
import { useSignup } from "../../context/SignupContext";
import { Eye, EyeOff } from "lucide-react-native";

export default function Signup2() {
  const { signupData, setPassword } = useSignup();
  const [password, setPasswordLocal] = useState(signupData.password);
  const [showPassword, setShowPassword] = useState(false);
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
      {/* Icon Wrapper Container */}
      <View 
        className={`h-14 w-full max-w-[365px] rounded-md bg-[#282828] flex-row items-center justify-between pr-4 ${
          error ? "border border-red-500" : "border border-transparent"
        }`}
      >
        <TextInput
          value={password}
          onChangeText={(value) => {
            setPasswordLocal(value);
            setError("");
          }}
          className="flex-1 h-full px-4 text-base text-white"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="password-new"
          textContentType="newPassword"
          selectionColor="#FFFFFF"
        />

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

      {error ? <Text className="mt-2 text-sm text-red-500">{error}</Text> : null}
    </ArtistStepLayout>
  );
}
