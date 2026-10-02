import { useState } from "react";
import { router } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useArtistContext } from "@/context/ArtistContext";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";

const artistTypes = ["Solo artist", "Band", "Duo", "Producer"];

export default function ArtistProfile() {
  const { artistData, updateArtist } = useArtistContext();
  const [name, setName] = useState(artistData.name);
  const [artistType, setArtistType] = useState(artistData.artistType);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!name.trim() || !artistType) {
      setError("Add your name and choose an artist type.");
      return;
    }

    updateArtist({ name: name.trim(), artistType });
    router.push("/(root)/(artist)/artist-sound");
  };

  return (
    <ArtistStepLayout
      step={1}
      title="Build your artist profile"
      description="Start with the details your listeners will see first."
      onBack={() => router.back()}
      onNext={handleNext}
    >
      <Text className="mb-2 text-xs font-bold uppercase tracking-[1px] text-[#B3B3B3]">
        Artist name
      </Text>
      <TextInput
        value={name}
        onChangeText={(value) => {
          setName(value);
          setError("");
        }}
        placeholder="Your artist name"
        placeholderTextColor="#6F6F6F"
        className="h-14 rounded-xl border border-[#303030] bg-[#1B1B1B] px-4 text-base text-white"
        selectionColor="#1ED760"
      />
      <Text className="mb-3 mt-7 text-xs font-bold uppercase tracking-[1px] text-[#B3B3B3]">
        What best describes you?
      </Text>
      <View className="gap-3">
        {artistTypes.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => {
              setArtistType(type);
              setError("");
            }}
            className={`rounded-lg px-4 h-12 justify-center ${artistType === type ? "bg-[#1ED760]" : "bg-[#282828]"}`}
          >
            <Text
              className={
                artistType === type ? "font-bold text-black" : "text-white"
              }
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error ? (
        <Text className="mt-4 text-sm text-[#FF6B6B]">{error}</Text>
      ) : null}
    </ArtistStepLayout>
  );
}
