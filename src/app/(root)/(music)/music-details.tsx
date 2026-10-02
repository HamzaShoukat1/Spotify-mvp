import { useState } from "react";
import { router } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";
import { useMusicContext } from "@/context/MusicContext";

const genres = ["Pop", "Hip-Hop", "Electronic", "Rock", "R&B", "Other"];
const languages = ["English", "Urdu", "Hindi", "Arabic", "Spanish", "Other"];

export default function MusicDetails() {
  const { musicDraft, updateMusic } = useMusicContext();
  const [musicName, setMusicName] = useState(musicDraft.musicName);
  const [artistName, setArtistName] = useState(musicDraft.artistName);
  const [genre, setGenre] = useState(musicDraft.genre);
  const [language, setLanguage] = useState(musicDraft.language);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!musicName.trim() || !artistName.trim() || !genre || !language) {
      setError("Complete all track details before continuing.");
      return;
    }

    updateMusic({
      musicName: musicName.trim(),
      artistName: artistName.trim(),
      genre,
      language,
    });
    router.push("/(root)/(music)/music-review");
  };

  return (
    <ArtistStepLayout
      step={2}
      totalSteps={3}
      title="Track details"
      description="Give your track the details listeners need to find it."
      onBack={() => router.back()}
      onNext={handleNext}
    >
      <Text className="mb-2 text-xs font-bold uppercase tracking-[1px] text-[#B3B3B3]">
        Song name
      </Text>
      <TextInput
        value={musicName}
        onChangeText={(value) => {
          setMusicName(value);
          setError("");
        }}
        placeholder="Enter song title"
        placeholderTextColor="#6F6F6F"
        className="h-14 rounded-xl border border-[#303030] bg-[#1B1B1B] px-4 text-base text-white"
        selectionColor="#1ED760"
      />
      <Text className="mb-2 mt-6 text-xs font-bold uppercase tracking-[1px] text-[#B3B3B3]">
        Primary artist
      </Text>
      <TextInput
        value={artistName}
        onChangeText={(value) => {
          setArtistName(value);
          setError("");
        }}
        placeholder="Artist name"
        placeholderTextColor="#6F6F6F"
        className="h-14 rounded-xl border border-[#303030] bg-[#1B1B1B] px-4 text-base text-white"
        selectionColor="#1ED760"
      />
      <Text className="mb-3 mt-6 text-xs font-bold uppercase tracking-[1px] text-[#B3B3B3]">
        Genre
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {genres.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => {
              setGenre(item);
              setError("");
            }}
            className={`rounded-full px-4 py-3 ${genre === item ? "bg-[#1ED760]" : "bg-[#282828]"}`}
          >
            <Text
              className={genre === item ? "font-bold text-black" : "text-white"}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text className="mb-3 mt-6 text-xs font-bold uppercase tracking-[1px] text-[#B3B3B3]">
        Language
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {languages.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => {
              setLanguage(item);
              setError("");
            }}
            className={`rounded-full px-4 py-3 ${language === item ? "bg-[#1ED760]" : "bg-[#282828]"}`}
          >
            <Text
              className={
                language === item ? "font-bold text-black" : "text-white"
              }
            >
              {item}
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
