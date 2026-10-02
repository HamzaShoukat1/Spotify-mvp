import { useState } from "react";
import { router } from "expo-router";
import { Text, TextInput } from "react-native";
import { useArtistContext } from "@/context/ArtistContext";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";

export default function ArtistSound() {
  const { artistData, updateArtist } = useArtistContext();
  const [genres, setGenres] = useState(artistData.genres);
  const [bio, setBio] = useState(artistData.bio);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!genres.trim() || !bio.trim()) {
      setError("Add at least one genre and a short bio.");
      return;
    }
    updateArtist({ genres: genres.trim(), bio: bio.trim() });
    router.push("/(root)/(artist)/artist-images");
  };

  return (
    <ArtistStepLayout
      step={2}
      title="Shape your sound"
      description="Help new listeners understand what makes your music yours."
      onBack={() => router.back()}
      onNext={handleNext}
    >
      <Text className="mb-2 text-xs font-bold uppercase tracking-[1px] text-[#B3B3B3]">
        Genres
      </Text>
      <TextInput
        value={genres}
        onChangeText={(value) => {
          setGenres(value);
          setError("");
        }}
        placeholder="Pop, hip-hop, electronic"
        placeholderTextColor="#6F6F6F"
        className="h-14 rounded-xl border border-[#303030] bg-[#1B1B1B] px-4 text-base text-white"
        selectionColor="#1ED760"
      />
      <Text className="mb-2 mt-7 text-xs font-bold uppercase tracking-[1px] text-[#B3B3B3]">
        Your bio
      </Text>
      <TextInput
        value={bio}
        onChangeText={(value) => {
          setBio(value);
          setError("");
        }}
        placeholder="Tell listeners about your sound"
        placeholderTextColor="#6F6F6F"
        multiline
        textAlignVertical="top"
        className="h-40 rounded-xl border border-[#303030] bg-[#1B1B1B] px-4 py-4 text-base leading-6 text-white"
        selectionColor="#1ED760"
        maxLength={500}
      />
      <Text className="mt-2 text-right text-xs text-[#6F6F6F]">
        {bio.length}/500
      </Text>
      {error ? (
        <Text className="mt-4 text-sm text-[#FF6B6B]">{error}</Text>
      ) : null}
    </ArtistStepLayout>
  );
}
