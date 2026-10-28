import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Check } from "lucide-react-native";
import { router } from "expo-router";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";
import { useSignup } from "../../context/SignupContext";

const genderOptions = ["Male", "Female", "Prefer not to say"] as const;

export default function Signup3() {
  const { signupData, setGender } = useSignup();
  const [selectedGender, setSelectedGender] = useState(signupData.gender);

  const handleNext = () => {
    if (!selectedGender) return;
    setGender(selectedGender);
    router.push("/signup-4");
  };

  return (
    <ArtistStepLayout
      step={3}
      title="What's your gender?"
      description="This helps us personalize your experience."
      onBack={() => router.back()}
      onNext={handleNext}
      nextLabel="Next"
    >
      <View className="gap-3">
        {genderOptions.map((gender) => {
          const isSelected = selectedGender === gender;

          return (
            <TouchableOpacity
              key={gender}
              onPress={() => setSelectedGender(gender)}
              activeOpacity={0.8}
              className={`h-14 flex-row items-center justify-between rounded-xl border px-4 ${
                isSelected
                  ? "border-[#1ED760] bg-[#142719]"
                  : "border-[#303030] bg-[#1B1B1B]"
              }`}
            >
              <Text className="text-base font-semibold text-white">{gender}</Text>
              {isSelected ? (
                <Check size={20} color="#1ED760" strokeWidth={3} />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </ArtistStepLayout>
  );
}
